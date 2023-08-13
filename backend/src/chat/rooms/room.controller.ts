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
 
        
    
   
    @Post('/select-room') // use here JoinRoomDto use socket
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
    
    // @Post('/addNewUsersToRoom')
    // async addNewUsersToRoom(@Body() dto:any, @Res() res:any)
    // {
    //     try 
    //     { // if error in jwt
    //         const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

    //         if(!await this.utils.getUserId(user['sub'])) //if jwt expired
    //         {
    //             console.log('user not found.')
    //             return;
    //         }

    //         const roomId = await this.utils.getRoomById(dto.idOfRoom);
    //         if(roomId)
    //         {
    //             const userType = await this.utils.getUserType(roomId.id,user['sub']);
    //             if(userType)
    //             {
    //                 if(userType.userType !== 'USER') // test one by one
    //                 {
    //                     const usersIds = await this.utils.getUsersId(user['sub'],dto.users, 1)
                        
    //                     if(usersIds === 0)
    //                     {
    //                         console.log("you try to add the current user")
    //                         return;
    //                     }
                        
    //                     if(usersIds)
    //                     {
    //                         await this.roomService.linkBetweenUsersAndRooms(roomId.id, usersIds);
    //                     }
    //                     else
    //                     {
    //                         console.log('users not found')
    //                         return;
    //                     }
    //                 }
    //                 else
    //                 {
    //                     console.log('dont have the permmission to add users to this room.')
    //                     return ;
    //                 }
    //             }
    //             else
    //             {
    //                 console.log('user is not in this room')

    //             }
    //         }
    //         else
    //         {
    //             console.log('room not found')
    //             return;
    //         }
    //     } 
    //     catch (error) 
    //     {
    //         console.log('from addNewUsersToRoom()')
    //         console.log(error)    
    //     }
    // }

    // @Post('/leaveRoom')
    // async leaveRoom(@Body() dto:any, @Res() res:any)
    // {
    //     try 
    //     { // if error in jwt
    //         const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

    //         if(!await this.utils.getUserId(user['sub'])) //if jwt expired
    //         {
    //             console.log('user not found.')
    //             return;
    //         }

    //         const roomId = await this.utils.getRoomById(dto.idOfRoom);

    //         if(roomId)
    //         {
    //             if(await this.roomService.doesRoomHaveUsers(roomId.id))
    //             {
    //                 const userType = await this.utils.getUserType(roomId.id,user['sub']);
                     
    //                 if(userType)
    //                 {
    //                     if(userType.userType === 'OWNER')
    //                     { 
    //                         await this.roomService.removeUserFromRoom(roomId.id, user['sub']);
        
    //                         let newOwner:any = await this.roomService.getFirstUser('ADMIN') // get first admin if found it
    
    //                         if(!newOwner) // if not found an admin
    //                         {
    //                             newOwner = await this.roomService.getFirstUser('USER') // will search for the first user in the room
        
    //                             await this.roomService.setNewOwner(roomId.id, newOwner.userId) // set first user in the room as owner
                                
    //                             return ;
    //                         }
    //                         await this.roomService.setNewOwner(roomId.id, newOwner.userId) // set this first admin as the owne
    //                     }
    //                     else
    //                     {
    //                         // check here if banned
    //                         await this.roomService.removeUserFromRoom(roomId.id, user['sub']); // if admin or user leave 
    //                     }                 
    //                 }
    //                 else
    //                     console.log('user is not in this room')
    //             }
    //             else
    //             {
    //                 console.log('room dont have users.')
    //             }
    //         }
    //         else
    //         {
    //             console.log('room not found')
    //             return;
    //         }
    //     } 
    //     catch (error) 
    //     {
    //         console.log('from leaveRoom()')
    //         console.log(error)    
    //     }
    // }

}
