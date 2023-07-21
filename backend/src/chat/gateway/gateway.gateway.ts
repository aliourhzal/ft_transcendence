import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from  'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    
    constructor(private readonly jwtService:JwtService, private readonly usersService:UsersService){}

    @WebSocketServer()
    server:Server;
    
    user : UserData;
    
    socketOfcurrentUser:Socket
    
    async handleConnection(socket: Socket) 
    {
        
        const decodeJWt =   this.jwtService.verify(socket.handshake.auth['token'],{ secret: process.env.JWT_SECRET })

        const userInfos = await this.usersService.findOneByNickname(decodeJWt['nickname']);

        if(!userInfos)
        {
            this.OnWebSocektError(socket);
        }
        else
        { 
            console.log("connected")
             
            
            this.user =  userInfos;

             
            this.socketOfcurrentUser = socket
        }
    }
   
   
    OnWebSocektError(socket:Socket)
    { 
        
        console.log("disconnected")
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }


    async handleDisconnect(socket: Socket) {
        console.log("disconnected");
    }
   
    
}
