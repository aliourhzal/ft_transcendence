/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from  'socket.io';
import { UsersService } from 'src/users/users.service';
import { ArrayOfClinets, UserData, roomAndUsers } from 'src/utils/userData.interface';
import { RoomsService } from '../rooms/rooms.service';
import { ConnectedUsersService } from '../connected-users/connected-users.service';
import { UtilsService } from 'src/utils/utils.service';

@WebSocketGateway(3004)
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    
    constructor(private readonly jwtService:JwtService, 
        private readonly usersService:UsersService,
        private readonly roomService:RoomsService,
        private readonly connectedUsersService:ConnectedUsersService,
        private readonly utils:UtilsService
        ){}

    @WebSocketServer()
    server:Server;
    
    user : UserData;
    
    socketOfcurrentUser:Socket;

    arrayOfClinets :ArrayOfClinets[] = [];


    async handleConnection(socket: Socket) 
    {
        try 
        {
            // connect to socket with jwt
            const decodeJWt =   this.jwtService.verify(socket.handshake.auth['token'],{ secret: process.env.JWT_SECRET })
            // verify the user
            const userInfos = await this.usersService.findOneByNickname(decodeJWt['nickname']);
            
            if(!userInfos)
            {
                 
                this.OnWebSocektError(socket);
            }
            else
            { 
                
                console.log("connected from chat.")
                
                
                this.user =  userInfos;
                
                this.arrayOfClinets.push({Nickname:userInfos.nickname, socketIds:socket.id})

                this.socketOfcurrentUser = socket
                 
                const rooms = await this.utils.getRoomsForUser(userInfos.id); // all rooms who this user is member into it

                 
                await this.connectedUsersService.create(socket.id, userInfos.id) // set evry client an (multi )socket id

                let listOfRoomsOfUser:string[] = [];
                let indexes:number[] = [];

                
                for(let i = 0; i < rooms.length; i++)
                {
                    listOfRoomsOfUser.push(rooms[i]['room']['room_name']);
                    indexes.push(i);
                }
                
                this.server.to(socket.id).emit("list-rooms",{listOfRoomsOfUser,indexes });  //  evry client will connected will display the rooms who is member into it
            
            }
             
        } 
        catch (error) 
        {
            console.log("from error")
            this.OnWebSocektError(socket);
        }
    }
   
   

    OnWebSocektError(socket:Socket)
    { 
        
       
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }


    async handleDisconnect(socket: Socket) {
        
        console.log("disconnected from chat");
        
        this.arrayOfClinets = []; // clear socket ids 

        this.OnWebSocektError(socket);
    }

   
    
}
