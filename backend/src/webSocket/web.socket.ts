import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { type } from "os";
import { Server, Socket } from 'socket.io'
import { UsersService } from "src/users/users.service";

type userNode = {
	socket: Socket,
	nickname: string
}

type roomT = {
	roomId: string,
	socket1: Socket,
	socket2: Socket
}

class Ball {
	x: number;
	y: number;

	top: number;
	bottom: number;
	left: number;
	right: number;

	radius = 10;
	velocityX = 5; //ball direction
	velocityY = 5;
	speed = 7;
	color = "WHITE";

	constructor(initX: number, initY: number) {
		this.x = initX;
		this.y = initY;
	}
}

@WebSocketGateway(3003, { cors: true } ) //tell's the class that it using socket not http and use the port 3003 instead of default one 3000
export class myGateAway implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server:Server;

	private connectedUsers: userNode[] = [];

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

	update(ball: Ball, roomId: string) {
		// if (ball.x - ball.radius < -20 || ball.x + ball.radius > 820)
		// {
		// 	ball.speed = 7;
		// 	ball.x = 400;
		// 	ball.y = 225;
		// 	ball.velocityY = 5;
		// 	ball.velocityX = 5;
		// }
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		if(ball.y - ball.radius < 0 || ball.y + ball.radius > 450){
			ball.velocityY = -ball.velocityY;
		}
		if (ball.x - ball.radius < 0 || ball.x + ball.radius > 800)
			ball.velocityX = -ball.velocityX;
		this.server.to(roomId).emit('game_Data', {
			x: ball.x,
			y: ball.y
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

	@SubscribeMessage('player')
	handleEvent(socket: Socket, data : {x: number, y: number }) {
		this.server.to(this.findOpponentBySocket(socket).id).emit("playerMov", {x: data.x, y:data.y});
	}

	async startGame(roomId: string) {
		const ball = new Ball(400, 225);
		
		let loop:NodeJS.Timer = null;
		let framePerSecond = 50;
		loop = setInterval(() => {
			this.update(ball, roomId);
		},1000/framePerSecond);
		return ;
	}

	async createGameRoom() {
		const roomId = randomUUID();
		console.log(roomId);
		this.connectedUsers[0].socket.join(roomId);
		this.connectedUsers[1].socket.join(roomId);

		const obj:roomT = {roomId, socket1: this.connectedUsers[0].socket, socket2: this.connectedUsers[1].socket};
		this.rooms.push(obj);

		console.log(obj);
		this.connectedUsers.splice(0, 2);
		this.startGame(roomId);
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
		if (this.connectedUsers.length < 2)
			return ;
		if (this.connectedUsers[0].nickname === this.connectedUsers[1].nickname)
		{
			this.connectedUsers.splice(0, 1);
			return ;
		}
		this.createGameRoom();
	}

}

//socket.broadcast.emit("event", ...); 		: send a message to all but not your self