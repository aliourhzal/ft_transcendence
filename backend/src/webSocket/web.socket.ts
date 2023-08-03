import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { Server, Socket } from 'socket.io'
import { UsersService } from "src/users/users.service";

type userNode = {
	socket: Socket,
	nickname: string
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

type roomT = {
	roomId: string,
	socket1: Socket,
	socket2: Socket,
	ball_p1: coords,
	ball_p2: coords,
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

	private connectedUsers: userNode[] = [];
	private gameQueue: userNode[] = [];

	private rooms : roomT[] = [];
	// private findPlayerinRoom()
	// {
	// 	this.rooms.map()
	// }

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService	
	) {}

	OnWebSocektError(socket:Socket)
    {
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }

	handleDisconnect(socket: Socket) {
		console.log('the user disconnected from game socket')
	}

	update(ball_p1: coords, ball_p2: coords, ballDynamics: Ball, player1: Socket, player2: Socket) {
		if (ball_p1.x - ballDynamics.radius < -20 || ball_p1.x + ballDynamics.radius > 820) {
			ballDynamics.resetForNewGame();
			ball_p1.x = ball_p2.x = 400;
			ball_p1.y = ball_p2.y = 225;
		}
		ball_p1.x += ballDynamics.velocityX;
		ball_p1.y += ballDynamics.velocityY;
		ball_p2.x -= ballDynamics.velocityX;
		ball_p2.y -= ballDynamics.velocityY;
		if(ball_p1.y - ballDynamics.radius < 0 || ball_p1.y + ballDynamics.radius > 450) {
			if (ball_p1.y - ballDynamics.radius < 0) {
				ball_p1.y = ballDynamics.radius + 1;
				ball_p2.y = 450 - ballDynamics.radius + 1;
			}
			else {
				ball_p1.y = 450 - ballDynamics.radius + 1;
				ball_p2.y = ballDynamics.radius + 1;
			}
			ballDynamics.velocityY = -ballDynamics.velocityY;
		}
		this.server.to(player1.id).emit('game_Data', {
			x: ball_p1.x,
			y: ball_p1.y
		})
		this.server.to(player2.id).emit('game_Data', {
			x: ball_p2.x,
			y: ball_p2.y
		})
	}

	findOpponentBySocket(socket: Socket): Socket {
		let sock: Socket;
		this.rooms.map((x) => {
			if (x.socket1.id === socket.id)
				sock = x.socket2;
			if (x.socket2.id === socket.id)
				sock = x.socket1;
		});
		return sock;
	}


	async startGame(ball_p1: coords, ball_p2: coords, ballDynamics: Ball, player1: Socket, player2: Socket) {
		
		
		let loop:NodeJS.Timer = null;
		let framePerSecond = 50;
		loop = setInterval(() => {
			this.update(ball_p1, ball_p2, ballDynamics, player1, player2);
		},1000/framePerSecond);
		return ;
	}

	async createGameRoom() {
		const roomId = randomUUID();
		const ballDynamics = new Ball()
		const ball_p1: coords = {x: 400, y: 225};
		const ball_p2: coords = {x: 400, y: 225};
		const player1 = this.gameQueue[0].socket;
		const player2 = this.gameQueue[1].socket;
		player1.join(roomId);
		player2.join(roomId);

		const obj:roomT = {
			roomId,
			socket1: player1,
			socket2: player2,
			ball_p1,
			ball_p2,
			ballDynamics
		};
		this.rooms.push(obj);

		this.gameQueue.splice(0, 2);
		this.startGame(ball_p1, ball_p2, ballDynamics, player1, player2);
	}

	async handleConnection(socket: Socket) {
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
			this.OnWebSocektError(socket);
		const user = await this.usersService.findOneByNickname(decodeJWt.nickname);
		if (!user) {
			this.OnWebSocektError(socket);
		}
		this.connectedUsers.push({socket, nickname: user.nickname});
		this.gameQueue.push({socket, nickname: user.nickname});
		if (this.gameQueue.length < 2)
			return ;
		if (this.connectedUsers[0].nickname === this.connectedUsers[1].nickname)
		{
			this.connectedUsers.splice(0, 1);
			return ;
		}
		this.createGameRoom();
	}

	@SubscribeMessage('player')
	handleEvent(socket: Socket, data: paddleInfo) {
		const room = this.rooms.find(room => {
			return (room.socket1.id === socket.id || room.socket2.id === socket.id)
		})
		if (data.collision)
		{
			if (socket.id === room.socket2.id)
			{
				const a = 1.5708 - data.collAngle; // the angle between collAngle and 90deg
				const mirrorAngle = data.collAngle + 2 * a;
				data.collAngle = -mirrorAngle;
			}
			room.ballDynamics.velocityX = room.ballDynamics.speed * Math.cos(data.collAngle);
			room.ballDynamics.velocityY = room.ballDynamics.speed * Math.sin(data.collAngle);
			room.ballDynamics.speed += 0.7;
		}
		const newY = 450 - data.y - 100;
		this.server.to(this.findOpponentBySocket(socket).id).emit("playerMov", {x: data.x, y: newY});
	}

}

//socket.broadcast.emit("event", ...); 		: send a message to all but not your self