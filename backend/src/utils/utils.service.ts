/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BannedAndUnbannedUsers } from './userData.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilsService {

    private readonly prisma = new PrismaClient();

    constructor(private readonly jwtService:JwtService){}

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
   
    async getUserId(ids : string[])
    {
        let  existingUser: string[] = [];       

        for(const id of ids)
        {
            const userId = await this.prisma.user.findUnique({
                where: {
                    id,
                },
            });

            if(!userId)
                return {error : 'user not found'};
            
            existingUser.push(userId.id);
        }
        return {existingUser};
    }

 
    async getUsersIdByNickname(adminId: string, users?: string[], flag?: number)
    {
        let usersFounding: string[] = [];

        const user = await this.getuserById(adminId);
        
        if(!user)
            return {error : 'user not found.'};

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
                return {error : 'user not found.'};
            } 
            
        }

        if(flag === 1)
        {
            for(const user of usersFounding) 
            {
                if(user === adminId)
                {
                    return {error : 'cannot add current user.'};
                }
            }
        }
        const uniqUsers = [...new Set(usersFounding)];
        return {uniqUsers}; // return users id
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
    
    async   getUserType(roomId: string, usersId: string[]) 
    {
        let usersType:any[] = [];

        if(usersId[0] ===  usersId[1]) 
            return {error : 'you entered the same user.'};
        for(const userId of usersId)
        {
            const getRoomInfos = await this.prisma.joinedTable.findFirst({
                where: {
                    roomId: roomId,
                    userId,
                },
            });

            if(!getRoomInfos)   
                return {error : 'user is not in this room.'};
            
            usersType.push(getRoomInfos);
        }
        return {usersType}
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


    async getInfosOfuserInRoom(userId: string)
    {
        return await this.prisma.blackList.findMany({
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
        // and cannot re joined to room .
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
            data: { isBanned: "BANNEDUNLIMMITED_TIME" },
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


    verifyJwtFromHeader(authorizationHeader: string)
    {
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
          const token = authorizationHeader.substring(7); // Remove 'Bearer ' from the header
          return token;
        }
        return null;
      }
    
      async verifyToken(token: string)
       {

        const decoded = this.jwtService.verify(token , { secret: process.env.JWT_SECRET });
        return decoded;
         
      }


      async ifUserIsBanned(userId : string , roomId : string)
      {
        return await this.prisma.blackList.findFirst({
            where: {
                userId,
                roomId,
            },
            select: {
                isBanned: true,
                banExpiresAt : true
            },
        });
      }


      async   isUserMuted(userId: string, roomId: string) {
        
        return await this.prisma.blackList.findFirst({
            where: {
                userId,
                roomId,
            },
            select: {
                isMuted: true,
                muteExpiresAt : true
            },
        });

    }
}
