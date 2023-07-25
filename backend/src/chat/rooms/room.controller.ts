/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from './rooms.service';
import { ConnectedUsersService } from '../connected-users/connected-users.service';
import { WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from  'socket.io';
import { UtilsService } from 'src/utils/utils.service';
import { JoinRoomDto } from 'src/dto/join-room.dto';
import { MessagesService } from '../messages/messages.service';


   
@Controller('rooms')
export class RoomController {

    @WebSocketServer()
    server:Server;

    socket:Socket;
 
	
    constructor(private readonly jwtService:JwtService, 
        private readonly roomService:RoomsService,
        private readonly utils:UtilsService,
        private readonly messagesService:MessagesService
        ) {}

    @Post()
    async createRoom(@Body() dto:CreateUserDto, @Res() res:any)
    {
        // mybe need the socket id
        const isPublic = true;

        const idOfuser =   this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
       
    
        const ifUsersExist = await this.utils.getUsersId(idOfuser['sub'],dto.users)

        if(ifUsersExist === "you try to enter the admin")
        {
            console.log("you try to enter the admin")
            return ;
        }
        if(ifUsersExist) // if room name is not empty and users  exist
        {
            // make it in creating set room status and user staus
            const room = await this.roomService.createRoom({roomName: dto.roomName, users: dto.users}, idOfuser['sub'],"PUBLIC");

            
            //  await this.utils.getRoomsForUser(idOfuser['sub']); to get user and room role
        }
        else
        {
            console.log("user not found")
        }
        return res.send("ok")
    }
   
    @Post('/join-room') 
    async onJoinedRoom(@Body() dto:any, @Res() res:any)
    {
          
        // // check the user
        const idOfuser =   this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET });
        const roomId = await this.utils.getRoomIdByName(dto.roomName);

      
        if(idOfuser && roomId)
        {
            const messageAndUserName = await this.messagesService.getAllMessagesofRoom(dto.roomName); // should return messages and username who send message
             
            await this.messagesService.linkUsersWithSocketIdAndRooms(idOfuser['sub'],dto.socketId,roomId); // link user with socket id and room
            
            return res.status(200).send({ message: messageAndUserName });
        }
        else
        {
            // errr
        }
     }

    async setUsersRoles()
    {
        // this.roomService.setUsersRoles(room, "PROTECTED", {asalek:"ADMIN",tnamir: "ADMIN"})

    }
    

    async leaveRoom()
    {

    }

	
}
