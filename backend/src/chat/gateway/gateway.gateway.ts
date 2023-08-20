/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from  'socket.io';
import { UsersService } from 'src/users/users.service';
import {  UserData, ArrayOfClinets } from 'src/utils/userData.interface';
import { RoomsService } from '../rooms/rooms.service';
import { UtilsService } from 'src/utils/utils.service';
import { MessagesService } from '../messages/messages.service';
import { JoinRoomDto } from 'src/dto/join-room.dto';
import { comparePasswd, encodePasswd } from 'src/utils/bcrypt';
import { SendMessage } from 'src/dto/sendMessage.dto';
import { createRoom } from 'src/dto';
import { RoomType } from 'src/utils/userData.interface';
import { SetOtherAasAdministrators } from 'src/dto/setOtherAasAdministrators.dto';
import { DemoteUser } from 'src/dto/DemoteUser.dto';
import { KickUser } from 'src/dto/Kickusers.sto';
import { AddNewUsersToRoom } from 'src/dto/addNewUsersToRoom.dto';
import { LeaveRoom } from 'src/dto/leaveRoom.dto';
import { RenameRoom } from 'src/dto/renameRoom.dto';
import { ChangeRoomPassword } from 'src/dto/changeRoomPassword.dto';
import { BanFromRoom } from 'src/dto/banFromRoom.dto';

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
                    console.log(rtn.error)
                    return ;
                }
                else
                    console.log(rtn.ok)
            
            } 
            else
            {
                console.log('invalid jwt.');
            }
        }   
        catch (error) 
        {
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
                    // check if curent user is exist
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
                                        this.server.to(this.soketsId[i].socketIds).emit("new-room",{room  , usersInroom , userInfos: await this.utils.getUserInfosInRoom(room.room.id)});
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
            }
        }   
        catch (error) 
        {
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
                                    const newUserAdded = await this.roomService.linkBetweenUsersAndRooms(rtn.room.id, [user['sub']]);
                                
                                    const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                    
                                    for(const userInRoom of usersInroom)
                                    {
                                        for (let i = 0; i < this.soketsId.length; i++) 
                                        {
                                            if(this.soketsId[i].userId === userInRoom.userId)
                                            {
                                                this.server.to(this.soketsId[i].socketIds).emit('users-join', {room : rtn.room , userInfos: await this.utils.getUserInfosInRoom(rtn.room.id) , newUserAdded :[newUserAdded] });                                  
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
                                const newUserAdded = await this.roomService.linkBetweenUsersAndRooms(rtn.room.id, [user['sub']]);
                                
                                const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                
                                for(const userInRoom of usersInroom)
                                {
                                    for (let i = 0; i < this.soketsId.length; i++) 
                                    {
                                        if(this.soketsId[i].userId === userInRoom.userId)
                                        {
                                            this.server.to(this.soketsId[i].socketIds).emit('users-join', {roomId : rtn.room , userInfos: await this.utils.getUserInfosInRoom(rtn.room.id) , newUserAdded  });
                                        }
                                    }
        
                                } 
                            } 
                    
                        }
                        else 
                        {
                            console.log('user aleredy in this room.')
                            // socket.emit('error-joinned-room','user aleredy in this room.')
                        }
                    }
                }
            } 
            else
            {
                console.log('invalid jwt.');
            }
        }   
        catch (error) 
        {
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
            }
        }   
        catch (error) 
        {
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
            }
        }   
        catch (error) 
        {
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
                        console.log(rtn.error)
                        return ;
                    }
                    else
                    {
                        
                        if(rtn.usersType.usersType[0].userType !== 'USER' && rtn.usersType.usersType[1].userType !== 'OWNER') 
                        {
                            const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                            
                            const result = await this.roomService.removeUserFromRoom(rtn.room.id, rtn.usersType.usersType[1].userId);

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
                }
            }   
            catch (error) 
            {
                console.log(error)
            } 
        }


        @SubscribeMessage('add-room-users') 
        @UsePipes(new ValidationPipe()) 
        async addNewUsersToRoom(@MessageBody() dto:AddNewUsersToRoom , @ConnectedSocket() socket: Socket) 
        {
            
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it

                    const usersId = await this.utils.getUsersIdByNickname(user['sub'] , dto.users , 1);
                    
                    if(usersId.error)
                    {
                        console.log(usersId.error);
                        return ;
                    }
                    const roomId = await this.utils.getRoomByName(dto.roomName);
                   
                    if(roomId)
                    {
                        const userType = await this.utils.getUserType(roomId.id, [user['sub']]);

                        if(userType.error)
                        {
                            console.log(userType.error);
                            return ;
                        }
                         
                        if(userType.usersType[0] !== 'USER') // test one by one
                        {
                            const newUsers = await this.roomService.linkBetweenUsersAndRooms(roomId.id, usersId.uniqUsers);
                            
                            const usersInroom = await this.utils.getUsersInRooms(roomId.id);
                                
                            for(const userInRoom of usersInroom)
                            {
                                for (let i = 0; i < this.soketsId.length; i++) 
                                {
                                    if(this.soketsId[i].userId === userInRoom.userId)
                                    {
                                        this.server.to(this.soketsId[i].socketIds).emit('users-join', {roomId  , userInfos: await this.utils.getUserInfosInRoom(roomId.id) , newUserAdded : newUsers });
                                    }
                                }
    
                            } 
                            
                        }
                        else
                        {
                            console.log('dont have the permmission to add users to this room.')
                            return ;
                        }
                    }
                    else
                    {
                        console.log('room not found')
                        return;
                    }
                    
                } 
                else
                {
                    console.log('invalid jwt.');
                }
            }   
            catch (error) 
            {
                console.log(error)
            } 
        }




         /**
    //      * before rename the room:
    //      *  - check the user if is valid
    // - if current user in this room
    //      *  - if room is exist
    //      *  - if new name of the room not found in db
    //      * - if admin or owner 
    //      */
        @SubscribeMessage('edit-room-name') 
        @UsePipes(new ValidationPipe()) 
        async renameRoom(@MessageBody() dto:RenameRoom , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it

                    const existingUser = await this.utils.getUserId([user['sub']]);
                     
                    if(existingUser.error)
                    {
                        console.log(existingUser.error);
                        return ;
                    }

                    const roomId = await this.utils.getRoomByName(dto.roomName);

                    if(roomId)
                    {
                        const userType = await this.utils.getUserType(roomId.id,[user['sub']]);
                        if(userType.error)
                        {
                            console.log(userType.error);
                            return ;
                        }
                        if (userType.usersType[0].userType !== 'USER') 
                        {
                            if(!await this.utils.getRoomIdByName(dto.newName))
                            {
                                const oldRoomName = dto.roomName;
                                const newRoomName = await this.roomService.updateRoomName(roomId.id, dto.newName);

                                const usersInroom = await this.utils.getUsersInRooms(roomId.id);

                                for(const userInRoom of usersInroom)
                                {
                                    for (let i = 0; i < this.soketsId.length; i++) 
                                    {
                                        if(this.soketsId[i].userId === userInRoom.userId)
                                        {
                                            this.server.to(this.soketsId[i].socketIds).emit("change-room-name",{ oldRoomName, newRoomName : newRoomName.room_name});
                                        } 
                                    }
                                }

                            }
                            else
                            {
                                console.log('name of room aleredy exist');
                            }
                        }
                        else
                        {
                            console.log("cannot have the permission to change room Type.")
                        }   
                    }
                    else
                    {
                        console.log('room not found')
                        return;
                    }
                    
                } 
                else
                {
                    console.log('invalid jwt.');
                }
            }   
            catch (error) 
            {
               
                console.log(error)
            } 
        }



        @SubscribeMessage('edit-room-password') 
        @UsePipes(new ValidationPipe()) 
        async changeRoomPassword(@MessageBody() dto:ChangeRoomPassword , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it

                    const existingUser = await this.utils.getUserId([user['sub']]);
                     
                    if(existingUser.error)
                    {
                        console.log(existingUser.error);
                        return ;
                    }

                    const roomId = await this.utils.getRoomByName(dto.roomName);

                    if(roomId)
                    {
                        const userType = await this.utils.getUserType(roomId.id,[user['sub']]);

                        if(userType.error)
                        {
                            console.log(userType.error);
                            return ;
                        }
                        if (userType.usersType[0].userType !== 'USER') 
                        {
                            if(roomId.roomType === 'PROTECTED')
                            {
                                await this.roomService.changePasswordOfProtectedRoom(roomId.id, encodePasswd(dto.newPassword));
                             }
                            else
                            {
                                console.log('room is not PROTECTED')
                                return;
                            }
                            
                        }
                        else
                        {
                            console.log("cannot have the permission to change room Type.")
                        }   
                    }
                    else
                    {
                        console.log('room not found')
                        return;
                    }
                    
                } 
                else
                {
                    console.log('invalid jwt.');
                }
            }   
            catch (error) 
            {
               
                console.log(error)
            } 
        }


        // implement remove password of protected room





        /*
            * before ban user:
            - check if both user is exist
            - check room if exsit
            - check if both user in same room 
            - if is banned
            - check if current user is owner or admin
            - check if who want to be ban is not the owner

            - if finish duration remove the ban
        */





        @SubscribeMessage('ban-user')  // test  if is banned for limmited time and want to banned for ever
        @UsePipes(new ValidationPipe()) 
        async banFromRoom(@MessageBody() dto:BanFromRoom , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it
                    const rtn = await this.utilsFunction(socket , user , dto.roomName , dto.bannedUserId , 2);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                      
                    else
                    {
                        if(rtn.usersType.usersType[0].userType !== 'USER' && rtn.usersType.usersType[1].userType !== 'OWNER') 
                        { 
                            
                            if(dto.duration >= 3600000) // if it banned for limmited time can update the time of ban or set it first time
                            {
                                // in evry function like send message check if is banned for limmited time and if time is out
                                const banExpiresAt = new Date(Date.now() + (dto.duration - 3500100) ); // because date of now less then 1h
                               
                                // set exporation time
                                const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                
                                const   bannedUser = await this.roomService.setExpirention(banExpiresAt, dto.bannedUserId , rtn.room.id );
                                
                                await this.roomService.removeUserFromRoom(rtn.room.id, rtn.usersType.usersType[1].userId);

                                

                                for(const userInRoom of usersInroom)
                                {
                                    for (let i = 0; i < this.soketsId.length; i++) 
                                    {
                                        if(this.soketsId[i].userId === userInRoom.userId)
                                        {
                                            this.server.to(this.soketsId[i].socketIds).emit("onBan",{ roomId: rtn.room , bannedUser , duration : dto.duration});
                                        } 
                                    }
                                }

                                console.log('banned succufly')
                            
                            }
                            else if(dto.duration < 0)// banned for unlimeted time and remove her mesasges
                            {
                                const   bannedUser =  await this.roomService.banUserForEver(dto.bannedUserId, rtn.room.id);

                                await this.roomService.removeUserFromRoom(rtn.room.id, rtn.usersType.usersType[1].userId);

                                const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                
                                for(const userInRoom of usersInroom)
                                {
                                    for (let i = 0; i < this.soketsId.length; i++) 
                                    {
                                        if(this.soketsId[i].userId === userInRoom.userId)
                                        {
                                            this.server.to(this.soketsId[i].socketIds).emit("onBan",{ roomId: rtn.room , bannedUser , duration : dto.duration});
                                        } 
                                    }
                                }

                                console.log('banned succufly')
                            
                            }
                            else
                            {
                                console.log('should ban from 1 hour to 3 days')
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
                }
            } 
            catch (error) 
            {
    
                console.log(error)
            } 
        }





        @SubscribeMessage('leave-room')  // test  if is banned for limmited time and want to banned for ever

        @UsePipes(new ValidationPipe()) 
        async leaveRoom(@MessageBody() dto:LeaveRoom , @ConnectedSocket() socket: Socket) 
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
                        console.log(rtn.error)
                        return ;
                    }
                      
                    else
                    {
                        if(await this.roomService.doesRoomHaveUsers(rtn.room.id))
                        {
                            if(rtn.usersType.usersType[0].userType === 'OWNER')
                            { 
                                await this.roomService.removeUserFromRoom(rtn.room.id, user['sub']);
            
                                let newOwner:any = await this.roomService.getFirstUser('ADMIN') // get first admin if found it
        
                                if(!newOwner) // if not found an admin
                                {
                                    newOwner = await this.roomService.getFirstUser('USER') // will search for the first user in the room
            
                                    await this.roomService.setNewOwner(rtn.room.id, newOwner.userId) // set first user in the room as owner
                                    
                                    return ;
                                }
                                await this.roomService.setNewOwner(rtn.room.id, newOwner.userId) // set this first admin as the owne
                            }
                            else
                            {
                                // check here if banned
                                await this.roomService.removeUserFromRoom(rtn.room.id, user['sub']); // if admin or user leave 
                            }      
                        }
                    }  
                }
                else
                {
                    console.log('invalid jwt.');
                }
            } 
            catch (error) 
            {
    
                console.log(error)
            } 
        }






        async utilsFunction(@ConnectedSocket() socket: Socket , user :any , roomName ? :string , userId ?:string[] | string , flag?:number) // add flag for join room
        {
            let existingUser:any;
 
            if(userId)
            {
                existingUser = await this.utils.getUserId([user['sub']  , userId]); // if both users in db
            }
            else
            {
                existingUser = await this.utils.getUserId([user['sub']]); // if current user in db
            }

            if(existingUser.error)
            {
                return existingUser;
            } 
            if(roomName) // if pass room name
            {
                const roomId = await this.utils.getRoomByName(roomName); 
    
                if(roomId)  // if room exist
                {
                    const usersType = await this.utils.getUserType(roomId.id,existingUser.existingUser); // if both users in this room
                   
                    if(flag === 1)  
                    {
                        const isBanned = await this.utils.ifUserIsBanned(existingUser.existingUser[0] , roomId.id);
                        
                        if(!isBanned) // if first time want to join the room
                        {
                            return {room : roomId  , existingUser };
                        }
                        else // if this user is banned from the room and want to join another time
                        {
                            if(isBanned.isBanned === 'BANNEDFORLIMMITED_TIME')
                            {
                                if (isBanned.banExpiresAt <= new Date()) // if ban Expire
                                {
                                    await this.roomService.makeUserUnbanned(existingUser.existingUser[0], roomId.id); // make user unbanned
                                    
                                    console.log('user is unbanned.')
                                    
                                    return {room : roomId  , existingUser };
                                }
        
                                return {error : 'user is banned for limmited time.'}
                            }
                        }
                    }

                    else if(flag === 2) // if want to ban user
                    {
                        const isBanned = await this.utils.ifUserIsBanned(existingUser.existingUser[1] , roomId.id);                     
                        if(!isBanned) // if first time will ban means is not in table of banned users
                            return {room : roomId , usersType , existingUser };
                        
                        else
                        {
                            if(isBanned.isBanned === 'BANNEDUNLIMMITED_TIME')
                            {
                                return {error : 'you are banned for life.'}
                            }
                            
                            // else we do it if want to refresh time of baning
                            return {room : roomId , usersType , existingUser }; 
                        }
                    }
                    else // if not banned , (if not banned means user still in db).
                    {
                        if(usersType.error)
                        {
                            return usersType;
                        }

                        return {room : roomId , usersType , existingUser };
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
                messages.push({msg : await this.messagesService.getAllMessagesofRoom(rooms[i]['room']['room_name']) , room : rooms[i] , usersInRoom: await this.utils.getUserInfosInRoom(rooms[i].roomId)})
            }
            
            this.server.to(socket.id).emit("list-rooms",{messages});  //  evry client will connected will display the rooms who is member into 
            return {ok : 'connected from chat'}
        }


    OnWebSocektError(socket:Socket)
    { 
 
        // socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }


    async handleDisconnect(socket: Socket) 
    {
        console.log("disconnected from chat");    
        for (let i = 0; i < this.soketsId.length; i++) 
        {
            if(this.soketsId[i].socketIds === socket.id)
            {
                this.soketsId = this.soketsId.splice(i, i + 1);
                break;
            }
        } 
        this.OnWebSocektError(socket);
    }

   
    
}
