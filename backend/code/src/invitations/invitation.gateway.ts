/* eslint-disable prettier/prettier */
import { NotFoundException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { request } from "http";
import { Socket, Server } from "socket.io"
import { GatewayService } from "src/chat/gateway/gateway.service";
import { UsersService } from "src/users/users.service";

type userNode = {
	socket: Socket,
	id: string,
}

@WebSocketGateway(3030, {
	cors: {
		origin: process.env.FRONT_HOST
	}
})
export default class InvitationsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
        private readonly gatewayService: GatewayService  
	) {}
	@WebSocketServer()
	private server: Server;

	private connectedUsers: userNode[] = [];

	OnWebSocektError(socket:Socket)
    {
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }

	async updateUserStatus(user: userNode, status: string) {
		await this.usersService.updateUserStatus(user.id, status);
		const friends = await this.usersService.getFriendsWithId(user.id);
		if (!friends)
			return;
		friends.map(async friend => {
			const friendSocket = this.connectedUsers.filter(connectedUser => connectedUser.id === friend.id);
			if (!friendSocket)
				return;
			if (friendSocket) {
				friendSocket.map(socket => {
					this.server.to(socket.socket.id).emit('update-status', {user: user.id, status})
				})
			}
		})
	}

	handleDisconnect(socket: Socket) {
		const index = this.connectedUsers.findIndex(user => user.socket.id === socket.id)
		if (index > -1) {
			const sockets = this.connectedUsers.filter(user => user.id === this.connectedUsers[index].id);
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
		this.connectedUsers.push({socket, id: user.id});
		await this.updateUserStatus({socket, id: user.id}, 'online');
	}

	@SubscribeMessage('send-request')
	async onSendRequest(socket: Socket, target: any) {
		const friend = await this.usersService.findOneByNickname(target.friend);
		if (!friend) {
			this.server.to(socket.id).emit('request-response', {err: true, msg: 'user not found'});
			return ;
		}
		const sender = this.connectedUsers.filter((user) => {
			if (user.socket.id === socket.id)
				return (true);
		})
		const receiver = this.connectedUsers.filter((user) => {
			if (user.id === friend.id)
				return (true);
		})

		const response: string = await this.usersService.sendRequest(target.friend, sender[0].id);
		if (response !== '')
		{
			this.server.to(socket.id).emit('request-response', {err: true, msg: response});
			return ;
		}
		if (receiver) {
			const requests = await this.usersService.getFriendsRequestsWithId(friend.id);
            
			receiver.map((instant) => {
				this.server.to(instant.socket.id).emit('receive-request', requests)
			})
			this.server.to(socket.id).emit('request-response', {err: false, msg: 'request sent'});
		}
	}

	@SubscribeMessage('accept-request')
	async onAcceptRequest(socket: Socket, target: any) {
		const receiver = this.connectedUsers.find(user => user.socket.id === socket.id);
		const receiverSockets = this.connectedUsers.filter(user => {
			if (user.id === receiver.id)
				return (true);
		})
		const senderId = await this.usersService.acceptRequest(target.requestId, receiver.id);
		const senderSockets = this.connectedUsers.filter(user => {
			if (user.id === senderId)
				return (true);
		})
		const receiverNewFriend = await this.usersService.findOneById(senderId);
		const senderNewFriend = await this.usersService.findOneById(receiver.id);
		const requests = await this.usersService.getFriendsRequestsWithId(receiver.id);
		receiverSockets.map(instant => {
			this.server.to(instant.socket.id).emit('receive-request', requests);
			this.server.to(instant.socket.id).emit('receive-friends', receiverNewFriend);
		})
		senderSockets.map(instant => {
			this.server.to(instant.socket.id).emit('receive-friends', senderNewFriend);
		})
        
        //  receiverNewFriend => sender
        //  senderNewFriend => resever

        const rtn = await this.gatewayService.checkDirectMessages(receiverNewFriend.id , senderNewFriend.id , 1);

        if(rtn.error)
        {
            return ;
        }
        // event name ("new-room") , send this object   ({room : rtn.newDmRoom   , usersInfos: rtn.existingUser})
        // socket of taha
	}

	@SubscribeMessage('refuse-request')
	async onRefuseRequest(socket: Socket, target: any) {
		const receiver = this.connectedUsers.find((user) => {
			if (user.socket.id === socket.id)
				return (true);
		});
		const receiverSockets = this.connectedUsers.filter(user => {
			if (user.id === receiver.id)
				return (true);
		})
		await this.usersService.refuseRequest(target.requestId, receiver.id);
		const requests = await this.usersService.getFriendsRequestsWithId(receiver.id);
		receiverSockets.map(s => {
			this.server.to(s.socket.id).emit('receive-request', requests);
		})
	}

	@SubscribeMessage('delete-friend')
	async onDeleteFriend(socket: Socket, friendId: string) {
		const {id: emiterId} = this.connectedUsers.find(user => user.socket.id === socket.id)
		const target = this.connectedUsers.filter(user => user.id === friendId)
		const emiterSockets = this.connectedUsers.filter(user => user.id === emiterId)
		await this.usersService.removeFriend(friendId, emiterId);
		if (emiterSockets) {
			emiterSockets.map(socket => {
				this.server.to(socket.socket.id).emit('friend-deleted', {
					friend: friendId
				});
			})
		}
		if (target) {
			target.map(socket => {
				this.server.to(socket.socket.id).emit('friend-deleted', {
					friend: emiterId
				});
			})
		}
	}

	@SubscribeMessage('logout')
	async userLoggedOut(socket: Socket) {
		const {id} = this.connectedUsers.find(c => c.socket.id === socket.id);
		if (!id)
			return ;
		const userSockets = this.connectedUsers.filter(c => c.id === id);
		if (userSockets.length === 0)
			return ;
		userSockets.forEach(s => {
			this.server.to(s.socket.id).emit('logout');
			s.socket.disconnect();
		})
	}

}