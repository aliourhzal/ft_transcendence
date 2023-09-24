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
import { GatewayService } from './gateway.service';
import { KickUser } from 'src/dto/Kickusers.sto';
import { LeaveRoom } from 'src/dto/leaveRoom.dto';
import { DemoteUser } from 'src/dto/DemoteUser.dto';
import { SetOtherAasAdministrators } from 'src/dto/setOtherAasAdministrators.dto';
import { ChangeRoomPassword } from 'src/dto/changeRoomPassword.dto';
import { RenameRoom } from 'src/dto/renameRoom.dto';
import { RemoveRoomPassword } from 'src/dto/removeRoomPassword.dto';
import { Unmute } from 'src/dto/unmute.dto';
import { DirectMessages } from 'src/dto/directMessages.dto';
import { getRooms } from 'src/dto/getRooms.dto';
import { MakeRoomProtected } from 'src/dto/makeRoomProtected.dto';
import { Block } from 'src/dto/block.dto';
import { UnBlock } from 'src/dto/unBlock.dto';
import { deleteMsg } from 'src/dto/deleteMsg';
 

@WebSocketGateway(3004)
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    
    constructor(private readonly roomService:RoomsService,
        private readonly utils:UtilsService,
        private readonly messagesService:MessagesService,
        private readonly gatewayService: GatewayService
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
                    if (dto.roomName.length > 20) 
                    {
                        console.log("room name should be less then 20 characters");
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
                            
                            await this.emmiteEventesToUsers(socket, room.room.id ,"new-room" , {room   , userInfos: await this.utils.getUserInfosInRoom(room.room.id) ,usersInroom: await this.utils.getUsersInRooms(room.room.id)} );
                        }
                        else
                        { 
                            const room = await this.roomService.createRoom({roomName: dto.roomName, users: usersId.uniqUsers}, decodedToken['sub'], dto.type);
                            if(room.error)
                            {
                                console.log(room.error)
                                return
                            }
                             
                            await this.emmiteEventesToUsers(socket, room.room.id ,"new-room" , {room   , userInfos: await this.utils.getUserInfosInRoom(room.room.id) ,usersInroom: await this.utils.getUsersInRooms(room.room.id)} );
        
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
                               
                const rtn = await this.gatewayService.checkSendMessage( user['sub'] , dto.roomId);

                if(rtn.error)
                {
                    console.log(rtn.error)
                    return ;
                }
                else
                {
                    const createdMsg = await this.messagesService.createMessages(dto.message ,user['sub'], rtn.room.id);
                     
                    // await this.emmiteEventesToUsers(socket, rtn.room.id  ,"add-message", {userId: createdMsg.user, msg: createdMsg.msg , roomId: rtn.room.id , idOfmsg : createdMsg.idOfMsg})
                          
                    const allUsersBlockedByMe = (await this.roomService.allUsersBlockedByMe(user['sub'])).blockedUsers;
            
                    const allUsersWhoBlockMe = await this.roomService.allUsersWhoBlockMe(  user['sub']);
                
                    let allBlockedUsers =   allUsersWhoBlockMe.map((item) => item.id);
                    
                    allBlockedUsers.push(...allUsersBlockedByMe.map((item) => item.id))

                    let uniqBlockedUsers : string[] = [];
                    const  getAllUsersIdInRoom = await this.roomService.getAllUsersIdInRoom(rtn.room.id);

                    for(let i = 0; i < getAllUsersIdInRoom.length ; i++)
                    {
                        let t = 0;
                        for(let j = 0 ; j < allBlockedUsers.length ; j++)
                        {
                            if(getAllUsersIdInRoom[i].userId === allBlockedUsers[j])
                                t++;
                        }
                        if(t === 0)
                            uniqBlockedUsers.push(getAllUsersIdInRoom[i].userId);
                    }
                    if(uniqBlockedUsers.length === 1 && getAllUsersIdInRoom.length === 2) // if two users in block in direct message dont send message or all users are blocked in room dont send message
                    {
                        return ;
                    }
                    for(const userInRoom of uniqBlockedUsers)
                    {
                        for (let i = 0; i < this.soketsId.length; i++) 
                        {

                            if(this.soketsId[i].userId === userInRoom)
                            {
                                this.server.to(this.soketsId[i].socketIds).emit("add-message" ,{ userId: createdMsg.user, msg: createdMsg.msg , roomId: rtn.room.id , idOfmsg : createdMsg.idOfMsg});
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
                    const rtn = await this.gatewayService.checkBanUser( user['sub'] , dto.roomName , dto.bannedUserId);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                      
                    else
                    {
                        if(rtn.ifUserInroom.usersType[0].userType !== 'USER' && rtn.ifUserInroom.usersType[1].userType !== 'OWNER') 
                        { 
                            
                            if(dto.duration >= 120000) // if it banned for limmited time can update the time of ban or set it first time
                            {
                                // in evry function like send message check if is banned for limmited time and if time is out
                                const banExpiresAt = new Date(Date.now() + dto.duration ); // because date of now less then 1h
                               
                                // set exporation time
                                 
                                const   bannedUser = await this.roomService.bannUser(banExpiresAt, dto.bannedUserId , rtn.room.id , 'BANNEDFORLIMMITED_TIME' );
                                
                                await this.roomService.removeUserFromRoom(rtn.room.id, rtn.ifUserInroom.usersType[1].userId);

                                

                                await this.emmiteEventesToUsers(socket, rtn.room.id  ,"onBan", { roomId: rtn.room , bannedUser , duration : dto.duration } , bannedUser)
                                console.log('banned succufly')
                            
                            }
                            else if(dto.duration < 0)// banned for unlimeted time and remove her mesasges
                            {
                                 
                                const   bannedUser =  await this.roomService.bannUser(null, dto.bannedUserId, rtn.room.id , 'BANNEDUNLIMMITED_TIME');

                                await this.roomService.removeUserFromRoom(rtn.room.id, rtn.ifUserInroom.usersType[1].userId);
                                
                                await this.emmiteEventesToUsers(socket, rtn.room.id  ,"onBan", { roomId: rtn.room , bannedUser , duration : dto.duration} , bannedUser)
                               
                                console.log('banned succufly')
                            }
                            else
                            {
                                console.log('should ban from 2 min  to 8 hours.')
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

                    const rtn = await this.gatewayService.checkMuteUser( user['sub'] , dto.roomName , dto.mutedUserId);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                      
                    if(rtn.ifUserInroom.usersType[0].userType !== 'USER' && rtn.ifUserInroom.usersType[1].userType !== 'OWNER') 
                    {
                        // set user as muted
                        if(dto.duration >= 120000) // if it banned for limmited time can update the time of ban or set it first time
                        {
                            // in evry function like send message check if is banned for limmited time and if time is out
                            const muteExpiresAt = new Date(Date.now() + dto.duration); // because date of now less then 1h
                            
                            // set exporation time
                            
                            const mutedUser = await this.roomService.muteUser(muteExpiresAt, dto.mutedUserId , rtn.room.id , 'MUTEDFORLIMITEDTIME' );
                            
                            await this.emmiteEventesToUsers(socket, rtn.room.id  ,"onMute", { roomId: rtn.room , mutedUser })
                            
                            setTimeout( async () => {
                                const user  = await this.utils.verifyToken(token); // // if has error will catch it
                                if (user) {
                                    const rtn = await this.gatewayService.checkUnMuteUser( user['sub'] , dto.roomName , dto.mutedUserId);
                                    if (rtn) {
                                        await this.emmiteEventesToUsers(socket, rtn.room.id ,"onUnMute", { roomId: rtn.room , unMutedUser : mutedUser })
                                        console.log("unmuted after time finished")
                                    }
                                }
                                return clearTimeout
                            }, dto.duration)

                            console.log('muted succufly')
                        
                        }
                        else if(dto.duration < 0)// banned for unlimeted time and remove her mesasges
                        {
                                
                            const mutedUser = await this.roomService.muteUser(null, dto.mutedUserId , rtn.room.id , 'MUTEDFOREVER' );

                            await this.emmiteEventesToUsers(socket, rtn.room.id  ,"onMute", { roomId: rtn.room , mutedUser })

                            console.log('muted succufly')
                        
                        }
                        else
                        {
                            console.log('should mute from 2 min  to 8 hours.')
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

        @SubscribeMessage('unmute-user')  // test  if is banned for limmited time and want to banned for ever
        @UsePipes(new ValidationPipe()) 
        async unmute(@MessageBody() dto:Unmute , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it

                    const rtn = await this.gatewayService.checkUnMuteUser( user['sub'] , dto.roomName , dto.unmutedUserId);
        
                    // emit "onUnMute" roominfo + unMutedUser

                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }

                    await this.emmiteEventesToUsers(socket, rtn.room.id ,"onUnMute", { roomId: rtn.room , unMutedUser : rtn.unMutedUser })
                    
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


        @SubscribeMessage('join-room') // after user join after ban error in front
        @UsePipes(new ValidationPipe()) // Add the ValidationPipe here
        async joinRoom(@MessageBody() dto:JoinRoomDto , @ConnectedSocket() socket: Socket) 
        {
            
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // if has error will catch it
                    
                    const rtn = await this.gatewayService.checkOnJoinRoom( user['sub'] , dto.roomName);
                    
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
                                        const messageAndUserName = await this.messagesService.getAllMessagesofRoom( rtn.room.id, user['sub']);
                                    
                                        await this.emmiteEventesToUsers(socket, rtn.room.id  ,"users-join", {messageAndUserName , roomId : rtn.room , userInfos: await this.utils.getUserInfosInRoom(rtn.room.id) , newUserAdded })

                                         
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
                                    
                                    const messageAndUserName = await this.messagesService.getAllMessagesofRoom( rtn.room.id, user['sub']);


                                    await this.emmiteEventesToUsers(socket, rtn.room.id  ,"users-join", {messageAndUserName , roomId : rtn.room , userInfos: await this.utils.getUserInfosInRoom(rtn.room.id) , newUserAdded })
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

                    const rtn = await this.gatewayService.checkOnAddNewUsers(user['sub'] , usersId.uniqUsers , dto.roomName);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error);
                        return ;
                    }
                                    
              
                    const newUsers = await this.roomService.linkBetweenUsersAndRooms(rtn.roomId.id , rtn.usersId);

                    const messageAndUserName = await this.messagesService.getAllMessagesofRoom( rtn.roomId.id, user['sub']);
                        
                    await this.emmiteEventesToUsers(socket, rtn.roomId.id  , "users-join", {messageAndUserName, roomId : rtn.roomId , userInfos: await this.utils.getUserInfosInRoom(rtn.roomId.id) , newUserAdded : newUsers })
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


        @SubscribeMessage('kick-user') 
        @UsePipes(new ValidationPipe()) 
        async onKick(@MessageBody() dto:KickUser , @ConnectedSocket() socket: Socket) 
        {

            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it
                    const rtn = await this.gatewayService.checkKickUser(user['sub'] , dto.roomName , dto.kickedUserId);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                    else
                    {
                        
                        if(rtn.ifUserInroom.usersType[0].userType !== 'USER' && rtn.ifUserInroom.usersType[1].userType !== 'OWNER') 
                        {
                            const result = await this.roomService.removeUserFromRoom(rtn.room.id, rtn.ifUserInroom.usersType[1].userId);

                            await this.emmiteEventesToUsers(socket, rtn.room.id  , "onKick", { roomId: rtn.room ,  kickedUser: result.kickedUser } , result.kickedUser)
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
        

        @SubscribeMessage('leave-room')  // test  if is banned for limmited time and want to banned for ever
        @UsePipes(new ValidationPipe()) 
        async leaveRoom(@MessageBody() dto:LeaveRoom , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it\

                    const rtn = await this.gatewayService.checkLeave( user['sub'] , dto.roomName);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                      
                    else
                    {
                        if(await this.roomService.doesRoomHaveUsers(rtn.room.id))
                        {
                            const leavedUser : any = await this.roomService.removeUserFromRoom(rtn.room.id, user['sub']);
                            
                            if(rtn.ifUserInroom.usersType[0].userType === 'OWNER')
                            { 

                                const firstUser : any = await this.roomService.getFirstUserInRoom(rtn.room.id, 'ADMIN') // get first admin if found it
                                
                                let newOwner:any;

                                
                                if(!firstUser) // if no admin found
                                {
                                    const firstUser = await this.roomService.getFirstUserInRoom(rtn.room.id, 'USER')

                                    if(!firstUser) // if nor user
                                    {                                         
                                        for(let i = 0; i < this.soketsId.length; i++) 
                                        {
                                            if(this.soketsId[i].userId === user['sub'])
                                            {
                                                this.server.to(this.soketsId[i].socketIds).emit("onLeave" , { roomId: rtn.room , newOwner : null , leavedUser});
                                            } 
                                        }
                                            
                                        await this.roomService.removeRoom(rtn.room.id)
                                        console.log(`${rtn.room.room_name} delted.`)
                                        return;
                                    }

                                    newOwner =  await this.roomService.setNewOwner(rtn.room.id, firstUser.userId);
                                    
                                    await this.emmiteEventesToUsers(socket, rtn.room.id  , "onLeave",{ roomId: rtn.room , newOwner , leavedUser } , leavedUser.kickedUser);
                                }
                                else
                                {
                                    console.log('here 2')

                                    newOwner =  await this.roomService.setNewOwner(rtn.room.id, firstUser.userId);

                                    await this.emmiteEventesToUsers(socket, rtn.room.id  ,"onLeave",{ roomId: rtn.room , newOwner , leavedUser} , leavedUser.kickedUser);
                                }
                            }
                            else
                            {
                                await this.emmiteEventesToUsers(socket, rtn.room.id  , "onLeave",{ roomId: rtn.room , newOwner : null , leavedUser  } , leavedUser.kickedUser);
                            }      
                        }
                        else
                        {
                            await this.roomService.removeRoom(rtn.room.id)
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




        @SubscribeMessage('user-promotion') // check if user is muted
        @UsePipes(new ValidationPipe()) 
        async onUserPromotion(@MessageBody() dto:SetOtherAasAdministrators , @ConnectedSocket() socket: Socket) 
        { 
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it
                    const rtn = await this.gatewayService.checkUserPromotion(user['sub'] , dto.roomName , dto.newAdminId);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                    else
                    {
                        const result = await this.roomService.setNewAdmins(rtn.roomInfos.id, rtn.ifUserInroom.usersType[1]);

                        if(result.error)
                        {
                            console.log(result.error);
                            return ;
                        }
                        else
                        {
                            await this.emmiteEventesToUsers(socket, rtn.roomInfos.id  ,"onPromote",{ roomId: rtn.roomInfos ,  newAdmin: result.updatesUserType });
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
                    const rtn = await this.gatewayService.checkUserDemote(user['sub'] , dto.roomName , dto.dmotedUserId);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                    else
                    {
                        
                        if(rtn.ifUserInroom.usersType[0].userType === 'OWNER') // if current user is  owner in this case can set admins
                        { 
                            const result = await this.roomService.changeToUser(rtn.roomInfos.id, dto.dmotedUserId);
                            
                            await this.emmiteEventesToUsers(socket, rtn.roomInfos.id , "onDemote",{ roomId : rtn.roomInfos ,  domotedAdmin: result.updatesUserType });
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

                    const rtn = await this.gatewayService.checkUpdateRoom(user['sub'] , dto.roomName);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }

                     
                    if(!await this.utils.getRoomIdByName(dto.newName))
                    {
                        const oldRoomName = dto.roomName;
                        const newRoomName = await this.roomService.updateRoomName(rtn.room.id, dto.newName);

                        await this.emmiteEventesToUsers(socket, rtn.room.id,"change-room-name",{ oldRoomName, newRoomName : newRoomName.room_name});

                    }
                    else
                    {
                        console.log('name of room aleredy exist');
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

                    const rtn = await this.gatewayService.checkUpdateRoom(user['sub'] , dto.roomName);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }

                    if(rtn.room.roomType === 'PROTECTED')
                    {
                        await this.roomService.changePasswordOfProtectedRoom(rtn.room.id, encodePasswd(dto.newPassword));
                        await this.emmiteEventesToUsers(socket, rtn.room.id,"change-room-password",{ roomName : rtn.room.room_name , password : "exist"});

                    }
                    else
                    {
                        console.log('room is not PROTECTED')
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




        @SubscribeMessage('delete-room-password') 
        @UsePipes(new ValidationPipe()) 
        async dleteRoomPassword(@MessageBody() dto:RemoveRoomPassword , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it

                    const rtn = await this.gatewayService.checkUpdateRoom(user['sub'] , dto.roomName);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }

                    if(rtn.room.roomType === 'PROTECTED')
                    {
                        await this.roomService.deleteRoomPassword(rtn.room.id);
                        await this.emmiteEventesToUsers(socket, rtn.room.id,"change-room-password",{ roomName : rtn.room.room_name , password : null});

                    }
                    else
                    {
                        console.log('room is not protected .')
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



        @SubscribeMessage('make-room-protected') 
        @UsePipes(new ValidationPipe()) 
        async makeRoomProtected(@MessageBody() dto:MakeRoomProtected , @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it

                    const rtn = await this.gatewayService.checkUpdateRoom(user['sub'] , dto.roomName);
                    
                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }

                    if(rtn.room.roomType !== 'PROTECTED')
                    {
                        if(dto.newPassword.length > 8)
                        {
                            await this.roomService.updateRoomToProtected(rtn.room.id ,dto.newPassword);
                            await this.emmiteEventesToUsers(socket, rtn.room.id,"change-room-password",{ roomName : rtn.room.room_name , password : 'new'});

                        }
                        else
                        {
                            console.log("error password should be strong.")
                        }
                    }
                    else
                    {
                        console.log('room is aleredy protected .')
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

        /* direct messages */

        /*
            - when search for user to send to it  msg:
                if both user in same room , send message , else create room , and send message
        */

        @SubscribeMessage('start-dm') 
        @UsePipes(new ValidationPipe()) // need room id ,   user id who want to send it.
        async directMessages(@MessageBody() dto:DirectMessages , @ConnectedSocket() socket: Socket) 
        {
            try // before start dm check if are blocked or not 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user  = await this.utils.verifyToken(token); // // if has error will catch it
                    // createDualRoom

                    const rtn = await this.gatewayService.checkDirectMessages(user['sub'] , dto.reciverUserId);

                    if(rtn.error)
                    {
                        console.log(rtn.error)
                        return ;
                    }
                    
                    await this.emmiteEventesToUsers(socket, rtn.newDmRoom.id,"new-room" , {room : rtn.newDmRoom   , usersInfos: rtn.existingUser} );
        
                }
            }
            catch (error) 
            {
                console.log(error)
            } 
        }

    @SubscribeMessage('delete-msg') 
    @UsePipes(new ValidationPipe()) // need room id ,   user id who want to send it.
    async deleteMsg(@MessageBody() dto:deleteMsg , @ConnectedSocket() socket: Socket) {
        console.log(dto)
        try {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) {
                const user  = await this.utils.verifyToken(token); // // if has error will catch it   
                const rtn = await this.gatewayService.checkSendMessage( user['sub'] , dto.roomId);
                if (rtn.error) {
                    console.log(rtn.error)
                    return ;
                }
                
            } else
                console.log("invalid jwt")
        } catch (error) {
            console.log(error)
        }
    }

    @SubscribeMessage('user-block') 
    @UsePipes(new ValidationPipe())     
    async block(@MessageBody()  dto:Block,  @ConnectedSocket() socket: Socket)
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const user = await this.utils.verifyToken(token)
                
                const rtn = await this.checkBlockUser(user['sub']  , dto.blockedUserId);
                
                if(rtn.error)
                {
                    console.log(rtn.error);
                    return
                }

                const blockedUser = await this.roomService.blockUser(user['sub'] , dto.blockedUserId);


                for (let i = 0; i < this.soketsId.length; i++) 
                {
                    if(this.soketsId[i].userId === user['sub'])
                    {
                        this.server.to(this.soketsId[i].socketIds).emit("blocked-user" , {blockedUser});
                    } 
                }
                
                // emmit blocked user


                // console.log(await this.roomService.isBlocked(dto.blockedUserId , user['sub'] ));
                // await this.roomService.unblockUser( user['sub'] , dto.blockedUserId );
                // console.log(await this.roomService.isBlocked(dto.blockedUserId , user['sub'] ));
            }
            else
            {
                console.log('invalid jwt.')
            }
     
        }
        catch(error)
        {
            console.log(error)
        }
    }



    @SubscribeMessage('unblock') 
    @UsePipes(new ValidationPipe())     
    async unBlock(@MessageBody()  dto:UnBlock,  @ConnectedSocket() socket: Socket)
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);

            if (token) 
            {
                const user = await this.utils.verifyToken(token)
                
                const rtn = await this.checkUnBlockUser(user['sub']  , dto.unBlockedUserId);
                
                if(rtn.error)
                {
                    console.log(rtn.error);
                    return
                }
                if((await this.roomService.isBlocked(dto.unBlockedUserId , user['sub'] )).blockedBy.length > 0)
                {
                    const unblockedUser = await this.roomService.unblockUser(user['sub'], dto.unBlockedUserId);
    
                    for (let i = 0; i < this.soketsId.length; i++) 
                    {
                        if(this.soketsId[i].userId === user['sub'])
                        {
                            this.server.to(this.soketsId[i].socketIds).emit("unblocked-user" , {unblockedUser});
                        } 
                    }
                    
                }
                else
                {
                    console.log("user is unblocked")
                }
                // emmit blocked user


                // console.log(await this.roomService.isBlocked(dto.blockedUserId , user['sub'] ));
                // await this.roomService.unblockUser( user['sub'] , dto.blockedUserId );
                // console.log(await this.roomService.isBlocked(dto.blockedUserId , user['sub'] ));
            }
            else
            {
                console.log('invalid jwt.')
            }
     
        }
        catch(error)
        {
            console.log(error)
        }
    }
        async checkBlockUser(currentUserId :string , blockedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , blockedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : existingUser.error};
            } 
         
            if((await this.roomService.isBlocked(currentUserId , blockedUserId )).blockedBy.length > 0)
                return {error : 'user aleredy blocked.'}
            if((await this.roomService.isBlocked(blockedUserId , currentUserId )).blockedBy.length > 0)
                return {error : 'user aleredy blocked.'}
            return {ok : 'ok'}
        }
        

        async checkUnBlockUser(currentUserId :string , unBlockedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , unBlockedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : existingUser.error};
            } 
            return {ok : 'ok'}
        }

        @SubscribeMessage('get-users') // gha 7iyd hadi a sat
        async getAllusers( @ConnectedSocket() socket: Socket) 
        {
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    await this.utils.verifyToken(token); // // if has error will catch it
                    
                    this.server.to(socket.id).emit("all-users", {allUsers: await this.utils.getAllUsers()}); 
                }
            }
            catch (error) 
            {
                console.log(error)
            } 
        }
        
        
        
        /*-------------------------------------------------on connect use this utils function--------------------------------------------------------- */
        
        async checkOnConnect(@ConnectedSocket() socket: Socket , currentUserId :string)
        {
            // on connect send all blocked users by this user
            // and blocker and blocked
            const existingUser = await this.utils.getUserId([currentUserId]); // if current user in db
            
            if(existingUser.error)
            {
                return {error : existingUser.error};
            } 
            
            this.soketsId.push({userId : existingUser.existingUser[0], socketIds:socket.id})
            
            
            const rooms = await this.utils.getRoomsForUser(existingUser.existingUser[0]); // all rooms who this user is member into it
            
            
            let messages:any[] = [];
            
            socket['userId'] = currentUserId;
            for(let i = 0; i < rooms.length; i++)
            {
                messages.push({msg : await this.messagesService.getAllMessagesofRoom(rooms[i].room.id ,currentUserId ) , room : rooms[i] , usersInRoom: await this.utils.getUserInfosInRoom(rooms[i].roomId)})
            }
            
            // console.log(await this.roomService.allUsersWhoBlockMe(currentUserId))
            const allUsersBlockedByMe =   (await this.roomService.allUsersBlockedByMe(currentUserId)).blockedUsers;

            this.server.to(socket.id).emit("all-blocked-users", {allUsersBlockedByMe}); 
            
            this.server.to(socket.id).emit("all-users", {allUsers: await this.utils.getAllUsers()}); 
            // emmit all users infos
            return {ok : 'connected from chat'}
            
        }
        
        @SubscribeMessage('get-rooms')
        async getAllRooms(@ConnectedSocket() socket: Socket) 
        {   
            try 
            {
                const token = this.utils.verifyJwtFromHeader(socket.handshake.headers.authorization);
                
                if (token) 
                {
                    const user = await this.utils.verifyToken(token); // // if has error will catch it
                    
                    const userId = await this.utils.getUserId([user['sub']]); // if current user in db
                    if(userId.error)
                    {
                        console.log(userId.error)
                        return;
                    }

                    const rooms = await this.utils.getRoomsForUser(user['sub']); // all rooms who this user is member into it
            
             
                    let messages:any[] = [];
                     
                    for(let i = 0; i < rooms.length; i++)
                    {
                        messages.push({msg : await this.messagesService.getAllMessagesofRoom(rooms[i].room.id ,user['sub'] ) , room : rooms[i] , usersInRoom: await this.utils.getUserInfosInRoom(rooms[i].roomId)})
                    }
                    
                    this.server.to(socket.id).emit("list-rooms",{messages});  //  evry client will connected will display the rooms who is member into 
                }
            }
            catch (error) 
            {
                console.log(error)
            } 
            
        }

        async emmiteEventesToUsers(@ConnectedSocket() socket: Socket , roomId : string , event : string , data : object , removedUser ?: any)
        {
            const usersInroom = await this.utils.getUsersInRooms(roomId);
            
            if(removedUser)
            {
                usersInroom.push(removedUser)
            }

            for(const userInRoom of usersInroom)
            {
                                
                for (let i = 0; i < this.soketsId.length; i++) 
                {

                    if(this.soketsId[i].userId === userInRoom.userId)
                    {
                        this.server.to(this.soketsId[i].socketIds).emit(event , data);
                    } 
                }

            }   

        }


        OnWebSocektError(socket:Socket)
        { 
    
            // socket.emit("error", new UnauthorizedException());
            socket.disconnect();
        }


        async handleDisconnect(socket: Socket) 
        {
            console.log("disconnected from chat");    
            // for (let i = 0; i < this.soketsId.length; i++) 
            // {
            //     if(this.soketsId[i].socketIds === socket.id)
            //     {
            //         this.soketsId = this.soketsId.splice(i, i + 1);
            //         break;
            //     }
            // } 
            this.OnWebSocektError(socket);
        }

   
    
}