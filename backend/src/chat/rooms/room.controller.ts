/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
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

    @Post()
    async createRoom(@Body() dto:createRoom, @Res() res:any) // when work with erroe in dto by default return object response error
    { 
        // conflict between private and public
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET }) // who send the request
            
            if(!await this.utils.getUserId(user['sub'])) // search for it in db
            {
                return res.status(404).send('user not found.')
            }

            const usersIds = await this.utils.getUsersId(user['sub'],dto.users, 1) // return the users id of the users want to add to chat room
            
            if(usersIds === 0)
            {
                return res.status(406).send("this current user is aleredy in this room.")// to avoid enter one user and can the current user
            }
            if(usersIds) // if found the users id
            { 
                if (dto.type === RoomType.PRIVATE || dto.type === RoomType.PROTECTED || dto.type === RoomType.PUBLIC) 
                {
                    if (dto.type === "PROTECTED") 
                    {
                        const room = await this.roomService.createRoom({roomName: dto.roomName, users: usersIds}, user['sub'], "PROTECTED", dto.password);
    
                        if(room === 1)
                        {
                            return res.status(406).send("room name aleredy exist.");
                        }
                        if(room === 0)
                        {
                            return res.status(406).send("should set password for this protected room.");
                        }

                        res.status(200).send({room  , usersInRoom: await this.utils.getUsersInRooms(room['id']) , userInfos: await this.utils.getUserInfosInRoom(room['id'])});
                        
                    }
                    else
                    { 
                        const room = await this.roomService.createRoom({roomName: dto.roomName, users: usersIds}, user['sub'], dto.type);
    
                        if(room === 1)
                        {
                            return res.status(406).send("room name aleredy exist.");
                        }
 
                        res.status(200).send({room  , usersInRoom: await this.utils.getUsersInRooms(room['id']) , userInfos: await this.utils.getUserInfosInRoom(room['id'])});
                    }
                }
                else
                {
                    return res.status(406).send("error in type of room.")
                }
            }   
            else
            {
                return res.status(404).send('one or multi users not found.')
            }
        } 
        catch (error) 
        {
            return res.status(500).json({ error: error.message });
        }
    }
   
    
    @Post('/select-room') // use here JoinRoomDto
    async onJoinedRoom(@Body() dto:any, @Res() res:any) 
    {
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET });

            if(!await this.utils.getUserId(user['sub']))
            {
                return res.status(404).send('user not found.');
            }
            
            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            
            if (roomId) // if room is founding check if current user is member into it and it not banned
            {
                const isUserInRoom = await this.utils.getUserType(roomId,user['sub']);

                if(!isUserInRoom)
                {
                    return res.status(404).send('user is not in this room.');
                }

                if(isUserInRoom.isBanned)
                {
                    return res.status(401).send('you are banned from this room.')
                }
                 
                const messageAndUserName = await this.messagesService.getAllMessagesofRoom(dto.roomName);
                            
                return res.status(200).send({ msg: messageAndUserName });
            }
            else
            {
                return res.status(404).send('room not found.');
            }
        } 
        catch (error) 
        {
            return res.status(500).json({ error: error.message });
        }
    }

     

     @Post('/kick')
    async kick(@Body() dto:any, @Res() res:any)
    {
        // validatin of the current user  
        // validation of current room
        // if current user is admin or owner
        // if user who want to kick them is a user kick them 
        // else cannot kick them
        
            try 
            { 
                const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
    
                if(!await this.utils.getUserId(user['sub'])) //if jwt expired
                    return res.status(404).send('user not found.')

                const roomId = await this.utils.getRoomByName(dto.roomNAme);
                
                if(roomId)
                {
                     
                    const isUserInRoom = await this.utils.getUserType(roomId.id, user['sub']);

                    if(!isUserInRoom)
                    {
                        return res.status(404).send('user is not in this room.');
                    }

                    if(await this.roomService.doesRoomHaveUsers(roomId.id))
                    {

                        const userInfos = await this.utils.checkKickedUser(user['sub'], dto.kickedUser , roomId.id);
    
                        // console.log(userInfos) // pass same user for kicking
                    }
                    
                }
                else
                {
                    console.log('room not found')
                    return;
                }
            } 
            catch (error) 
            {
                console.log('from kick()')
                console.log(error)    
            }
    }
    

}
