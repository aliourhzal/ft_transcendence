/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UtilsService {

    private readonly prisma = new PrismaClient();

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
   
   

    async getUsersId(adminId: string, users: string[], flag?: number)
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
