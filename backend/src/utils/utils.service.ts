/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BannedAndUnbannedUsers } from './userData.interface';

@Injectable()
export class UtilsService {

    private readonly prisma = new PrismaClient();

    bannedAndUnBannedUsers:BannedAndUnbannedUsers[] = [];

    async   getUserIdByEmail(email: string)
    {
        const user = await this.prisma.user.findFirst({
          where: {
            email,
          },
          select: {
            id: true,
          },
        });
      
        return user.id || null;
    }
   
    async getUserId(id:string)
    {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        return existingUser;
    }

    async getUsersId(adminId: string, users?: string[], flag?: number)
    {
        let usersFounding: string[] = [];

         
        for (let i = 0; i < users.length; i++) 
        {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    nickname : users[i],
                },
            });
            
            
            if(existingUser)
            {
                usersFounding.push(existingUser.id);
            }   
            else
            {
                return null;
            } 
            
        }

        if(flag === 1)
        {
            for(const user of usersFounding) 
            {
                if(user === adminId)
                    return 0;
            }
        }
        const uniqusers = [...new Set(usersFounding)];
        return uniqusers; // return users id
    }

    async checkKickedUser(currentUser: string, kickerUser: string, roomdId:string)  
    {

        const userId = await this.getUserId(kickerUser);
        
        if(currentUser === userId.id)
            return {error : 'cannot kick the current user'};

        if(!userId)
        {
            return {error : 'user not found'}
        }
        
        const userType = (await this.getUserType(roomdId, kickerUser));
        
        // check if user in room

        console.log(userType);

        if(userType.userType === 'ADMIN' || userType.userType === 'OWNER')
            return {error : 'connot kick the owner or admin'};
        
        return {ok : 'ok'};
    }



    async getAllbannedAndUnBannedUsers(adminId: string,users: string[], roomdId:string)  
    {
            for(const userId of users)
            {
                const userType = (await this.getUserType(roomdId,userId));
                
                if(userType.isBanned === true)
                    this.bannedAndUnBannedUsers.push({BannedUser : userId})
                else
                    this.bannedAndUnBannedUsers.push({UnbannedUser : userId})

            }
            return this.bannedAndUnBannedUsers;
    }

    async getRoomIdByName (room_name: string) {
        const room = await this.prisma.room.findUnique({
          where: { room_name },
        });
      
        if (room) {
          return room.id;
        } else {
          // Handle case when room is not found
          return null;
        }
    };
    
    async getRoomById (id: string) {
        const room = await this.prisma.room.findUnique({
          where: { id },
        });
      
        if (room) {
          return room;
        } else {
          // Handle case when room is not found
          return null;
        }
    };
    async getRoomByName (room_name: string) {
        const room = await this.prisma.room.findUnique({
          where: { room_name },
        });
      
        if (room) {
          return room;
        } else {
          // Handle case when room is not found
          return null;
        }
    };
    
    async getuserById (id: string) {
        const user = await this.prisma.user.findUnique({
          where: { id },
        });
      
        if (user) {
          return user;
        } else {
          // Handle case when room is not found
          return null;
        }
    };
    
    async   getUserType(roomId: string, userId: string) {
        const getRoomInfos = await this.prisma.joinedTable.findFirst({
          where: {
            roomId: roomId,
            userId: userId,
          },
        });
      
        return getRoomInfos;
    }

    async getRoomsForUser(userId: string)
    {
        return await this.prisma.joinedTable.findMany({
            where: {
                userId,
            },
            include: {
                room:true,
            },
        }); 
    }

    async  getUsersInRooms(roomId: string) 
    {
        let usersInRooms;
        
        const rooms = await this.prisma.joinedTable.findMany({
            where: {
                roomId,
              },
              include: {
                user: true,
            },
        });
        
        for (const room of rooms) {
            usersInRooms = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: {
              users: true,
            },
          });
      
        }
        return usersInRooms.users;
    }


    async  getUserInfosInRoom(roomId: string) 
    {
        let usersInRooms:any;
        
        const rooms = await this.prisma.joinedTable.findMany({
            where: {
                roomId,
              },
              include: {
                user: true,
              },
        });

        return rooms;
    }

    async   removeUserFromRoom(userId : string, roomId : string) 
    {
        // if remove the user from join table will not known if it is banned or not , so just remove all messages from the room
        
        const userMessages = await this.prisma.messages.findMany({ //  messages of user in the room
            where: {
              user: {
                id: userId,  
              },
              room: {
                id: roomId,  
              },
            },
        });
          
        const messageIds = userMessages.map((message) => message.id); // all ids of messages
        
        await this.prisma.messages.deleteMany({ // delete all messages of user in the room
            where: { id: { in: messageIds } },
        });
          
        await this.prisma.joinedTable.update({ // make the user banned from the room
            where: { userId_roomId: { userId: userId, roomId: roomId } },
            data: { isBanned: true },
        });
          
          
    }

    async setHashedPasswordOfRoom(id: string ,password: string)
	{
		await this.prisma.room.update({
			where:{
				id: id,
			},
			data: {
				password: password,
			}
		});
	}
}