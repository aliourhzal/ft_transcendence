/* eslint-disable no-var */
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
                
                this.arrayOfClinets.push({userId:userInfos.id, socketIds:socket.id})

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
        // use try and catch here && search by id of user in db if found or not

        // try 
        // {
            console.log(infos)
            const user =   this.jwtService.verify(infos['user'],{ secret: process.env.JWT_SECRET });

        //     const userId = await this.utils.getuserById(user['sub'])

        //     console.log(userId)

            
        // } 
        // catch (error) 
        // {
            
        // }

        console.log(user)


        const roomId =  await this.utils.getRoomIdByName(infos['roomName']);
        
        const createdMsg = await this.messagesService.createMessages(infos['message'],user['sub'],roomId);
   
      
        const usersInroom = await this.utils.getUsersInRooms(roomId);
        
        for(const user of usersInroom)
        {
            for (let i = 0; i < this.arrayOfClinets.length; i++) 
            {
                if (this.arrayOfClinets[i].userId === user.userId) 
                {
                    this.server.to(this.arrayOfClinets[i].socketIds).emit("add-message", {user: createdMsg.username, message: createdMsg.msg})
                }    
            }
        }
            
    }
   

    OnWebSocektError(socket:Socket)
    { 
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }


    async handleDisconnect(socket: Socket) {

        // on deconect delete the socket id

        console.log("disconnected from chat");
        
        // this.arrayOfClinets = []; // clear socket ids 
        // remove sockets from room
        this.OnWebSocektError(socket);
    }

   
    
}
