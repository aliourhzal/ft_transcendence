import { NotFoundException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { request } from "http";
import { Socket, Server } from "socket.io"
import { UsersService } from "src/users/users.service";

type userNode = {
	socket: Socket,
	nickname: string
}

@WebSocketGateway(3030, {
	cors: {
		origin: process.env.FRONT_HOST
	}
})
export default class InvitationsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService    
	) {}

	@WebSocketServer()
	private server: Server;

	private connectedUsers: userNode[] = [];

	OnWebSocektError(socket:Socket)
    {
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }

	async updateUserStatus(user: userNode, status: string, ) {
		await this.usersService.updateUserStatus(user.nickname, status);
		const friends = await this.usersService.getFriends(user.nickname);
		if (!friends)
			return;
		friends.map(async friend => {
			const friendSocket = this.connectedUsers.filter(connectedUser => connectedUser.nickname === friend.nickname);
			if (!friendSocket)
				return;
			if (friendSocket) {
				friendSocket.map(socket => {
					this.server.to(socket.socket.id).emit('update-status', {user: user.nickname, status})
				})
			}
		})
	}

	handleDisconnect(socket: Socket) {
		const index = this.connectedUsers.findIndex(user => user.socket.id === socket.id)
		if (index > -1) {
			const sockets = this.connectedUsers.filter(user => user.nickname === this.connectedUsers[index].nickname);
			if (sockets.length < 2)
			this.updateUserStatus(this.connectedUsers[index], 'offline');
			this.connectedUsers.splice(index, 1);	
		}
	}

	async handleConnection(socket: Socket) {
		let decodeJWt: any;
		try {
			decodeJWt = this.jwtService.verify(socket.handshake.auth.token, {
				secret: process.env.JWT_SECRET
			})
		} catch (err) {
			this.OnWebSocektError(socket);
		}
		if (!decodeJWt) {
			this.OnWebSocektError(socket);
			return ;
		} 
		const user = await this.usersService.findOneByNickname(decodeJWt.nickname);
		if (!user) {
			this.OnWebSocektError(socket);
			return ;
		}
		this.connectedUsers.push({socket, nickname: user.nickname});
		await this.updateUserStatus({socket, nickname: user.nickname}, 'online');
	}

	@SubscribeMessage('send-request')
	async onSendRequest(socket: Socket, target: any) {
		const sender = this.connectedUsers.filter((user) => {
			if (user.socket.id === socket.id)
				return (true);
		})
		const receiver = this.connectedUsers.filter((user) => {
			if (user.nickname === target.friend)
				return (true);
		})

		const response: string = await this.usersService.sendRequest(target.friend, sender[0].nickname);
		if (response !== '')
		{
			this.server.to(socket.id).emit('request-response', {err: true, msg: response});
			return ;
		}
		if (receiver) {
			const requests = await this.usersService.getFriendsRequests(receiver[0].nickname);
			receiver.map((instant) => {
				this.server.to(instant.socket.id).emit('receive-request', requests)
			})
			this.server.to(socket.id).emit('request-response', {err: false, msg: 'request sent'});
		}
	}

	@SubscribeMessage('accept-request')
	async onAcceptRequest(socket: Socket, target: any) {
		const receiver = this.connectedUsers.find((user) => {
			if (user.socket.id === socket.id)
				return (true);
		});
		const receiverSockets = this.connectedUsers.filter(user => {
			if (user.nickname === receiver.nickname)
				return (true);
		})
		const senderNickname = await this.usersService.acceptRequest(target.requestId, receiver.nickname);
		const senderSockets = this.connectedUsers.filter(user => {
			if (user.nickname === senderNickname)
				return (true);
		})
		const receiverNewFriends = await this.usersService.findOneByNickname(senderNickname);
		const senderNewFriends = await this.usersService.findOneByNickname(receiver.nickname);
		const requests = await this.usersService.getFriendsRequests(receiver.nickname);
		receiverSockets.map(instant => {
			this.server.to(instant.socket.id).emit('receive-request', requests);
			this.server.to(instant.socket.id).emit('receive-friends', receiverNewFriends);
		})
		senderSockets.map(instant => {
			this.server.to(instant.socket.id).emit('receive-friends', senderNewFriends);
		})
	}

	@SubscribeMessage('refuse-request')
	async onRefuseRequest(socket: Socket, target: any) {
		const receiver = this.connectedUsers.find((user) => {
			if (user.socket.id === socket.id)
				return (true);
		});
		const receiverSockets = this.connectedUsers.filter(user => {
			if (user.nickname === receiver.nickname)
				return (true);
		})
		await this.usersService.refuseRequest(target.requestId, receiver.nickname);
		const requests = await this.usersService.getFriendsRequests(receiver.nickname);
		this.server.to(socket.id).emit('receive-request', requests);
	}

}