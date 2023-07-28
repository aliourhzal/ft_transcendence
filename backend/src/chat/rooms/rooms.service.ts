/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient, RoomType } from '@prisma/client';
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

    async OWNERCreateRoom(room_name: string, adminOfRoom:string, roomType_: RoomType , password?: string)  
    {
     
        const existingRoom = await this.utils.getRoomIdByName(room_name)
        
        if(!existingRoom)
        {   
            if(roomType_ === "PROTECTED")
            {
                if(!password)
                {
                    console.log("should set password for this protected room");
                    return 0;
                }
                const room = await this.prisma.room.create({data: {room_name , roomType : roomType_ , password: encodePasswd(password)}});
                 

                await this.prisma.joinedTable.create({ // set OWNER for the room
                    data: {
                      userId : adminOfRoom,
                      roomId: room.id,
                      userType: "OWNER"
                    },
                });

                return room;
            }
            const room = await this.prisma.room.create({data: {room_name , roomType : roomType_  }}) // create the room
             
            await this.prisma.joinedTable.create({ // set OWNER for the room
                data: {
                  userId : adminOfRoom,
                  roomId: room.id,
                  userType: "OWNER"
                },
            });

            
            return room;
        }
        else
            return 1;
    }

    async createRoom(roomandUsers:roomAndUsers, adminOfRoom:string, roomType_:RoomType, password? : string) 
    {
        
        const room = await this.OWNERCreateRoom(roomandUsers.roomName, adminOfRoom, roomType_,password);// crete room and assign to it the admin
        
        if(room === 0 )
            return 0;
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

    
    async setNewAdmins(roomId: string, usersIds: any , ownerId:string)
    {
        for(const user of usersIds) 
        {
            if(user === ownerId)
                return 0;
        }
        
        // if pass the same users to change to admins will pass unique ids

        for (let i = 0; i < usersIds.length; i++) 
        {
            const existingLink = await this.prisma.joinedTable.findFirst({
                where: {
                  userId : usersIds[i],
                  roomId,
                },
            });
            
            if (!existingLink) 
            {
                throw new Error("The specified user is not linked to the room.");
            }
            if (existingLink.userType === 'USER') // check if the user is admin dont change her Type to admin in db
            {
                
                await this.prisma.joinedTable.update({
                    where: {
                        userId_roomId: {
                            userId: usersIds[i],
                            roomId,
                        },
                    },
                    data: {
                        userType: "ADMIN",
                    },
                });
            }
        }
        return 1;
    }   

    async changeToUsers(roomId: string, usersIds: any , ownerId:string )
    {
        for(const user of usersIds) 
        {
            if(user === ownerId)
                return 0;
        }
         
        for (let i = 0; i < usersIds.length; i++) 
        {
            const existingLink = await this.prisma.joinedTable.findFirst({
                where: {
                  userId : usersIds[i],
                  roomId,
                },
            });
            
            if (!existingLink) 
            {
                throw new Error("The specified user is not linked to the room.");
            }

        if (existingLink.userType === 'ADMIN')
        {
            await this.prisma.joinedTable.update({
                where: {
                    userId_roomId: {
                        userId: usersIds[i],
                        roomId,
                    },
                },
                data: {
                    userType: "USER",
                },
            });

        }
        }
    }                                                                                                                            

    async changeRoomType(roomType_: RoomType, roomId:string, password?: string )
    {
        if(roomType_ === "PROTECTED")
        {
            if(!password)
            {
                console.log("should set password for this protected room");
                return 0;
            }

            await this.prisma.room.update({
                where: {
                  id: roomId,
                },
                data: {
                  roomType : roomType_ ,
                  password : encodePasswd(password)
                },
            });
        }
        else
        {
            await this.prisma.room.update({
                where: {
                  id: roomId,
                },
                data: {
                  roomType : roomType_,
           
                },
            });
        }

    }

    
}
