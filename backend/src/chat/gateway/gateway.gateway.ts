/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from  'socket.io';
import { UsersService } from 'src/users/users.service';
import {  UserData, ArrayOfClinets, ListOfRoomsOfUser } from 'src/utils/userData.interface';
import { RoomsService } from '../rooms/rooms.service';
import { UtilsService } from 'src/utils/utils.service';
import { MessagesService } from '../messages/messages.service';
import { JoinRoomDto } from 'src/dto/join-room.dto';
import { comparePasswd } from 'src/utils/bcrypt';
import { SendMessage } from 'src/dto/sendMessage.dto';
import { createRoom } from 'src/dto';
import { RoomType } from 'src/utils/userData.interface';
import { SetOtherAasAdministrators } from 'src/dto/setOtherAasAdministrators.dto';
import { DemoteUser } from 'src/dto/DemoteUser.dto';
import { KickUser } from 'src/dto/Kickusers.sto';
import { AddNewUsersToRoom } from 'src/dto/addNewUsersToRoom.dto';
import { LeaveRoom } from 'src/dto/leaveRoom.dto';

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
                const user  = await this.utils.verifyToken(token); // // if has error will catch it
                
                const rtn = await this.utilsFunction(socket , user);
                
                if(rtn.error)
                {
                    this.OnWebSocektError(socket);
                    console.log(rtn.error)
                    return ;
                }
                else
                    console.log(rtn.ok)
            
            } 
            else
            {
                console.log('invalid jwt.');
                this.OnWebSocektError(socket);
            }
        }   
        catch (error) 
        {
            this.OnWebSocektError(socket);
            console.log(error)
        }
    }
   

    @SubscribeMessage('create-room') 
    @UsePipes(new ValidationPipe())
    async createRoom(@MessageBody() dto: createRoom , @ConnectedSocket() socket: Socket) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const decodedToken = await this.utils.verifyToken(token)
              
                if (decodedToken) 
                {
                    const usersId = (await this.utils.getUsersIdByNickname(decodedToken['sub'],dto.users , 1)); // get ids of users 

                    if(usersId.error)
                    {
                        console.log(usersId.error);
                        return
                    }

                    const ifUserExist = await this.utils.getUserId([decodedToken['sub'] , ...usersId.uniqUsers]);
                    
                    if(ifUserExist.error)
                    {
                        console.log(ifUserExist.error);
                        return;
                    }
                    
                    if (dto.type === RoomType.PRIVATE || dto.type === RoomType.PROTECTED || dto.type === RoomType.PUBLIC) 
                    {
                        if (dto.type === "PROTECTED") 
                        {
                            const room = await this.roomService.createRoom({roomName: dto.roomName, users: usersId.uniqUsers}, decodedToken['sub'], "PROTECTED", dto.password);
        
                            if(room.error)
                            {
                                console.log(room.error)
                                return
                            }
                            const usersInroom = await this.utils.getUsersInRooms(room.room.id);

                            for(const userInRoom of usersInroom)
                            {
                                for (let i = 0; i < this.soketsId.length; i++) 
                                {
                                    if(this.soketsId[i].userId === userInRoom.userId)
                                    {
                                        this.server.to(this.soketsId[i].socketIds).emit("new-room",{room  , usersInRoom: await this.utils.getUsersInRooms(room['id']) , userInfos: await this.utils.getUserInfosInRoom(room.room.id)});
                                    }
                                }
                            }
                            
                        }
                        else
                        { 
                            const room = await this.roomService.createRoom({roomName: dto.roomName, users: usersId.uniqUsers}, decodedToken['sub'], dto.type);
                            if(room.error)
                            {
                                console.log(room.error)
                                return
                            }
                             
                            const usersInroom_ = await this.utils.getUsersInRooms(room.room.id);

                            for(const userInRoom of usersInroom_)
                            {
                                for (let i = 0; i < this.soketsId.length; i++) 
                                {
                                    if(this.soketsId[i].userId === userInRoom.userId)
                                    {
                                  
                                        this.server.to(this.soketsId[i].socketIds).emit("new-room",{ room  , usersInRoom : usersInroom_ , userInfos: await this.utils.getUserInfosInRoom(room.room.id)});
                                        // console.log(room, usersInroom_ , await this.utils.getUserInfosInRoom(room.room.id))
                                    } 
                                }
                            }
        
                        }
                    }
                    else
                    {
                        console.log("error in type of room.")
                    }
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
            console.log(error.error)
        }

    }



    @SubscribeMessage('send-message') 
    @UsePipes(new ValidationPipe())
    async sendMessage(@MessageBody() dto: SendMessage , @ConnectedSocket() socket: Socket) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const user  = await this.utils.verifyToken(token); // // if has error will catch it
                
                const rtn = await this.utilsFunction(socket , user , dto.roomName);
                
                if(rtn.error)
                {
                    this.OnWebSocektError(socket);
                    console.log(rtn.error)
                    return ;
                }
                else
                {
                    const createdMsg = await this.messagesService.createMessages(dto.message ,user['sub'], rtn.room.id);
                            
                            
                    const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                    
                    for(const userInRoom of usersInroom)
                    {
                        for (let i = 0; i < this.soketsId.length; i++) 
                        {
                            if(this.soketsId[i].userId === userInRoom.userId)
                            {
                                this.server.to(this.soketsId[i].socketIds).emit("add-message", {user: createdMsg.username, msg: createdMsg.msg , roomName: rtn.room.room_name , idOfmsg : createdMsg.idOfMsg})
                            }
                        }

                    }
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
            this.OnWebSocektError(socket);
            console.log(error)
        }
    }


    @SubscribeMessage('join-room') 
    @UsePipes(new ValidationPipe()) // Add the ValidationPipe here
    async joinRoom(@MessageBody() dto:JoinRoomDto , @ConnectedSocket() socket: Socket) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const user  = await this.utils.verifyToken(token); // if has error will catch it
                
                const rtn = await this.utilsFunction(socket , user , dto.roomName , null , 1);
                
                if(rtn.error)
                {
                    this.OnWebSocektError(socket);
                    console.log(rtn.error)
                    return ;
                }
                else
                {
                    if(rtn.room.roomType !== 'PRIVATE')
                    {
                        const usersInRoom:any = await this.utils.getUsersInRooms(rtn.room.id);
                
                        const find = usersInRoom.find((item:any) => item.userId === user['sub']); // search in room if user who want to join this room it is into it or not
                      
                        if(!find)
                        {

                            if(rtn.room.roomType === 'PROTECTED')
                            {
                                if(comparePasswd(dto.password,rtn.room.password) )
                                {
                                    await this.roomService.linkBetweenUsersAndRooms(rtn.room.id, [user['sub']]);
                                
                                    const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                    
                                    for(const userInRoom of usersInroom)
                                    {
                                        for (let i = 0; i < this.soketsId.length; i++) 
                                        {
                                            if(this.soketsId[i].userId === userInRoom.userId)
                                            {
                                                this.server.to(this.soketsId[i].socketIds).emit('users-join', {room : rtn.room , userInfos: await this.utils.getUserInfosInRoom(rtn.room.id) , newUserAdded : usersInroom[usersInroom.length - 1] });                                  
                                            }
                                        }
 
                                    }
                                    return ;
                                }
                                else
                                {
                                    console.log("password inccorect.")
                                    // socket.emit('users-join',"password inccorect.")
                                    return ;
                                }
                            }
                            else if(rtn.room.roomType === 'PUBLIC')
                            {
                                await this.roomService.linkBetweenUsersAndRooms(rtn.room.id, [user['sub']]);
                                
                                const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                
                                for(const userInRoom of usersInroom)
                                {
                                    for (let i = 0; i < this.soketsId.length; i++) 
                                    {
                                        if(this.soketsId[i].userId === userInRoom.userId)
                                        {
                                            this.server.to(this.soketsId[i].socketIds).emit('users-join', {roomId : rtn.room , userInfos: await this.utils.getUserInfosInRoom(rtn.room.id) , newUserAdded : usersInroom[usersInroom.length - 1] });
                                        }
                                    }
        
                                } 
                                return ;
                            } 
                    
                        }
                        else 
                        {
                            console.log('user aleredy in this room.')
                            // socket.emit('error-joinned-room','user aleredy in this room.')
                            // this.OnWebSocektError(socket);
                        }
                    }
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
            this.OnWebSocektError(socket);
            console.log(error)
        }
     
        
    }

    @SubscribeMessage('user-promotion') 
    @UsePipes(new ValidationPipe()) 
    async UserPromotion(@MessageBody() dto:SetOtherAasAdministrators , @ConnectedSocket() socket: Socket) 
    { 
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const user  = await this.utils.verifyToken(token); // // if has error will catch it
                const rtn = await this.utilsFunction(socket , user , dto.roomName , dto.newAdminId);
                
                if(rtn.error)
                {
                    this.OnWebSocektError(socket);
                    console.log(rtn.error)
                    return ;
                }
                else
                {
                    if(rtn.usersType.usersType[0].userType === 'OWNER') // if current user is  owner in this case can set admins
                    { 
                     
                        // here before set admin check if it is aleredy admin or an  user
                        const result = await this.roomService.setNewAdmins(rtn.room.id, rtn.usersType.usersType[1]);

                        if(result.error)
                        {
                            console.log(result.error);
                            return ;
                        }
                        else
                        {
                            
                            const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                            for(const userInRoom of usersInroom)
                            {
                                for (let i = 0; i < this.soketsId.length; i++) 
                                {
                                    if(this.soketsId[i].userId === userInRoom.userId)
                                    {
                                        this.server.to(this.soketsId[i].socketIds).emit("onPromote",{ roomId: rtn.room ,  newAdmin: result.updatesUserType });
                                    } 
                                }
                            }
                            return ;
                        }
                    }
                    else
                    {
                        console.log('dont have the permission to set an admin.');
                        return ;
                    }
                    
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
            this.OnWebSocektError(socket);
            console.log(error)
        }

        
    }

    /*
        * before demte admin
        - check if both user is exist
        - check room if exsit
        - check if both user in same room 
        - if is banned
        - check if current user is owner
        - check if who want to be domted is admin
        - if aleredy admin
    */
    @SubscribeMessage('user-demote') 
    @UsePipes(new ValidationPipe()) 
    async DemoteAdmin(@MessageBody() dto:DemoteUser , @ConnectedSocket() socket: Socket) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const user  = await this.utils.verifyToken(token); // // if has error will catch it
                const rtn = await this.utilsFunction(socket , user , dto.roomName , dto.dmotedUserId);
                
                if(rtn.error)
                {
                    this.OnWebSocektError(socket);
                    console.log(rtn.error)
                    return ;
                }
                else
                {
                    
                    if(rtn.usersType.usersType[0].userType === 'OWNER') // if current user is  owner in this case can set admins
                    { 
                        if(rtn.usersType.usersType[1].userType === 'USER')
                        {
                            console.log('you are not admin.');
                            return ;
                        }
                        const result = await this.roomService.changeToUser(rtn.room.id, rtn.usersType.usersType[1].userId);
                        
                        const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                        
                        for(const userInRoom of usersInroom)
                        {
                            for (let i = 0; i < this.soketsId.length; i++) 
                            {
                                if(this.soketsId[i].userId === userInRoom.userId)
                                {
                                    this.server.to(this.soketsId[i].socketIds).emit("onDemote",{ roomId : rtn.room ,  domotedAdmin: result.updatesUserType });
                                } 
                            }
                        }
                        return ;                        
                    }
                    else
                    {
                        console.log('dont have the permission to set an admin.');
                        return ;
                    }
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
            this.OnWebSocektError(socket);
            console.log(error)
        }
    }


     /*
        * before kick
        - check if both user is exist
        - check room if exsit
        - check if both user in same room 
        - if is banned
        - check if current user is owner or admin
        - check if who want to be kick is not the owner
    */

        @SubscribeMessage('kick-user') 
        @UsePipes(new ValidationPipe()) 
        async KcickUser(@MessageBody() dto:KickUser , @ConnectedSocket() socket: Socket) 
        {

            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it
                    const rtn = await this.utilsFunction(socket , user , dto.roomName , dto.kickedUserId);
                    
                    if(rtn.error)
                    {
                        this.OnWebSocektError(socket);
                        console.log(rtn.error)
                        return ;
                    }
                    else
                    {
                        
                        if(rtn.usersType.usersType[0].userType !== 'USER' && rtn.usersType.usersType[1].userType !== 'OWNER') 
                        {
                            const result = await this.roomService.removeUserFromRoom(rtn.room.id, rtn.usersType.usersType[1].userId);

                            const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
 
                            for(const userInRoom of usersInroom)
                            {
                                for (let i = 0; i < this.soketsId.length; i++) 
                                {
                                    if(this.soketsId[i].userId === userInRoom.userId)
                                    {
                                        this.server.to(this.soketsId[i].socketIds).emit("onKick",{ roomId: rtn.room ,  kickedUser: result.kickedUser });
                                    } 
                                }
                            }

                            console.log('user kcicked succsufully')
                        }  
                        else
                        {
                            console.log('dont have the permission to set an admin.');
                            return ;
                        }
                        
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
                this.OnWebSocektError(socket);
                console.log(error)
            }

 
        }



        async utilsFunction(@ConnectedSocket() socket: Socket , user :any , roomName ? :string , userId ?:string )
        {
            let existingUser:any;
            if(userId)
            {
                // console.log(userId)
                existingUser = await this.utils.getUserId([user['sub']  , userId]); // if both users in db
            }
            else
            {
                existingUser = await this.utils.getUserId([user['sub']]); // if current user in db
            }

            if(existingUser.error)
            {
                this.OnWebSocektError(socket);
                
                return existingUser;
                // emit existingUsers.error
            } 
            
            if(roomName) // if pass room name
            {
                const roomId = await this.utils.getRoomByName(roomName); 
    
                if(roomId)  // if room exist
                {
                    if(!flag)
                    {
                        const usersType = await this.utils.getUserType(roomId.id,existingUser.existingUser); // if both users in this room
                    
                        if(usersType.error)
                        {
                            return usersType;
                        }

                        return {room : roomId , usersType , existingUser };
                    }
                    else // for join room  and add new user to room because current user is not the room
                    {
                        return {room : roomId  , existingUser };
                    }
                }
                else
                {
                    return {error : 'room not found'}
                }
            }
            
            this.soketsId.push({userId : existingUser.existingUser[0], socketIds:socket.id})

            const rooms = await this.utils.getRoomsForUser(existingUser.existingUser[0]); // all rooms who this user is member into it

            let messages:any[] = [];

    
            for(let i = 0; i < rooms.length; i++)
            {
                messages.push({msg : await this.messagesService.getAllMessagesofRoom(rooms[i]['room']['room_name']) , room : rooms[i] , usersInRoom: await this.utils.getUserInfosInRoom(rooms[i].roomId) })
            }
            

            this.server.to(socket.id).emit("list-rooms",{messages});  //  evry client will connected will display the rooms who is member into 
            return {ok : 'connected from chat'}
        }


    OnWebSocektError(socket:Socket)
    { 
 
        // socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }


    async handleDisconnect(socket: Socket) {

        // const index = this.soketsId.findIndex(user => user.socketIds === socket.id);
		 
        // if (index > -1) 
        // {
		// 	const sockets = this.soketsId.filter(user => user.userId === this.soketsId[index].userId);

        //     if (sockets.length < 2)
    	// 		this.soketsId.splice(index, 1);	
		// }

        console.log("disconnected from chat");
         
        this.OnWebSocektError(socket);
    }

   
    
}
