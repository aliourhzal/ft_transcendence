/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient, RoomStatus } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { encodePasswd } from 'src/utils/bcrypt';
import { roomAndUsers, roomShape } from 'src/utils/userData.interface';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class RoomsService 
{
    private readonly prisma = new PrismaClient();

    constructor(private readonly utils:UtilsService){}

    
    
    // ----------------------------------------------Create Room---------------------------------------------- //

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

    async adminCreateRoom(room_name: string, adminOfRoom:string, roomStatus: RoomStatus , password?: string)  
    {
        const existingRoom = await this.utils.getRoomIdByName(room_name)
        
        if(!existingRoom)
        {   
            if(roomStatus === "PROTECTED")
            {
                if(!password)
                {
                    console.log("should set password for this protected room");
                    return 0;
                }

               const room = await this.prisma.room.create({data: {room_name , roomStauts : roomStatus , password: encodePasswd(password)}});

                await this.prisma.joinedTable.create({ // set admin for the room
                    data: {
                      userId : adminOfRoom,
                      roomId: room.id,
                      userStatus: "ADMIN"
                    },
                });

                return room;
            }
            const room = await this.prisma.room.create({data: {room_name , roomStauts : roomStatus  }}) // create the room
             
            await this.prisma.joinedTable.create({ // set admin for the room
                data: {
                  userId : adminOfRoom,
                  roomId: room.id,
                  userStatus: "ADMIN"
                },
            });

            
            return room;
        }
        else
            return 1;
    }

    async createRoom(roomandUsers:roomAndUsers, adminOfRoom:string, roomStatus:RoomStatus, password? : string) 
    {
  
        const room = await this.adminCreateRoom(roomandUsers.roomName,adminOfRoom,roomStatus,password);// crete room and assign to it the admin
        
        if(room === 1)
        {
            // emit error
            return 1;
        }

        const usersIds = await this.utils.getUsersId(adminOfRoom,roomandUsers.users);
    
         
        if(usersIds === null) // can be emit the error message here, pass the server obj to this function for use it for make it real time
            return 2;

        if(usersIds === "you try to enter the admin")
            return 3;

        if(await this.linkBetweenUsersAndRooms(room['id'],usersIds) === 4) // add users to the room
            return 4;

        return room;
    }


    // ---------------------------------------------------------Set Roles Of Rooms ---------------------------------------------- //


    async setUsersRoles(room:roomShape | number, roomStatus:string, usersStatus:object)
    {
        


    }
                                                                                                                                        

    
}
