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
import { SendMessage } from 'src/dto/sendMessage.dto';

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
    arrayOfJoinnedUsers :ArrayOfClinets[] = [];
    
    listOfRoomsOfUser :   any[] = [];

    async handleConnection(socket: Socket) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
        
            if (token) 
            {
                const decodedToken = await this.utils.verifyToken(token)
              
                if (decodedToken) 
                {

                    this.socketOfcurrentUser = socket;
                    console.log('connected from chat');
                
                    const existingUser = await this.utils.getUserId([decodedToken['sub']]);
                    
                    if(existingUser.error)
                    {
                        this.OnWebSocektError(socket);

                        // emit existingUsers.error
                        return ;
                    }                
                
                    this.soketsId.push({userId:existingUser.existingUser[0], socketIds:socket.id})

                    const rooms = await this.utils.getRoomsForUser(existingUser.existingUser[0]); // all rooms who this user is member into it
        
                    let messages:any[] = [];

            
                    for(let i = 0; i < rooms.length; i++)
                    {
                        messages.push({msg : await this.messagesService.getAllMessagesofRoom(rooms[i]['room']['room_name']) , room : rooms[i] , usersInRoom: await this.utils.getUserInfosInRoom(rooms[i].roomId) })
                    }
                    

                    this.server.to(socket.id).emit("list-rooms",{messages});  //  evry client will connected will display the rooms who is member into it
                    
                }
            }
            else
            {
                console.log('invalid jwt.');
                this.OnWebSocektError(socket);

            }
            
        } 
        catch (error) 
        {
            console.log('from catch');
            console.log(error)    
            this.OnWebSocektError(socket);

        }
    }
   
    @SubscribeMessage('send-message') 
    @UsePipes(new ValidationPipe())
    async sendMessage(@MessageBody() dto: SendMessage) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(this.socketOfcurrentUser.handshake.headers.authorization);
            if (token) 
            {
                const decodedToken = await this.utils.verifyToken(token)
              
                if (decodedToken) 
                {
                    const existingUser = await this.utils.getUserId([decodedToken['sub']]);
                    
                    if(existingUser.error)
                    {
                        this.OnWebSocektError(this.socketOfcurrentUser);

                        // emit existingUsers.error
                        return ;
                    }                
                
                    const roomId =  await this.utils.getRoomByName(dto.roomName);
                    if(roomId)
                    {
                        const userType = await this.utils.getUserType(roomId.id, [decodedToken['sub']]);
                        // if(userType.isBanned)
                        // {
                        //     console.log('you are banned from this room.')
                        //     return ;
                        // }
                        if(userType)
                        {
                            const createdMsg = await this.messagesService.createMessages(dto.message ,decodedToken['sub'], roomId.id);
                            
                            
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
            }
            else
            {
                console.log('invalid jwt.');
                this.OnWebSocektError(this.socketOfcurrentUser);

            }
            
        } 
        catch (error) 
        {
            this.OnWebSocektError(this.socketOfcurrentUser);
            console.log(error.error)
        }
    }


    @SubscribeMessage('join-room') 
    @UsePipes(new ValidationPipe()) // Add the ValidationPipe here
    async joinRoom(@MessageBody() dto:JoinRoomDto) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(this.socketOfcurrentUser.handshake.headers.authorization);
            if (token) 
            {
                const decodedToken = await this.utils.verifyToken(token)
              
                if (decodedToken) 
                {
                    const existingUser = await this.utils.getUserId([decodedToken['sub']]);
                    
                    if(existingUser.error)
                    {
                        this.OnWebSocektError(this.socketOfcurrentUser);

                        // emit existingUsers.error
                        return ;
                    }                
                
                    const roomId =  await this.utils.getRoomByName(dto.roomName);

                    if(roomId)
                    {

                        if(roomId.roomType !== 'PRIVATE')
                        {
                            const usersInRoom:any = await this.utils.getUsersInRooms(roomId.id);
                    
                            const find = usersInRoom.find((item:any) => item.userId === decodedToken['sub']);
                            if(!find)
                            {
                                const roomType = await this.utils.getRoomById(roomId.id);
                                const usersInroom = await this.utils.getUsersInRooms(roomId.id);                    
                                if(roomType.roomType === 'PROTECTED')
                                {
                                    if(comparePasswd(dto.password,roomType.password) )
                                    {
                                        await this.roomService.linkBetweenUsersAndRooms(roomId.id, [decodedToken['sub']]);
                                    
                                    const usersInroom = await this.utils.getUsersInRooms(roomId.id);
                                        
                                        for(const userInRoom of usersInroom)
                                        {
                                            for (let i = 0; i < this.soketsId.length; i++) 
                                            {
                                                if(this.soketsId[i].userId === userInRoom.userId)
                                                {
                                                    this.server.to(this.soketsId[i].socketIds).emit('users-join', {roomId , userInfos: await this.utils.getUserInfosInRoom(roomId.id) , newUserAdded : usersInroom[usersInroom.length - 1] });                                    }
                                            }
     
                                        }
                                        return ;
                                    }
                                    else
                                    {
                                        console.log("password inccorect.")
                                        // this.socketOfcurrentUser.emit('users-join',"password inccorect.")
                                        return ;
                                    }
                                }
                                else if(roomType.roomType === 'PUBLIC')
                                {
                                    await this.roomService.linkBetweenUsersAndRooms(roomId.id, [decodedToken['sub']]);
                                    
                                    const usersInroom = await this.utils.getUsersInRooms(roomId.id);
                                    
                                    
                                    // this.server.to(dto.socketId).emit('current-user-join', {roomId , userInfos: await this.utils.getUserInfosInRoom(roomId.id)});
    
                                    for(const userInRoom of usersInroom)
                                    {
                                        for (let i = 0; i < this.soketsId.length; i++) 
                                        {
                                            if(this.soketsId[i].userId === userInRoom.userId)
                                            {
                                                this.server.to(this.soketsId[i].socketIds).emit('users-join', {roomId , userInfos: await this.utils.getUserInfosInRoom(roomId.id) , newUserAdded : usersInroom[usersInroom.length - 1] });
                                            }
                                        }
            
                                    } 
                                    return ;
                                } 
                            }
                            else 
                            {
                                console.log('user aleredy in this room.')
                                // this.socketOfcurrentUser.emit('error-joinned-room','user aleredy in this room.')
                                this.OnWebSocektError(this.socketOfcurrentUser);
                            }
                        }

                    }
                    else
                    {
                        console.log('room not found')
                        // emmit room not found
                    }
                    
                    
                }
            }
            else
            {
                console.log('invalid jwt.');
                this.OnWebSocektError(this.socketOfcurrentUser);

            }
            
        } 
        catch (error) 
        {
            this.OnWebSocektError(this.socketOfcurrentUser);
            console.log(error.error)
        }
        
    }


    OnWebSocektError(socket:Socket)
    { 
        // socket.emit("error", new UnauthorizedException());
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
