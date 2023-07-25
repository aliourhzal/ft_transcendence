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
   

    async getUsersId(adminId: string, users: string[])
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
            
                if(existingUser.id === adminId)
                {
                    return "you try to enter the admin"
                    // emit message to frontend you try to insert the admin
                }
                else
                { 
                    // here check if enter the user multi time
                    
                    // const unique = this.checkIfArrayIsUnique(usersFounding);
                    // if(!unique)
                        usersFounding.push(existingUser.id);
                         
                    // else
                    //     console.log(unique)
                }
            }   
            else
            {
                return null;
            } 
            
        }
        return usersFounding; // return users id
    }

    async getRoomIdByName (room_name: string) {
        const room = await this.prisma.room.findUnique({
          where: { room_name },
        });
      
        if (room) {
            room.roomStauts = "PUBLIC"; // here make the room public or private or protected
          return room.id;
        } else {
          // Handle case when room is not found
          return null;
        }
      };

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
