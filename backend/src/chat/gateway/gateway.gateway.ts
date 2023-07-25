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
import { UtilsService } from 'src/utils/utils.service';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway(3004)
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    
    constructor(private readonly jwtService:JwtService, 
        private readonly usersService:UsersService,
        private readonly roomService:RoomsService,
        private readonly utils:UtilsService,
        private readonly messagesService:MessagesService
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

                const rooms = await this.utils.getRoomsForUser(userInfos.id); // all rooms who this user is member into it


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
   
    @SubscribeMessage('send-message') // on emit the message input get the message and the room name
    async sendMessage(@MessageBody() infos: object)
    {
        
        const idOfuser =   this.jwtService.verify(infos['user'],{ secret: process.env.JWT_SECRET });

        const roomId =  await this.utils.getRoomIdByName(infos['roomName']);
        
        if(idOfuser &&  roomId)
        {
            // handle on join the room
            
            const createdMsg = await this.messagesService.createMessages(infos['message'],idOfuser['sub'],roomId);
            
            await this.messagesService.linkUsersWithSocketIdAndRooms(idOfuser['sub'],infos['socketId'],roomId);

            const connectedUsersInRoom = await this.messagesService.usersConnectedInRoom(roomId);
            
            
            for(const user of connectedUsersInRoom) // broad cast the message for all members of the room
            {
                this.server.to(user.socketId).emit("add-message",{user: createdMsg.username, message: createdMsg.msg})// can send here the username and her msg
            }
        }
        else
        {
            console.log("room not found")
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
