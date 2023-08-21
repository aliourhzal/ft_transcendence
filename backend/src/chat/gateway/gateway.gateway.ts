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
import { BanFromRoom } from 'src/dto/banFromRoom.dto';
import { Mute } from 'src/dto/mute.dto';
import { AddNewUsersToRoom } from 'src/dto/addNewUsersToRoom.dto';
 

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
                
                const rtn = await this.checkOnConnect(socket , user['sub']);
                
            
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


 
    @SubscribeMessage('send-message') // check if user is muted
    @UsePipes(new ValidationPipe())
    async onSendMessage(@MessageBody() dto: SendMessage , @ConnectedSocket() socket: Socket) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const user  = await this.utils.verifyToken(token); // // if has error will catch it
                
                const rtn = await this.checkSendMessage(socket , user['sub'] , dto.roomName);

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


        @SubscribeMessage('ban-user')  // test  if is banned for limmited time and want to banned for ever
        @UsePipes(new ValidationPipe()) 
        async onBanFromRoom(@MessageBody() dto:BanFromRoom , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it
                    const rtn = await this.checkBanUser(socket , user['sub'] , dto.roomName , dto.bannedUserId);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                      
                    else
                    {
                        if(rtn.ifUserInroom.usersType[0].userType !== 'USER' && rtn.ifUserInroom.usersType[1].userType !== 'OWNER') 
                        { 
                            
                            if(dto.duration >= 3600000) // if it banned for limmited time can update the time of ban or set it first time
                            {
                                // in evry function like send message check if is banned for limmited time and if time is out
                                const banExpiresAt = new Date(Date.now() + (dto.duration - 3500100)  ); // because date of now less then 1h
                               
                                // set exporation time
                                const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                
                                const   bannedUser = await this.roomService.bannUser(banExpiresAt, dto.bannedUserId , rtn.room.id , 'BANNEDFORLIMMITED_TIME' );
                                
                                await this.roomService.removeUserFromRoom(rtn.room.id, rtn.ifUserInroom.usersType[1].userId);

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
                                const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                                
                                const   bannedUser =  await this.roomService.bannUser(null, dto.bannedUserId, rtn.room.id , 'BANNEDUNLIMMITED_TIME');

                                await this.roomService.removeUserFromRoom(rtn.room.id, rtn.ifUserInroom.usersType[1].userId);
                                
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

        
        @SubscribeMessage('mute-user')  // test  if is banned for limmited time and want to banned for ever
        @UsePipes(new ValidationPipe()) 
        async mute(@MessageBody() dto:Mute , @ConnectedSocket() socket: Socket) 
        {
           
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it

                    const rtn = await this.checkMuteUser(socket , user['sub'] , dto.roomName , dto.mutedUserId);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                      
                    if(rtn.ifUserInroom.usersType[0].userType !== 'USER' && rtn.ifUserInroom.usersType[1].userType !== 'OWNER') 
                    {
                        const usersInroom = await this.utils.getUsersInRooms(rtn.room.id);
                        // set user as muted
                        if(dto.duration >= 3600000) // if it banned for limmited time can update the time of ban or set it first time
                        {
                            // in evry function like send message check if is banned for limmited time and if time is out
                            const banExpiresAt = new Date(Date.now() + (dto.duration - 3500100) ); // because date of now less then 1h
                            
                            // set exporation time
                                
                            const mutedUser = await this.roomService.muteUser(banExpiresAt, dto.mutedUserId , rtn.room.id , 'MUTEDFORLIMITEDTIME' );
                            
                            

                            for(const userInRoom of usersInroom)
                            {
                             
                                for (let i = 0; i < this.soketsId.length; i++) 
                                {
                                    if(this.soketsId[i].userId === userInRoom.userId)
                                    {
                                        this.server.to(this.soketsId[i].socketIds).emit("onKick",{ roomId: rtn.room , mutedUser });
                                    } 
                                }
                            }
                            console.log('muted succufly')
                        
                        }
                        else if(dto.duration < 0)// banned for unlimeted time and remove her mesasges
                        {
                                
                            const mutedUser = await this.roomService.muteUser(null, dto.mutedUserId , rtn.room.id , 'MUTEDFOREVER' );

                            for(const userInRoom of usersInroom)
                            {
                             
                                for (let i = 0; i < this.soketsId.length; i++) 
                                {
                                    if(this.soketsId[i].userId === userInRoom.userId)
                                    {
                                        this.server.to(this.soketsId[i].socketIds).emit("onKick",{ roomId: rtn.room , mutedUser });
                                    } 
                                }
                            }
                            console.log('muted succufly')
                        
                        }
                        else
                        {
                            console.log('should mute from 1 hour to 3 days')
                        }
                        
                    }  
                    else
                    {
                        console.log('dont have the permission to set an admin.');
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
                    
                    const rtn = await this.checkOnJoinRoom(socket , user['sub'] , dto.roomName);
                    
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


        @SubscribeMessage('add-room-users') 
        @UsePipes(new ValidationPipe()) 
        async addNewUsersToRoom(@MessageBody() dto:AddNewUsersToRoom, @ConnectedSocket() socket: Socket) 
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

                    const rtn = await this.checkOnAddNewUsers(user['sub'] , usersId.uniqUsers , dto.roomName);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error);
                        return ;
                    }
                                    
                            
                        const newUsers = await this.roomService.linkBetweenUsersAndRooms(rtn.roomId.id , rtn.usersId);
                            
                        const usersInroom = await this.utils.getUsersInRooms(rtn.roomId.id);
                            
                        for(const userInRoom of usersInroom)
                        {
                            for (let i = 0; i < this.soketsId.length; i++) 
                            {
                                if(this.soketsId[i].userId === userInRoom.userId)
                                {
                                    this.server.to(this.soketsId[i].socketIds).emit('users-join', {roomId : rtn.roomId , userInfos: await this.utils.getUserInfosInRoom(rtn.roomId.id) , newUserAdded : newUsers });
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


        /*-------------------------------------------------when send join room use this utils function--------------------------------------------------------- */
        
        async checkOnAddNewUsers(currentUserId :string  , usersId : string[] , roomName  : string)
        {
            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInRoom = await this.utils.getUserType(roomInfos.id, [currentUserId]);

                if(ifUserInRoom.error)
                {
                    return {error : ifUserInRoom.error}
                }

                if(ifUserInRoom.usersType[0] !== 'USER')
                {
                    for(const userId of usersId)  
                    {
                        const isBanned = await this.utils.ifUserIsBanned(userId , roomInfos.id);

                        if(isBanned.isBanned !== 'UNBANNED') // if is banned make it not banned
                        {
                            await this.roomService.makeUserUnbanned(userId, roomInfos.id);
                        }

                        const isMuted = await this.utils.isUserMuted(userId , roomInfos.id);

                        if(isMuted.isMuted !== 'UNMUTED') // if is muted make it not banned
                        {
                            await this.roomService.makeUserUnMuted(userId, roomInfos.id);
                        }
                    } 
                    return { roomId: roomInfos , usersId};
                }
                else
                {
                    return {error : 'dont have the permmission to add users to this room.'}
                }
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */




        /*-------------------------------------------------when send join room use this utils function--------------------------------------------------------- */
        
        async checkOnJoinRoom(@ConnectedSocket() socket: Socket , currentUserId :string , roomName  : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const isBanned = await this.utils.ifUserIsBanned(currentUserId , roomInfos.id);
                      
                 
                if(!isBanned) // if first time want to join the room
                {
                    return {room : roomInfos  , currentUserId };
                }
                else // if this user is banned from the room and want to join another time
                {
                    if(isBanned.isBanned === 'BANNEDFORLIMMITED_TIME')
                    {
                        if (isBanned.banExpiresAt <= new Date()) // if ban Expire
                        {
                            await this.roomService.makeUserUnbanned(currentUserId, roomInfos.id); // make user unbanned
                            
                            console.log('user is unbanned.')
                            
                            return {room : roomInfos  , currentUserId };
                        }
                        return {error : 'you are banned for limmited time.'}
                        
                    }
                    return {error : 'you are banned for forever.'}
                }
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */




        /*-------------------------------------------------when send mute user use this utils function--------------------------------------------------------- */
        
        async checkMuteUser(@ConnectedSocket() socket: Socket , currentUserId :string , roomName  : string, bannedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , bannedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , bannedUserId ]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

                return {room : roomInfos , ifUserInroom , currentUserId };
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */




        /*-------------------------------------------------when send ban user use this utils function--------------------------------------------------------- */
        
        async checkBanUser(@ConnectedSocket() socket: Socket , currentUserId :string , roomName  : string, bannedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , bannedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , bannedUserId ]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

                return {room : roomInfos , ifUserInroom , currentUserId };
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */



        /*-------------------------------------------------when send message use this utils function--------------------------------------------------------- */
        
        async checkSendMessage(@ConnectedSocket() socket: Socket , currentUserId :string , roomName  :string)
        {
            const existingUser = await this.utils.getUserId([currentUserId]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

            
                // check if user is muted or not

                const isMuted = await this.utils.isUserMuted(currentUserId, roomInfos.id);
                
                if(!isMuted) // if user is not in the black list table
                {
                    return {room : roomInfos , ifUserInroom , currentUserId };
                }
                else if(isMuted.isMuted === 'UNMUTED')
                    return {room : roomInfos , ifUserInroom , currentUserId };
                
                else if(isMuted.isMuted === 'MUTEDFORLIMITEDTIME')
                    return {error : 'user is muted for limmited time, cannot send message.'};                     
                
                return {error : 'user is muted for ever, cannot send message.'};                     
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        /*---------------------------------------------------------------------------------------------------------- */

        /*-------------------------------------------------on connect use this utils function--------------------------------------------------------- */
        
        async checkOnConnect(@ConnectedSocket() socket: Socket , currentUserId :string)
        {
            const existingUser = await this.utils.getUserId([currentUserId]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
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

        /*---------------------------------------------------------------------------------------------------------- */
            


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
