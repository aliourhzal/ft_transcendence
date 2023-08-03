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
                console.log('user not found.')
                return;
            }
            
            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            
            if (roomId) // if room is founding check if current user is member into it and it not banned
            {
                const isUserInRoom = await this.utils.getUserType(roomId,user['sub']);
                if(isUserInRoom.isBanned)
                {
                    console.log('you are banned from this room.')
                    return ;
                }
                if(isUserInRoom)
                {
                    const messageAndUserName = await this.messagesService.getAllMessagesofRoom(dto.roomName); // should return messages and username who send message
                                
                    return res.status(200).send({ msg: messageAndUserName });
                }
                else
                {
                    console.log('user not in this room')
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
        { // if error in jwt
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
            
            if(!await this.utils.getUserId(user['sub'])) //if jwt expired
            {
                console.log('user not found.')
                return;
            }
            

            const roomId = await this.utils.getRoomIdByName(dto.roomName);

            const usersIds = await this.utils.getUsersId(user['sub'],dto.users)
        
            if(roomId && usersIds)
            {

                const userType = await this.utils.getUserType(roomId,user['sub']); // this return type of user and check if current user is member into this room
                if(userType)
                {
                    if (userType.userType === "ADMIN" || userType.userType === "OWNER") 
                    {
                        const bannedAndUnBannedUsers = await this.utils.getAllbannedAndUnBannedUsers(user['sub'],dto.users, roomId); 

                        for(const user of bannedAndUnBannedUsers)
                        {
                            if(user.UnbannedUser)
                            {
                                const newAdmins = await this.roomService.setNewAdmins(roomId, user.UnbannedUser, user['sub']);
                                
                                if (newAdmins === 0) 
                                {
                                    console.log("you try to change the owner")
                                    return;    
                                }
                            }
                            else
                            {
                                console.log(`${user} is banned from this room and cannot set it addmin`)
                            }
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
                    console.log('user not in this room')
                }
            }
            else
            {
                console.log("room or users not found");
            }
        } 
        catch (error) 
        {
            console.log('from here')
            console.log(error)    
        }
    }

    @Post('/changeTypeToUsers') // use dto
    async changeTypeToUsers(@Body() dto:any, @Res() res:any)
    {
        try 
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

            if(!await this.utils.getUserId(user['sub']))
            {
                console.log('user not found.')
                return;
            }
            
            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            
            const usersIds = await this.utils.getUsersId(user['sub'],dto.users)
            
           
            if(roomId && usersIds)
            {
                const userType = await this.utils.getUserType(roomId,user['sub']);
                if(userType)
                {
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
                    console.log('user not in this room')
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
            if(!await this.utils.getUserId(user['sub']))
            {
                console.log('user not found.')
                return;
            }
            
            const roomId = await this.utils.getRoomIdByName(dto.roomName);
            
            if(roomId)
            {
                const userType = await this.utils.getUserType(roomId,user['sub']);
                
                if(userType)
                {
                    if (userType.userType === 'ADMIN' || userType.userType === 'OWNER') 
                    {
                        if(dto.type === 'PRIVATE' || dto.type === 'PROTECTED' || dto.type === 'PUBLIC')
                        {
                            const roomType = await this.utils.getRoomById(roomId);
                            
                            if(roomType.roomType !== dto.type)
                            {
                                if(dto.type === 'PROTECTED')
                                {
                                     
                                    if(await this.roomService.updateRoom(dto.type,roomId, encodePasswd(dto.password)) === 0)
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
                else
                    console.log('user not in this room')
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

    @Post('/join-room') //
    async joinRoom(@Body() dto:any, @Res() res:any) 
    {
        try 
            // check if current user is not banned from the selected room
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
            if(!await this.utils.getUserId(user['sub']))
            {
                console.log('user not found.')
                return;
            }
            
            const roomId = await this.utils.getRoomIdByName(dto.name);

            if(roomId)
            {
                const usersInRoom = await this.utils.getUsersInRooms(roomId);

                const find = usersInRoom.find((item:any) => item.userId === user['sub']);
                if(find.isBanned)
                {
                    console.log('you are banned from this room')
                    return;
                }
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

    @Post('/renameRoom')
    async renameRoom(@Body() dto:any, @Res() res:any)
    {
        /**
         * before rename the room:
         *  - check the user if is valid
         *  - if room is exist
         *  - if new name of the room not found in db
         * - if admin or owner 
         */
        try
        {
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
            if(!await this.utils.getUserId(user['sub']))
            {
                console.log('user not found.')
                return;
            }
                
            const roomId = await this.utils.getRoomById(dto.idOfRoom);

            if(roomId)
            {
                const userType = await this.utils.getUserType(roomId.id,user['sub']);
                
                if(userType)
                {
                    if (userType.userType === 'ADMIN' || userType.userType === 'OWNER') 
                    {
                        if(!await this.utils.getRoomIdByName(dto.newNameOfRoom))
                        {
                            await this.roomService.updateRoomName(roomId.id, dto.newNameOfRoom);
                        }
                        else
                        {
                            console.log('name of room aleredy exist')
                        }
                    }
                    else
                    {
                        console.log("cannot have the permission to change room Type.")
                    }
                }
                else
                {
                    console.log('user is not in this room')
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

    @Post('/addNewUsersToRoom')
    async addNewUsersToRoom(@Body() dto:any, @Res() res:any)
    {
        try 
        { // if error in jwt
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

            if(!await this.utils.getUserId(user['sub'])) //if jwt expired
            {
                console.log('user not found.')
                return;
            }

            const roomId = await this.utils.getRoomById(dto.idOfRoom);
            if(roomId)
            {
                const userType = await this.utils.getUserType(roomId.id,user['sub']);
                if(userType)
                {
                    if(userType.userType !== 'USER') // test one by one
                    {
                        const usersIds = await this.utils.getUsersId(user['sub'],dto.users, 1)
                        
                        if(usersIds === 0)
                        {
                            console.log("you try to add the current user")
                            return;
                        }
                        
                        if(usersIds)
                        {
                            await this.roomService.linkBetweenUsersAndRooms(roomId.id, usersIds);
                        }
                        else
                        {
                            console.log('users not found')
                            return;
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
                    console.log('user is not in this room')

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
            console.log('from addNewUsersToRoom()')
            console.log(error)    
        }
    }

    @Post('/changePasswordOfProtectedRoom')
    async changePasswordOfProtectedRoom(@Body() dto:any, @Res() res:any)
    {
        /**
         * check if usser is exist
         * check if room if exist
         * check if user who want to change the password is an admin or owner
         * if room is protected change the password 
        */

        try 
        { // if error in jwt
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

            if(!await this.utils.getUserId(user['sub'])) //if jwt expired
            {
                console.log('user not found.')
                return;
            }

            const roomId = await this.utils.getRoomById(dto.idOfRoom);
            if(roomId)
            {
                if(roomId.roomType === 'PROTECTED')
                {
                    const userType = await this.utils.getUserType(roomId.id,user['sub']);
                    if(userType)
                    {
                        if(userType.userType !== 'USER') // test one by one
                        {
                            await this.roomService.changePasswordOfProtectedRoom(roomId.id, encodePasswd(dto.newPassword))
                        }
                        else
                        {
                            console.log('dont have the permmission to add users to this room.')
                            return ;
                        }
                    }
                    else
                        console.log('user is not this room')
                }
                else
                {
                    console.log('room is not PROTECTED')
                    return;
                }

            }
            else
            {
                console.log('room not found')
            }
        } 
        catch (error) 
        {
            console.log('from changePasswordOfProtectedRoom()')
            console.log(error)    
        }
    }

    @Post('/leaveRoom')
    async leaveRoom(@Body() dto:any, @Res() res:any)
    {
        try 
        { // if error in jwt
            const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })

            if(!await this.utils.getUserId(user['sub'])) //if jwt expired
            {
                console.log('user not found.')
                return;
            }

            const roomId = await this.utils.getRoomById(dto.idOfRoom);

            if(roomId)
            {
                if(await this.roomService.doesRoomHaveUsers(roomId.id))
                {
                    const userType = await this.utils.getUserType(roomId.id,user['sub']);
                     
                    if(userType)
                    {
                        if(userType.userType === 'OWNER')
                        { 
                            await this.roomService.removeUserFromRoom(roomId.id, user['sub']);
        
                            let newOwner:any = await this.roomService.getFirstUser('ADMIN') // get first admin if found it
    
                            if(!newOwner) // if not found an admin
                            {
                                newOwner = await this.roomService.getFirstUser('USER') // will search for the first user in the room
        
                                await this.roomService.setNewOwner(roomId.id, newOwner.userId) // set first user in the room as owner
                                
                                return ;
                            }
                            await this.roomService.setNewOwner(roomId.id, newOwner.userId) // set this first admin as the owne
                        }
                        else
                        {
                            // check here if banned
                            await this.roomService.removeUserFromRoom(roomId.id, user['sub']); // if admin or user leave 
                        }                 
                    }
                    else
                        console.log('user is not in this room')
                }
                else
                {
                    console.log('room dont have users.')
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
            console.log('from leaveRoom()')
            console.log(error)    
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
            { // if error in jwt
                const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
    
                if(!await this.utils.getUserId(user['sub'])) //if jwt expired
                {
                    console.log('user not found.')
                    return;
                }

                const roomId = await this.utils.getRoomById(dto.idOfRoom);
                
                if(roomId)
                {
                    const usersIds = await this.utils.getUsersInfosInRoom(user['sub'],dto.users, roomId.id)
                    if(usersIds === '1')
                    {
                        console.log('one user or multi users not found')
                        return ;
                    }
                    if(usersIds === 0)
                    {
                        console.log("cannot kick owners")
                        return;
                    }
                    
                    if(await this.roomService.doesRoomHaveUsers(roomId.id))
                    {
                        
                        const userType = await this.utils.getUserType(roomId.id,user['sub']);
                       
                        if(userType)
                        {
                            if(userType.userType !== 'USER')
                            { 
                                await this.roomService.removeUserFromRoom(roomId.id, usersIds); 
                            }
                            else
                            {
                                console.log('dont have the permission to kick ');
                            }                 
                        }
                        else
                        {
                            console.log('user in not in the room')
                        }
                    }
                    else
                    {
                        console.log('room dont have users.')
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
    
    @Post('/banFromRoom') 
	async banFromRoom(@Body() dto:any, @Res() res:any)
    {
        // validatin of the current user  
        // validation of current room
        // if current user is admin or owner
        // if user who want to block them is a user block them 
        // else cannot block them
        

        try 
            { // if error in jwt
                const user = this.jwtService.verify(dto.auth,{ secret: process.env.JWT_SECRET })
    
                if(!await this.utils.getUserId(user['sub'])) //if jwt expired
                {
                    console.log('user not found.')
                    return;
                }

                const usersIds = await this.utils.getUsersId(user['sub'],dto.users)
                if(!usersIds)
                {
                    console.log('on user or multi users dont found.')
                }
                const roomId = await this.utils.getRoomById(dto.idOfRoom);
                
                if(roomId)
                {
                    const bannedAndUnBannedUsers = await this.utils.getAllbannedAndUnBannedUsers(user['sub'],dto.users, roomId.id); 
                    
                    if(await this.roomService.doesRoomHaveUsers(roomId.id))
                    {
                        const userType = await this.utils.getUserType(roomId.id,user['sub']);
                       
                        if(userType)
                        {
                            if(userType.userType !== 'USER')
                            { 
                                for(const user of bannedAndUnBannedUsers)
                                {
                                    if(user.UnbannedUser)
                                    {
                                        await this.utils.removeUserFromRoom(user.UnbannedUser, roomId.id);
                                    }
                                    else
                                        console.log('user is banned')
                                }
                            }
                            else
                            {
                                console.log('dont have the permission to ban ');
                            }                 
                        }
                        else
                        {
                            console.log('user in not in the room')
                        }
                    }
                    else
                    {
                        console.log('room dont have users.')
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
                console.log('from banFromRoom()')
                console.log(error)    
            }


    }
}
