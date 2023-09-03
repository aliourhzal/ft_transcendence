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
import { Block } from 'src/dto/block.dto';


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

                    const roomId = await this.utils.getRoomById(dto.roomId);
                
                    
                    if (roomId) // if room is founding check if current user is member into it and it not banned
                    {
                        const isUserInRoom = await this.utils.getUserType(roomId,[user['sub']]);

                        if(isUserInRoom.error)
                            return res.status(404).send(isUserInRoom.error);
                        
                        const messageAndUserName = await this.messagesService.getAllMessagesofRoom(dto.roomId);
                        
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
    
     
    @Post('/')
    async block(@Req() request: Request , @Body() dto:Block, @Res() res:any)
    {
        const roomId = "test";
 
        try 
        {
            const token = this.utils.verifyJwtFromHeader(request.headers['authorization']);

            if (token) 
            {
                const user = await this.utils.verifyToken(token)
              
                 const rtn = await this.checkBlockUser(user['sub'] , roomId , dto.blockedUserId);
                
                if(rtn.error)
                {
                    console.log(rtn.error);
                    return
                }

                await this.roomService.blockUser(user['sub'] , dto.blockedUserId);
                console.log(await this.roomService.isBlocked(dto.blockedUserId , user['sub'] ));
                await this.roomService.unblockUser( user['sub'] , dto.blockedUserId );
                console.log(await this.roomService.isBlocked(dto.blockedUserId , user['sub'] ));
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

        async checkBlockUser(currentUserId :string , roomName  : string, blockedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , blockedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , blockedUserId ]); // if both users in this room
                
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

}
