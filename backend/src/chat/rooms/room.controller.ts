/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from './rooms.service';
import { WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from  'socket.io';
import { UtilsService } from 'src/utils/utils.service';
import { JoinRoomDto } from 'src/dto/join-room.dto';
import { MessagesService } from '../messages/messages.service';
import { AuthGuard } from '@nestjs/passport';
import { RoomType } from 'src/utils/userData.interface';


   
@Controller('rooms')
export class RoomController {

	
    constructor(private readonly jwtService:JwtService, 
        private readonly roomService:RoomsService,
        private readonly utils:UtilsService,
        private readonly messagesService:MessagesService,
        private readonly usersServise:UsersService
        ) {}

    @Post()
    async createRoom(@Body() dto:any, @Res() res:any)
    {

        const idOfuser =   this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
        
        if(!idOfuser)
        {
            console.log("user not found");
            return 
        }
    
        const ifUsersExist = await this.utils.getUsersId(idOfuser['sub'],dto.users)

        if(ifUsersExist === "you try to enter the admin")
        {
            console.log("you try to enter the admin")
            return ;
        }
        if(ifUsersExist) // if room name is not empty and users  exist
        {
            // check the type of the room if public or protected | the type when send it without private and withou password it send private in type
            const room = await this.roomService.createRoom({roomName: dto.roomName, users: dto.users}, idOfuser['sub'],"PROTECTED", "1234");
            
            res.status(200).send({ message: await this.utils.getRoomsForUser(idOfuser['sub']) });
        }
        else
        {
            console.log("user not found")
            return res.status(404)
        }
    }
   
    @Post('/join-room') // use here JoinRoomDto
    async onJoinedRoom(@Body() dto:JoinRoomDto, @Res() res:any) // if it is protected should enter the password
    {
          
       
        const idOfuser =   this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET });
        const roomId = await this.utils.getRoomIdByName(dto.roomName);

      
        if(idOfuser && roomId)
        {
            const messageAndUserName = await this.messagesService.getAllMessagesofRoom(dto.roomName); // should return messages and username who send message
             
            await this.messagesService.linkUsersWithSocketIdAndRooms(idOfuser['sub'],dto.socket,roomId); // link user with socket id and room
            
            return res.status(200).send({ message: messageAndUserName });
        }
        else
        {
            console.log("error")
        }  
    }

    @Post('/setOtherAasAdministrators') // use dto
    async setOtherAasAdministrators(@Body() body:any, @Res() res:any)
    {
        const idOfuser =   this.jwtService.verify(body.auth,{ secret: process.env.JWT_SECRET });
        
        if(!idOfuser)
        {
            console.log("user not found");
            return 
        }
    
        const usersId = await this.utils.getUsersId(idOfuser['sub'],body.users);
      
        const roomId = await this.utils.getRoomIdByName(body.roomName);

        if (usersId && roomId) 
        {
            const userType = await this.utils.getRoomsForUser(idOfuser['sub']);

            if (userType[0].userType === "ADMIN" || userType[0].userType === "OWNER") 
            {
                if(await this.roomService.setNewAdmins(roomId, usersId, idOfuser['sub']) === 0) 
                {
                    console.log("you try to change the Type of the owner.");
                    return ;
                }
            }
            else
            {
                console.log("IS A USER, cannot have permission to change to admin.")
            }
             
        }
        else
        {
            console.log("user not found Or roomm not found")
            return res.Type(404).send({ message: "user not found Or roomm not found" });
        }
    }

    @Post('/changeTypeToUsers') // use dto
    async changeTypeToUsers(@Body() body:any, @Res() res:any)
    {
        const idOfuser =   this.jwtService.verify(body.auth,{ secret: process.env.JWT_SECRET });
        
        if(!idOfuser)
        {
            console.log("user not found");
            return 
        }
    
        const usersId = await this.utils.getUsersId(idOfuser['sub'],body.users);
      
        const roomId = await this.utils.getRoomIdByName(body.roomName);

        if (usersId && roomId) 
        { // can be error handle it like changeRoomType
            const userType = await this.utils.getRoomsForUser(idOfuser['sub']);

            if (userType[0].userType === "OWNER") 
            {
                if(await this.roomService.changeToUsers(roomId, usersId, idOfuser['sub']) === 0) 
                {
                    console.log("you try to change the Type of the owner.");
                    return ;
                }
            }
            else
            {
                console.log("IS not hte owner, cannot have permission to change to admin.")
            }
             
        }
        else
        {
            console.log("user not found Or roomm not found")
            return res.Type(404).send({ message: "user not found Or roomm not found" });
        }
    }

    @Post('/change-room-Type') // use dto
    async changeRoomType(@Body() body:any, @Res() res:any)
    {
        const idOfuser =   this.jwtService.verify(body.auth,{ secret: process.env.JWT_SECRET });
        
        if(!idOfuser)
        {
            console.log("user not found");
            return 
        }
     
        const roomId = await this.utils.getRoomIdByName(body.roomName);
 
        if (roomId) 
        {
            const userType = await this.utils.getUserType(roomId, idOfuser['sub']); // 
            if(userType)
            {
                if (userType.userType === 'ADMIN' || userType.userType === 'OWNER') 
                {
                    
                    if(body.roomStatus === RoomType.PRIVATE || body.roomStatus === RoomType.PROTECTED || body.roomStatus === RoomType.PUBLIC)
                    {
                        const roomType = await this.utils.getRoomById(roomId);

                        if(roomType.roomType !== body.roomType)
                        {
                            if(body.roomType === 'PROTECTED')
                                await this.roomService.changeRoomType(body.roomType,roomId, "1234");
                            else
                                await this.roomService.changeRoomType(body.roomType,roomId);
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
            console.log("roomm not found")
            return res.status(404).send({ message: "roomm not found" });
        }

    }

    async leaveRoom()
    {

    }

	
}
