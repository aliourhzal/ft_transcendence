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
import { comparePasswd } from 'src/utils/bcrypt';


   
@Controller('rooms')
export class RoomController {

	
    constructor(private readonly jwtService:JwtService, 
        private readonly roomService:RoomsService,
        private readonly utils:UtilsService,
        private readonly messagesService:MessagesService,
        private readonly usersServise:UsersService
        ) {}

    @Post()
    async createRoom(@Body() dto:createRoom, @Res() res:any)
    { 
        // conflict between private and public
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
            
            const usersIds = await this.utils.getUsersId(user['sub'],dto.users, 1)
            
            if(usersIds === 0)
            {
                console.log("you are the admin")
                return;
            }
            
            if(usersIds)
            { 
                if (dto.type === RoomType.PRIVATE || dto.type === RoomType.PROTECTED || dto.type === RoomType.PUBLIC) 
                {
                    if (dto.type === "PROTECTED") 
                    {
                        const room = await this.roomService.createRoom({roomName: dto.roomName, users: usersIds}, user['sub'], "PROTECTED", dto.password);
    
                        if(room === 1)
                        {
                            console.log("room name aleredy exist.");
                            return ;
                        }
                        console.log(await this.utils.getRoomsForUser(user['sub']))
                        res.status(200).send({ message: await this.utils.getRoomsForUser(user['sub']) });
                        
                    }
                    else
                    {
                        const room = await this.roomService.createRoom({roomName: dto.roomName, users: usersIds}, user['sub'], dto.type);
    
                        if(room === 1)
                        {
                            console.log("room name aleredy exist.");
                            return ;
                        }
                        console.log(await this.utils.getRoomsForUser(user['sub']))
                        res.status(200).send({ message: await this.utils.getRoomsForUser(user['sub']) });
                    }
                }
                else
                {
                    console.log("error in type of room.")
                }
            }   
            else
            {
                console.log("users not found")
                return ;
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }
   
    @Post('/select-room') // use here JoinRoomDto
    async onJoinedRoom(@Body() dto:JoinRoomDto, @Res() res:any) 
    {
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            
            if (roomId) 
            {
                const roomType = await this.utils.getRoomById(roomId);
                if (roomType) 
                {
                    
                    const messageAndUserName = await this.messagesService.getAllMessagesofRoom(dto.roomName); // should return messages and username who send message
            
                    await this.messagesService.linkUsersWithSocketIdAndRooms(user['sub'],dto.socket,roomId); // link user with socket id and room
                    
                    return res.status(200).send({ message: messageAndUserName });
                }
                else
                {
                    console.log("room not found")
                    return ;
                }
            }
            else
            {
                console.log('room not found.');
            }

        } 
        catch (error) 
        {
            console.log(error)
        }
    }

    @Post('/setOtherAasAdministrators') // use dto
    async setOtherAasAdministrators(@Body() dto:any, @Res() res:any)
    {
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            const usersIds = await this.utils.getUsersId(user['sub'],dto.users)
           
           
            if(roomId && usersIds)
            {
                const userType = await this.utils.getUserType(roomId,user['sub']);
                if (userType.userType === "ADMIN" || userType.userType === "OWNER") 
                {
                    const newAdmins = await this.roomService.setNewAdmins(roomId, usersIds, user['sub']);
                    
                    if (newAdmins === 0) 
                    {
                        console.log("you try to enter the admin")
                        return;    
                    }

                    if (newAdmins === 1) 
                    {
                        console.log("The specified user is not linked to the room.");
                        return ;
                    }
                }
                else
                {
                    console.log('dont have the perrmission')
                    return ;
                }
            }
            else
            {
                console.log("room or users not found");
            }
        } 
        catch (error) 
        {
            console.log(error)    
        }
    }

    @Post('/changeTypeToUsers') // use dto
    async changeTypeToUsers(@Body() dto:any, @Res() res:any)
    {
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            
            const usersIds = await this.utils.getUsersId(user['sub'],dto.users)
           
           
            if(roomId && usersIds)
            {
                const userType = await this.utils.getUserType(roomId,user['sub']);
                if (userType.userType === "OWNER") 
                {
                    const changeToUsers = await this.roomService.changeToUsers(roomId, usersIds, user['sub']);
                     
                    if (changeToUsers === 0) 
                    {
                        console.log("you try to enter the admin")
                        return;    
                    }
                    if (changeToUsers === 1) 
                    {
                        console.log("The specified user is not linked to the room.");
                        return ;
                    }
                }
                else
                {
                    console.log("dont have the permission")
                }
            }
            else
            {
                console.log("room or users not found");
            }
        } 
        catch (error) 
        {
            console.log(error)    
        }
    }

    @Post('/change-room-Type') // use dto
    async updateRoom(@Body() dto:any, @Res() res:any)
    {
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            
            if(roomId)
            {
                const userType = await this.utils.getUserType(roomId,user['sub']);
                
                 if(userType)
                {
                    if (userType.userType === 'ADMIN' || userType.userType === 'OWNER') 
                    {
                        
                        if(dto.type === RoomType.PRIVATE || dto.type === RoomType.PROTECTED || dto.type === RoomType.PUBLIC)
                        {
                            const roomType = await this.utils.getRoomById(roomId);
                            
                            if(roomType.roomType !== dto.type)
                            {
                                if(dto.type === 'PROTECTED')
                                {
                                     
                                    if(await this.roomService.updateRoom(dto.type,roomId, dto.password) === 0)
                                    {
                                        console.log("should set password for this protected room");
                                        return ;
                                    }

                                }
                                else
                                    await this.roomService.updateRoom(dto.type,roomId);
                            }
                            else
                            {
                                console.log("you enter the same Type of the room.")
                            }
                        }
                        else
                        {
                            console.log("room Type you entered is not found.")
                        }
                        
                    }
                    else
                    {
                        console.log("cannot have the permission to change room Type.")
                    }
                }
            }
            else
            {
                console.log("room  not found");
            }
        } 
        catch (error) 
        {
            console.log(error)    
        }

    }

    @Post('/join-room')
    async joinRoom(@Body() dto:any, @Res() res:any) // test join room by script & test to join the public room
    {
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
            
            const roomId = await this.utils.getRoomIdByName(dto.name);

            if(roomId)
            {
                const usersInRoom = await this.utils.getUsersInRooms(roomId);

                const find = usersInRoom.find((item) => item.userId === user['sub']);

                if(!find)
                {
                    const roomType = await this.utils.getRoomById(roomId);

                    if(roomType.roomType === 'PROTECTED')
                    {
                        if(comparePasswd(dto.pass,roomType.password) )
                        {
                            if(await this.roomService.linkBetweenUsersAndRooms(roomId, user['sub']) === 4)
                            {
                                console.log('user is aleredy exist in the chat room.')
                                return;
                            }
                        }
                        else
                        {
                            console.log("password inccorect.")
                            return;
                        }
                    }
                    else if(roomType.roomType === 'PUBLIC')
                    {
                        if(await this.roomService.linkBetweenUsersAndRooms(roomId, user['sub']) === 4)
                        {
                            console.log('user is aleredy exist in the chat room.')
                            return;
                        }
                    }
                }
                else
                {
                    console.log("you are aleredy joined to this room")
                    return ;
                }
            }
            else
            {
                console.log("room  not found");
            }
        } 
        catch (error) 
        {
            console.log("from catch")
            console.log(error)    
        }
    }


    async leaveRoom()
    {

    }

	
}
