/* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-empty-function */
// /* eslint-disable prefer-const */
// /* eslint-disable prettier/prettier */
// import { UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Socket, Server } from  'socket.io';
// import { UsersService } from 'src/users/users.service';
// import { SocketIds, UserData, roomAndUsers } from 'src/utils/userData.interface';
 

// @WebSocketGateway(3002)
// export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect
// {
    
//     constructor(private readonly jwtService:JwtService, 
//         private readonly usersService:UsersService,
//         ){}

//     @WebSocketServer()
//     server:Server;
    
//     socketId: SocketIds;
    
//     async handleConnection(socket: Socket) 
//     {
//         try 
//         {
//             // connect to socket with jwt
//             const decodeJWt =   this.jwtService.verify(socket.handshake.auth['token'],{ secret: process.env.JWT_SECRET })
    
//             // verify the user
//             const userInfos = await this.usersService.findOneByNickname(decodeJWt['nickname']);
    
//             if(!userInfos)
//             {
//                 this.OnWebSocektError(socket);
//             }
//             else
//             { 
//                 console.log("connected from profile.")
//             }
             
//         } 
//         catch (error) 
//         {
//             console.log("from profile error")
//             this.OnWebSocektError(socket);
//         }
//     }
   
     

//     OnWebSocektError(socket:Socket)
//     { 
        
//         console.log("disconnected")
//         socket.emit("error", new UnauthorizedException());
//         socket.disconnect();
//     }


//     async handleDisconnect(socket: Socket) {
//         console.log("disconnected from profile");

//         // free the map socketIds interface

//         this.OnWebSocektError(socket);
//     }

   
    
// }
