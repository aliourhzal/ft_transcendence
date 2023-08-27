import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { Server, Socket } from 'socket.io'
import { UsersService } from "src/users/users.service";
import { AcheivementsService } from "src/users/achievements.service";
import { Player, userNode, roomT, Ball, Specials } from "./Player";



@WebSocketGateway(3003, { cors: true } ) //tell's the class that it using socket not http and use the port 3003 instead of default one 3000
export class myGateAway implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server:Server;

	private connectedUsers: {socket: Socket, nickname: string}[] = [];
	private gameQueue: userNode[] = [];

	private rooms : roomT[] = [];

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly achievementsService: AcheivementsService
	) {}

	OnWebSocektError(socket:Socket)
    {
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }

	async handleDisconnect(socket: Socket) {///delete room when someone disconnected
		console.log(this.connectedUsers.find(x => x.socket === socket ).nickname ,' : has disconnected from game socket')//
		try {
			const room = this.rooms.find(x => x.player1.socket === socket || x.player2.socket === socket);
			if (room.player1.gameGoing === true || room.player2.gameGoing === true)
			{
				room.player1.gameGoing = room.player2.gameGoing = false;
				if (room.player1.score !== room.player2.score)
				{
					await this.usersService.createMatch(room.player1.nickName, room.player2.nickName, (room.player1.socket.connected ? 8 : 0), (room.player2.socket.connected ? 8 : 0));
					// await this.usersService.createMatch(room.player1.nickName, room.player2.nickName, room.player1.score, room.player2.score);
					this.server.to(room.roomId).emit("gameOver", 
						room[room.player1.socket.connected ? 'player1' : 'player2'].socket.id);
						// room[room.player1.score > room.player2.score ? 'player1' : 'player2'].socket.id);
				}
				else
					this.server.to(room.roomId).emit("gameOver", "draw");
			}
			clearInterval(this.rooms.find(x => 
				x.player1.socket === socket || x.player2.socket === socket
			).loop);
		}
		catch(e){}
		const disconnectedUser = this.connectedUsers.findIndex(x => x.socket.id === socket.id);
		if (disconnectedUser === -1)
			return ;
		this.connectedUsers.splice(disconnectedUser, 1);
		const QueuedUser = this.gameQueue.findIndex(x => x.socket.id === socket.id);
		if (QueuedUser === -1)
			return ;
		this.gameQueue.splice(QueuedUser, 1);
	}

	async update(room: roomT) {
		if (room.player1.ball.x - room.ballDynamics.radius < -20)//
		{	
			room.player2.score += 1;
			room.player2.height = room.player2.canvas.height / 4;
			room.player1.height = room.player1.canvas.height / 4;
			await this.achievementsService.checkHatTrick(room.player2, room.player1);
			this.server.to(room.roomId).emit("score", {soc:room.player2.socket.id, p1:room.player2.score, p2:room.player1.score});
		}
		
		else if (room.player1.ball.x + room.ballDynamics.radius > room.player1.canvas.width + 20)
		{
			room.player1.score += 1;
			room.player2.height = room.player2.canvas.height / 4;
			room.player1.height = room.player1.canvas.height / 4;
			await this.achievementsService.checkHatTrick(room.player1, room.player2);
			this.server.to(room.roomId).emit("score", {soc:room.player1.socket.id, p1:room.player1.score, p2:room.player2.score})
		}

		if (room.player1.score === 7 || room.player2.score === 7)//
		{
			room.player1.gameGoing = room.player2.gameGoing = false;
			await this.usersService.createMatch(room.player1.nickName, room.player2.nickName, room.player1.score, room.player2.score);
			clearInterval(room.loop);
			await this.achievementsService.checkForAchievement(room.player1, room.player2);
			this.server.to(room.roomId).emit("gameOver", 
				room[room.player1.score === 7 ? 'player1' : 'player2'].socket.id
			);
			return ;
		}
		
		if (room.player1.ball.x - room.ballDynamics.radius < -20 || room.player1.ball.x + room.ballDynamics.radius > room.player1.canvas.width + 20) {
			room.ballDynamics.resetForNewGame();
			room.player1.resetBall(room.player1.canvas.width / 2, room.player1.canvas.height / 2);
			room.player2.resetBall(room.player1.canvas.width / 2, room.player1.canvas.height / 2);
		}
		room.player1.moveBall(room.ballDynamics.velocityX, room.ballDynamics.velocityY);
		room.player2.moveBall(-room.ballDynamics.velocityX, -room.ballDynamics.velocityY)
		if(room.player1.ball.y - room.ballDynamics.radius < 0 || room.player1.ball.y + room.ballDynamics.radius > room.player1.canvas.height) {
			if (room.player1.ball.y - room.ballDynamics.radius < 0) {
				room.player1.correctHorizantalColl(room.ballDynamics.radius + 1);
				room.player2.correctHorizantalColl(room.player1.canvas.height - room.ballDynamics.radius + 1);
			}
			else {
				room.player1.correctHorizantalColl(room.player1.canvas.height - room.ballDynamics.radius + 1);
				room.player2.correctHorizantalColl(room.ballDynamics.radius + 1);
			}
			room.ballDynamics.velocityY = -room.ballDynamics.velocityY;
		}
		if (room.hell && room.player1.height >= room.player1.canvas.height / 10 ) {
			room.player1.height -= room.player1.canvas.height * 0.01 / 450;
			room.player2.height -= room.player2.canvas.height * 0.01 / 450;
		}

		if (room.specialsMode && room.specials.isSpecialActivated() && !room.specials.sent) {
			room.specials.sent = true;
			this.server.to(room.player1.socket.id).emit('special_effect', {
				x: room.specials.position.x,
				y: room.specials.position.y,
				type: room.specials.getSpecial()
			})
			this.server.to(room.player2.socket.id).emit('special_effect', {
				x: (room.player1.canvas.width - room.specials.position.x) * (room.player2.canvas.width / room.player1.canvas.width),
				y: (room.player1.canvas.height - room.specials.position.y) * (room.player2.canvas.height / room.player1.canvas.height),
				type: room.specials.getSpecial()
			})
		}

		this.server.to(room.player1.socket.id).emit('game_Data', {
			x: room.player1.ball.x,
			y: room.player1.ball.y,
			ph: room.player1.height,
			ch: room.player2.height * room.player1.canvas.height / room.player2.canvas.height
		})
		this.server.to(room.player2.socket.id).emit('game_Data', {
			x: room.player2.ball.x * room.player2.canvas.width / room.player1.canvas.width,
			y: room.player2.ball.y * room.player2.canvas.height / room.player1.canvas.height,
			ph: room.player2.height,
			ch: room.player1.height * room.player2.canvas.height / room.player1.canvas.height
		})
	}

	findOpponentBySocket(socket: Socket): Socket {
		let sock: Socket;
		this.rooms.map((room) => {
			if (room.player1.socket.id === socket.id)
				sock = room.player2.socket;
			if (room.player2.socket.id === socket.id)
				sock = room.player1.socket;
		});
		return sock;
	}

	findRoomBySocket(socket: Socket)
	{
		return this.rooms.find(room => {
			return room.player1.socket.id === socket.id || room.player2.socket.id === socket.id
		});
	}

	findPlayerInRoom(socket: Socket)
	{
		let room: roomT;
		room = this.findRoomBySocket(socket);
		return (socket === room.player1.socket ? room.player1.socket : room.player2.socket)
	}

	findPlayerByRoom_SockerId(room : roomT, id: string)
	{
		return (room.player1.socket.id === id ? room.player1 : room.player1.socket.id === id ? room.player2 : null)
	}

	checkPlayerOrder(socket: Socket, room: roomT) {
		if(socket.id === room.player1.socket.id)
			return (1);
		return (2);
	}

	async startGame(room: roomT) {
		room.player1.score = 0;
		room.player2.score = 0;
		let framePerSecond = 50;
		if (room.specialsMode)
			room.specials.activateSpecial(room.player1.canvas.height, room.player1.canvas.width);
		room.loop = setInterval(() => {
			this.update(room);
		},1000/framePerSecond);
		return ;
	}

	async createGameRoom() {
		const roomId = randomUUID();
		const ballDynamics = new Ball();
		const player1Socket = this.gameQueue[0].socket;
		const player2Socket = this.gameQueue[1].socket;
		player1Socket.join(roomId);
		player2Socket.join(roomId);

		const newRoom:roomT = {
			player1: new Player(player1Socket),
			player2: new Player(player2Socket),
			roomId,
			ballDynamics,
			loop: null,
			hell: false,
			specialsMode: false,
			specials: new Specials()
		};
		newRoom.player1.setData(this.gameQueue[0].user.nickName, this.gameQueue[0].user.avatar);
		newRoom.player2.setData(this.gameQueue[1].user.nickName, this.gameQueue[1].user.avatar);
		this.server.to(newRoom.player1.socket.id).emit("playersInfo", {nickname:newRoom.player2.nickName,
								avatar:newRoom.player2.avatar});
		this.server.to(newRoom.player2.socket.id).emit("playersInfo", {nickname:newRoom.player1.nickName,
								avatar:newRoom.player1.avatar});
		
		newRoom.player1.gameGoing = newRoom.player2.gameGoing = true; //set the game as started
		this.rooms.push(newRoom);
		this.gameQueue.splice(0, 2);
		setTimeout(()=>{
			this.server.to(roomId).emit("send_canva_W_H");
			this.startGame(newRoom);
		}, 3000);
	}

	async handleConnection(socket: Socket) {
		let player = new Player(socket);
		console.log('the user connected to game socket');
		let decodeJWt: any;
		try {
			decodeJWt = this.jwtService.verify(socket.handshake.auth.token, {
				secret: process.env.JWT_SECRET
			})
		} catch (err) {
			this.OnWebSocektError(socket);
		}
		if (!decodeJWt)
		{
			this.OnWebSocektError(socket);
			return ;
		}
		const user = await this.usersService.findOneByNickname(decodeJWt.nickname);
		if (!user) {
			this.OnWebSocektError(socket);
		}
		this.connectedUsers.push({socket, nickname: user.nickname});
		player.setData(user.nickname, user.profilePic);
		this.gameQueue.push({socket, user: player});
		if (this.gameQueue.length < 2 || this.connectedUsers.length < 2)
			return ;
		if (this.gameQueue[0].user.nickName === this.gameQueue[1].user.nickName)
		{
			this.gameQueue.pop();
			return ;
		}
		// if (this.connectedUsers[0].nickname === this.connectedUsers[1].nickname)
		// {
		// 	this.connectedUsers.splice(0, 1);
		// 	return ;
		// }
		this.createGameRoom();
	}

	@SubscribeMessage('player')
	handleEvent(socket: Socket, data: {x: number;y: number;collision: boolean;collAngle: number;h:number}) {
		const room = this.findRoomBySocket(socket);
		let emiter: Player;
		let receiver: Player;
		if (this.checkPlayerOrder(socket, room) === 1) {
			emiter = room.player1;
			receiver = room.player2;
		} else {
			emiter = room.player2;
			receiver = room.player1;
		}
		if (data.collision)
		{
			if (socket.id === room.player2.socket.id)
			{
				const a = 1.5708 - data.collAngle; // the angle between collAngle and 90deg
				const mirrorAngle = data.collAngle + 2 * a;
				data.collAngle = -mirrorAngle;
			}
			room.ballDynamics.velocityX = room.ballDynamics.speed * Math.cos(data.collAngle);
			room.ballDynamics.velocityY = room.ballDynamics.speed * Math.sin(data.collAngle);
			room.ballDynamics.speed += 0.2;
		}
		const newY = emiter.canvas.height - data.y - data.h;//hna
		// const newY = emiter.canvas.height - data.y - miter.height;//hna
		this.server.to(receiver.socket.id).emit("playerMov", {x: data.x, y: newY * receiver.canvas.height / emiter.canvas.height});
	}

	@SubscribeMessage('startGame')
	setStyles(socket: Socket, data: {w:number, h:number, hell: boolean, specials: boolean})
	{
		const room = this.findRoomBySocket(socket);
		if (room && this.checkPlayerOrder(socket, room) === 1) {
			room.hell = data.hell;
			room.specialsMode = data.specials;
			if (room.specialsMode)
			{
				this.findPlayerByRoom_SockerId(room, socket.id).special = true;
				room.specials.activateSpecial(data.h, data.w);
			}
			room.player1.initBallPos(data.w / 2, data.h / 2, data.w * 10 / 800);
			room.player2.initBallPos(data.w / 2, data.h / 2, data.w * 10 / 800);
			room.player1.setCanvasDim(data.h, data.w);
		}
		else if (room && this.checkPlayerOrder(socket, room) === 2) {
			room.player2.setCanvasDim(data.h, data.w);
		}
	}
	@SubscribeMessage('resize')
	resize(socket: Socket, data: {w:number, h:number})
	{
		const room = this.findRoomBySocket(socket);
		if (room && this.checkPlayerOrder(socket, room) === 1) {
			room.player1.setCanvasDim(data.h, data.w);
		}
		else if (room && this.checkPlayerOrder(socket, room) === 2) {
			room.player2.setCanvasDim(data.h, data.w);
		}
	}

	@SubscribeMessage('consume-special')
	consumeSpecial(socket: Socket) {
		const room = this.findRoomBySocket(socket);
		if (room.player1.special === false || room.player2.special === false)
			return ;
		if (room) {
			room.specials.desactivateSpecial();
			setTimeout(() => {
				room.player1.resetHeight();
				room.player2.resetHeight();
				room.specials.activateSpecial(room.player1.canvas.height, room.player1.canvas.width);
			}, 6000);
		}
		if (room && room.ballDynamics.velocityX > 0) {
			const special = room.specials.getSpecial();
			console.log(special);
			if (special === 'big_foot') {
				room.player1.height = room.player1.canvas.height;
				this.server.to(room.player1.socket.id).emit('activate-special', {
					type: room.specials.getSpecial(),
					role: 'me'
				})
				this.server.to(room.player2.socket.id).emit('activate-special', {
					type: room.specials.getSpecial(),
					role: 'opponent'
				})
			}
			else if (special === 'dwarf') {
				console.log('apply for player1');
				room.player2.height = room.player2.canvas.height / 10;
				this.server.to(room.roomId).emit('activate-special', {
					type: room.specials.getSpecial()
				})
			}
		}
		else if (room && room.ballDynamics.velocityX < 0) {
			const special = room.specials.getSpecial();
			if (special === 'big_foot') {
				room.player2.height = room.player2.canvas.height;
				this.server.to(room.player2.socket.id).emit('activate-special', {
					type: room.specials.getSpecial(),
					role: 'me'
				})
				this.server.to(room.player1.socket.id).emit('activate-special', {
					type: room.specials.getSpecial(),
					role: 'opponent'
				})
			}
			else if (special === 'dwarf') {
				console.log('apply for player2');
				room.player1.height = room.player1.canvas.height / 10;
				this.server.to(room.roomId).emit('activate-special', {
					type: room.specials.getSpecial()
				})
			}
		}
	}
}

//socket.broadcast.emit("event", ...); 		: send a message to all but not your self