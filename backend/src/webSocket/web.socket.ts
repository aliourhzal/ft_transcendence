import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { find } from "rxjs";
import { Server, Socket } from 'socket.io'
import { UsersService } from "src/users/users.service";

class Player {
	canvas: canvasDim;
	readonly socket: Socket;
	ball: coords;
	score: number;
	nickName: string;
	avatar: string;

	constructor(socket: Socket, height = 0, width = 0, score = 0) {
		this.canvas = {height, width};
		this.socket = socket;
		this.ball = {x: 0, y: 0};
	}

	moveBall(velocityX: number, velocityY: number) {
		this.ball.x += velocityX;
		this.ball.y += velocityY;
	}

	resetBall(x: number, y: number) {
		this.ball = {x, y};
	}

	correctHorizantalColl(y: number) {
		this.ball.y = y;
	}

	setCanvasDim(height: number, width: number) {
		this.canvas = {height, width}
	}

	initBallPos(x: number, y: number) {
		this.ball = {x, y};
	}

	setData(nickName: string, avatar: string)
	{
		this.nickName = nickName;
		this.avatar = avatar;
	}
}

type userNode = {
	socket: Socket,
	user: Player
}

type paddleInfo = {
	x: number,
	y: number,
	collision: boolean,
	collAngle: number
}

type coords = {
	x: number,
	y: number
}

type canvasDim = {
	height: number,
	width: number,
}

type playerInfo = {
	canvas: canvasDim,
	socket: Socket,
	ball: coords
}

type roomT = {
	loop: NodeJS.Timer,
	player1: Player,
	player2: Player,
	roomId: string,
	ballDynamics: Ball
}

class Ball {
	radius = 10;
	velocityX = 5; //ball direction
	velocityY = 5;
	speed = 7;
	color = "WHITE";

	resetForNewGame() {
		this.speed = 7;
		this.velocityX = 5;
		this.velocityY = 5;
	}
}

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
		private readonly usersService: UsersService	
	) {}

	OnWebSocektError(socket:Socket)
    {
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }

	handleDisconnect(socket: Socket) {///delete room when someone disconnected
		console.log(this.connectedUsers.find(x => x.socket === socket ).nickname ,' : has disconnected from game socket')//
		try {
			clearInterval(this.rooms.find(x => 
				x.player1.socket === socket || x.player2.socket === socket
			).loop);
		}
		catch(e){}
		const disconnectedUser =  this.connectedUsers.findIndex(x => x.socket.id === socket.id);
		if (disconnectedUser === -1)
			return ;
		this.connectedUsers.splice(disconnectedUser, 1);
		const QueuedUser =  this.gameQueue.findIndex(x => x.socket.id === socket.id);
		if (QueuedUser === -1)
			return ;
		this.gameQueue.splice(QueuedUser, 1);
	}

	update(room: roomT) {
		if (room.player1.ball.x - room.ballDynamics.radius < -20)//
		{	
			room.player2.score += 1;
			this.server.to(room.roomId).emit("score", {soc:room.player2.socket.id, p1:room.player2.score, p2:room.player1.score});
		}
		
		if (room.player1.ball.x + room.ballDynamics.radius > room.player1.canvas.width + 20)
		{
			room.player1.score += 1;
			this.server.to(room.roomId).emit("score", {soc:room.player1.socket.id, p1:room.player1.score, p2:room.player2.score})
		}
		if (room.player1.score === 5 || room.player2.score === 5)//
			clearInterval(room.loop);
		
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
		this.server.to(room.player1.socket.id).emit('game_Data', {
			x: room.player1.ball.x,
			y: room.player1.ball.y
		})
		this.server.to(room.player2.socket.id).emit('game_Data', {
			x: room.player2.ball.x * room.player2.canvas.width / room.player1.canvas.width,
			y: room.player2.ball.y * room.player2.canvas.height / room.player1.canvas.height
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

	checkPlayerOrder(socket: Socket, room: roomT) {
		if(socket.id === room.player1.socket.id)
			return (1);
		return (2);
	}

	async startGame(room: roomT) {
		room.player1.score = 0;
		room.player2.score = 0;
		let framePerSecond = 50;
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
		};
		newRoom.player1.setData(this.gameQueue[0].user.nickName, this.gameQueue[0].user.avatar);
		newRoom.player2.setData(this.gameQueue[1].user.nickName, this.gameQueue[1].user.avatar);
		this.server.to(newRoom.player1.socket.id).emit("playersInfo", {nickname:newRoom.player2.nickName,
								avatar:newRoom.player2.avatar});
		this.server.to(newRoom.player2.socket.id).emit("playersInfo", {nickname:newRoom.player1.nickName,
								avatar:newRoom.player1.avatar});

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
			this.gameQueue.pop();
		// if (this.connectedUsers[0].nickname === this.connectedUsers[1].nickname)
		// {
		// 	this.connectedUsers.splice(0, 1);
		// 	return ;
		// }
		this.createGameRoom();
	}

	@SubscribeMessage('player')
	handleEvent(socket: Socket, data: paddleInfo) {
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
		const newY = emiter.canvas.height - data.y - (emiter.canvas.height / 4);//hna
		this.server.to(receiver.socket.id).emit("playerMov", {x: data.x, y: newY * receiver.canvas.height / emiter.canvas.height});
	}

	@SubscribeMessage('startGame')
	setStyles(socket: Socket, data: {w:number, h:number})
	{
		const room = this.findRoomBySocket(socket);
		if (room && this.checkPlayerOrder(socket, room) === 1) {
			room.player1.initBallPos(data.w / 2, data.h / 2)
			room.player2.initBallPos(data.w / 2, data.h / 2)
			room.player1.setCanvasDim(data.h, data.w);
		}
		if (room && this.checkPlayerOrder(socket, room) === 2) {
			room.player2.setCanvasDim(data.h, data.w);
		}
		// if (room.player1.socket.connected && room.player2.socket.connected)//
		// 	this.startGame(room);
	}
	@SubscribeMessage('resize')
	resize(socket: Socket, data: {w:number, h:number})
	{
		const room = this.findRoomBySocket(socket);
		if (room && this.checkPlayerOrder(socket, room) === 1) {
			room.player1.setCanvasDim(data.h, data.w);
		}
		if (room && this.checkPlayerOrder(socket, room) === 2) {
			room.player2.setCanvasDim(data.h, data.w);
		}
	}
}

//socket.broadcast.emit("event", ...); 		: send a message to all but not your self