/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from  'socket.io';
import { UsersService } from 'src/users/users.service';
import {  UserData, ArrayOfClinets, ListOfRoomsOfUser } from 'src/utils/userData.interface';
import { RoomsService } from '../rooms/rooms.service';
import { UtilsService } from 'src/utils/utils.service';
import { MessagesService } from '../messages/messages.service';
import { JoinRoomDto } from 'src/dto/join-room.dto';
import { comparePasswd } from 'src/utils/bcrypt';

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

    soketsId :ArrayOfClinets[] = [];
    
    listOfRoomsOfUser :   any[] = [];

    async handleConnection(socket: Socket) 
    {
        try 
        {
            // connect to socket with jwt
            const decodeJWt =   this.jwtService.verify(socket.handshake.auth['token'],{ secret: process.env.JWT_SECRET })
            
            const userInfos = await this.utils.getUserId(decodeJWt['sub']);
             
            if(!userInfos) // handle this
            {
                this.OnWebSocektError(socket);

                console.log('user not found.')
                return;
            }

             
          
            console.log("connected from chat.")
                
            this.soketsId.push({userId:userInfos.id, socketIds:socket.id})

            const rooms = await this.utils.getRoomsForUser(userInfos.id); // all rooms who this user is member into it

            let messages:any[] = [];

            
            for(let i = 0; i < rooms.length; i++)
            {
                messages.push({msg : await this.messagesService.getAllMessagesofRoom(rooms[i]['room']['room_name']) , room : rooms[i] , usersInRoom: await this.utils.getUserInfosInRoom(rooms[i].roomId) })
            }
            

            this.server.to(socket.id).emit("list-rooms",{messages});  //  evry client will connected will display the rooms who is member into it
             
        } 
        catch (error) 
        {
            console.log("from chat error")
            this.OnWebSocektError(socket);
        }
    }
   
    @SubscribeMessage('send-message') // on emit the message input get the message and the room name
    async sendMessage(@MessageBody() infos: object) // use dto
    {
        // use try and catch here && search by id of user in db if found or not

        try 
        {
            const user =   this.jwtService.verify(infos['user'],{ secret: process.env.JWT_SECRET });
    
            if(!await this.utils.getUserId(user['sub']))
            {
                console.log('user not found.')
                return;
            }
            const roomId =  await this.utils.getRoomByName(infos['roomName']);
            if(roomId)
            {
                const userType = await this.utils.getUserType(roomId.id,user['sub']);
                if(userType.isBanned)
                {
                    console.log('you are banned from this room.')
                    return ;
                }
                if(userType)
                {
                    const createdMsg = await this.messagesService.createMessages(infos['message'],user['sub'],roomId.id);
                    
                    
                    const usersInroom = await this.utils.getUsersInRooms(roomId.id);
                     
                    for(const userInRoom of usersInroom)
                    {
                        for (let i = 0; i < this.soketsId.length; i++) 
                        {
                            if(this.soketsId[i].userId === userInRoom.userId)
                            {
                                this.server.to(this.soketsId[i].socketIds).emit("add-message", {user: createdMsg.username, msg: createdMsg.msg , roomName: roomId.room_name})
                            }
                        }

                    }
                     
                }
                else
                {
                    // emmit user is not in this room
                }

            }
            else
            {
                // emmit room not found
            }
            
        } 
        catch (error) 
        {
            console.log(error)
        }
    }
   
    @SubscribeMessage('join-room') 
    @UsePipes(new ValidationPipe()) // Add the ValidationPipe here
    async joinRoom(@MessageBody() dto:JoinRoomDto) 
    { 

        try 
        {
            const user = this.jwtService.verify(dto.user,{ secret: process.env.JWT_SECRET })

            const currentUser = await this.utils.getUserId(user['sub']);

            if(!currentUser)
                return this.socketOfcurrentUser.emit('user not found.')
            
            const roomId:any = await this.utils.getRoomByName(dto.roomName);

            if(roomId)
            {
                const usersInRoom:any = await this.utils.getUsersInRooms(roomId.id);
                
                const find = usersInRoom.find((item:any) => item.userId === user['sub']);
    
                if(!find)
                {
                    const roomType = await this.utils.getRoomById(roomId.id);
                    
                    if(roomType.roomType === 'PROTECTED')
                    {
                        if(comparePasswd(dto.password,roomType.password) )
                        {
                            await this.roomService.linkBetweenUsersAndRooms(roomId.id, user['sub']);
                            
                            this.socketOfcurrentUser.emit('user-join', {roomId , userInfos: await this.utils.getUserInfosInRoom(roomId.id)});

                        }
                        else
                        {
                            this.socketOfcurrentUser.emit("password inccorect.")
                        }
                    }
                    else if(roomType.roomType === 'PUBLIC')
                    {
                        await this.roomService.linkBetweenUsersAndRooms(roomId.id, user['sub']);

                        usersInRoom.push(currentUser);
                     
                        this.socketOfcurrentUser.emit('user-join', {roomId , userInfos: await this.utils.getUserInfosInRoom(roomId.id)});
                    }
                }
                
                return this.socketOfcurrentUser.emit('user aleredy in this room.')

            }

            return this.socketOfcurrentUser.emit('room not found.')
            
        } 
        catch (error : any) 
        {
            return this.socketOfcurrentUser.emit(error);
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
        
        // this.soketsId = []; // clear socket ids 
        // remove sockets from room
        this.OnWebSocektError(socket);
    }

   
    
}
