/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { roomAndUsers } from 'src/utils/userData.interface';

@Injectable()
export class RoomsService 
{
    private readonly prisma = new PrismaClient();

    constructor(){}

    

    async linkBetweenUsersAndRooms(roomId: string, usersIds:string[])  
    {
        for(let i = 0; i < usersIds.length; i++)
        {
            const existingLink = await this.prisma.joinedTable.findFirst({
                where: {
                  userId:usersIds[i],
                  roomId,
                },
            });
            
            if (!existingLink) 
            {
                
                await this.prisma.joinedTable.create({
                  data: {
                    userId : usersIds[i],
                    roomId,
                  },
                });
                
            }
            else
            {
                return 4
                // here will entered if user is aleredy exist in the chat room 
                //  emit error when the same user is entered
            }
        }

        return 1;
    }

    async adminCreateRoom(room_name: string, adminOfRoom:string)
    {
        
        const existingRoom = await this.getRoomIdByName(room_name)
       
        if(!existingRoom)
        {   
            const room = await this.prisma.room.create({data: {room_name}}) // create the room
             
            await this.prisma.joinedTable.create({ // set admin for the room
                data: {
                  userId : adminOfRoom,
                  roomId: room.id,
                },
            });

            
            return room;
        }
        else
            return 1;
    }

    async createRoom(roomandUsers:roomAndUsers, adminOfRoom:string)
    {

        const room = await this.adminCreateRoom(roomandUsers.roomName,adminOfRoom);// crete room and assign to it the admin
        
        if(room === 1)
            return 1;

        const usersIds = await this.getUsersId(adminOfRoom,roomandUsers.users);
    
         
        if(usersIds === null) // can be emit the error message here, pass the server obj to this function for use it for make it real time
            return 2;

        if(usersIds === "you try to enter the admin")
            return 3;

        if(await this.linkBetweenUsersAndRooms(room['id'],usersIds) === 4) // add users to the room
            return 4;
        return room;
    }


    // utils function

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
}
