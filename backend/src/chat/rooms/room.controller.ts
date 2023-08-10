/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from './rooms.service';

import { UtilsService } from 'src/utils/utils.service';
import { JoinRoomDto } from 'src/dto/join-room.dto';
import { MessagesService } from '../messages/messages.service';
import { RoomType } from 'src/utils/userData.interface';
import { createRoom } from 'src/dto';
import { comparePasswd, encodePasswd } from 'src/utils/bcrypt';
import { SetOtherAasAdministrators } from 'src/dto/setOtherAasAdministrators.dto';
import { SelectRoom } from 'src/dto/select-room.dto';
import { BanUser } from 'src/dto/banUser.dto';
import { Socket } from 'socket.io-client';
import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

/**
 *  in try and catch if any function return null will catch as error
 * 
 * 
 */
   
@Controller('rooms')
export class RoomController {

	
    constructor(private readonly jwtService:JwtService, 
        private readonly roomService:RoomsService,
        private readonly utils:UtilsService,
        private readonly messagesService:MessagesService,
        private readonly usersServise:UsersService
        ) {}
 
        
   
   
    @Post('/select-room') // use here JoinRoomDto
    async onJoinedRoom(@Req() request: Request , @Body() dto:SelectRoom, @Res() res:any) 
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(request.headers['authorization']);

            if (token) 
            {
                const user = await this.utils.verifyToken(token)
              
                if (user) 
                {
                    const ifUserExist = await this.utils.getUserId([user['sub']]);
                    
                    if(ifUserExist.error)
                        return res.status(404).send(ifUserExist.error);

                    const roomId = await this.utils.getRoomIdByName(dto.roomName);
                
                    
                    if (roomId) // if room is founding check if current user is member into it and it not banned
                    {
                        const isUserInRoom = await this.utils.getUserType(roomId,[user['sub']]);

                        if(isUserInRoom.error)
                            return res.status(404).send(isUserInRoom.error);
                    
                        // if(isUserInRoom.usersType[1].isBanned)
                        // {
                        //     return res.status(404).send('you are banned.');
                        // }
                        
                        
                        const messageAndUserName = await this.messagesService.getAllMessagesofRoom(dto.roomName);
                        return res.status(200).send({ msg: messageAndUserName });
                    }
                    else
                    {
                        return res.status(404).send('room not found.');
                    }
                }
            }
            else
            {
                return res.status(404).send('invalid jwt.')
            }
     
        }
        catch(error)
        {
            return res.status(500).json({ error: error.message });
        }
    }
    
    // test admin ban user
    // test admin ban owner
    // test admin ban admin
    // test user ban admin
    // test user ban owner
    // test user ban user
    // 
    @Post('/banFromRoom')  // ban  for limmited time and admin can ban or kick any other user or admin exept owner
	async banFromRoom(@Req() request: Request , @Body() dto:BanUser, @Res() res:any)
    {
        try 
        {
            const token = this.utils.verifyJwtFromHeader(request.headers['authorization']);

            if (token) 
            {
                const user = await this.utils.verifyToken(token)
              
                if (user) 
                {
                    const existingUsers = await this.utils.getUserId([user['sub'] , dto.bannedUserId]); //// if both users is is exist
        
                    if(existingUsers.error)
                        return res.status(404).send(existingUsers.error);
        
                    const roomId = await this.utils.getRoomIdByName(dto.roomName);
        
                    if(roomId) // test ban addmin
                    {
                        // here check if the both users in this room and cannot ban same user
                        const usersType = await this.utils.getUserType(roomId,existingUsers.existingUser);
           
                        if(usersType.error)
                            return res.status(404).send(usersType.error);
                        
                        if(usersType.usersType[1].isBanned)
                        {
                            return res.status(404).send('you are banned.');
                        }
                        // if current user is an admin or owner in this case can ban
                        // and if user who want to ban is an user in this case can ban
                        if(usersType.usersType[0].userType !== 'USER' && usersType.usersType[1].userType === 'USER')
                        {
                            if(!usersType.usersType[1].isBanned) // if 
                            {
                                await this.utils.removeUserFromRoom(usersType.usersType[1].userId, roomId); // delete allmessages of this user but still in the db

                                return res.status(200).send('user is banned succssufully.');
                            }
                            return res.status(404).send('user is aleredy banned.');
                        }
                        return res.status(404).send('dont have the permission to ban ');
                    }
                    return res.status(404).send('room not found.');
                }
            } 
            else
            {
                return res.status(404).send('invalid jwt.')
            }   
        } 
        catch (error) 
        {
            console.log('from banFromRoom()')
            return res.status(500).json({ error: error.message });
        }
    }
    
    // @Post('/setOtherAasAdministrators') // use dto
    // async setOtherAasAdministrators(@Req() request: Request , @Body() dto:SetOtherAasAdministrators, @Res() res:any)
    // {
    //     try 
    //     {
    //         const token = this.utils.verifyJwtFromHeader(request.headers['authorization']);

    //         if (token) 
    //         {
    //             const user = await this.utils.verifyToken(token)
              
    //             if (user) 
    //             {
    //                 const existingUsers = await this.utils.getUserId([user['sub'] , dto.newAdminId]); // if both users is is exist
        
    //                 if(existingUsers.error)
    //                     return res.status(404).send(existingUsers.error);
        
    //                 const roomId = await this.utils.getRoomIdByName(dto.roomName);
        
    //                 if(roomId)  
    //                 {
    //                     // here check if the both users in this room and cannot set same user as admin
    //                     const usersType = await this.utils.getUserType(roomId,existingUsers.existingUser);
                        
    //                     if(usersType.error)
    //                         return res.status(404).send(usersType.error);
                        
    //                     if(usersType.usersType[1].isBanned)
    //                     {
    //                         return res.status(404).send('you are banned.');
    //                     }
                        
    //                     if(usersType.usersType[0].userType !== 'USER') // if current user is admin or owner in this case can set admins
    //                     { 
    //                         // here before set admin check if it is aleredy admin or an  user
    //                         const rtn = await this.roomService.setNewAdmins(roomId, usersType.usersType[1]);

    //                         if(rtn.error)
    //                             return res.status(404).send(rtn.error);

    //                         return res.status(200).send(rtn.ok);
    //                     }

    //                     return res.status(404).send('dont have the permission to set an admin.');
    //                 }
    //                 return res.status(404).send('room not found.');
    //             }
    //         }    
    //         else
    //         {
    //             return res.status(404).send('invalid jwt.')
    //         }
    //     } 
    //     catch (error) 
    //     {
    //         console.log('from set()')
    //         return res.status(500).json({ error: error.message });
    //     }

    // }

}
