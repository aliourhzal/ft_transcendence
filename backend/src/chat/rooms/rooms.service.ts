/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient, RoomType, UserType } from '@prisma/client';
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
            const existingUsers = await this.prisma.joinedTable.findFirst({
                where: {
                    userId: usersIds[i],
                    roomId,
                },
            });
            
            if (!existingUsers) 
            {
                
                await this.prisma.joinedTable.create({
                    data: {
                    userId : usersIds[i],
                    roomId,
                    },
                });
                
            }
        }

        
         
        return {ok : 'ok'};
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
                    return {error : 'should set password for this protected room.'}
                }
                
                const room = await this.prisma.room.create({data: {room_name , roomType : roomType_ , password: encodePasswd(password)}});
                 

                await this.prisma.joinedTable.create({ // set OWNER for the room
                    data: {
                      userId : adminOfRoom,
                      roomId: room.id,
                      userType: "OWNER"
                    },
                });

                return {room};
            }
            const room = await this.prisma.room.create({data: {room_name , roomType : roomType_  }}) // create the room
      
             
            await this.prisma.joinedTable.create({ // set OWNER for the room
                data: {
                  userId : adminOfRoom,
                  roomId: room.id,
                  userType: "OWNER"
                },
            });
            
            return {room};
        }
        
        return {error : " room aleredy exist"};
    }

    async createRoom(roomandUsers:roomAndUsers, adminOfRoom:string, roomType_:RoomType, password? : string) 
    {
        
        const room = await this.OWNERCreateRoom(roomandUsers.roomName, adminOfRoom, roomType_, password);// crete room and assign to it the admin
        

        if(room.error)
            return room;
       
        await this.linkBetweenUsersAndRooms(room.room.id, roomandUsers.users)

        return room;
    }


    // ---------------------------------------------------------Set Roles Of Rooms ---------------------------------------------- //

        

    async setNewOwner(roomId: string, newOwnerId:string)
    {
        await this.prisma.joinedTable.update({
            where: {
                userId_roomId: {
                    userId: newOwnerId,
                    roomId,
                },
            },
            data: {
                userType: "OWNER",
            },
        });
    
    }   

    async changeToUsers(roomId: string, usersIds: any, ownerId:string)
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
                return 1;
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
        return 2;
    }                                                                                                                            

    async updateRoom(roomType_: RoomType, roomId:string, password?: string )
    {
        if(roomType_ === "PROTECTED")
        {
            if(!password)
            {
                return 0;
            }

            await this.prisma.room.update({
                where: {
                  id: roomId,
                },
                data: {
                  roomType : roomType_ ,
                  password : password
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

    async updateRoomName(roomId:string, newRoomName: string )
    {
        await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                room_name : newRoomName ,
            },
        });
    }

    async changePasswordOfProtectedRoom(roomId:string, hash: string )
    {
        await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                password : hash ,
            },
        });
    }
    
    async   removeUserFromRoom(roomId: string, usersIds: string[] | string ) {
        
        if(Array.isArray(usersIds))
        {
            for(const userId of usersIds)
            {
                await this.prisma.joinedTable.delete({
                  where: {
                    userId_roomId: {
                      roomId: roomId,
                      userId: userId,
                    },
                  },
                });
            }
        }
        else
        {
            await this.prisma.joinedTable.delete({
                where: {
                  userId_roomId: {
                    roomId: roomId,
                    userId: usersIds,
                  },
                },
              });
        }

    } 
      
    async   getFirstUser(userType_: UserType) {
        
        return await this.prisma.joinedTable.findFirst({
            where: {
              userType: userType_,
            },
            orderBy: {
              createdAt: 'asc'
            }
          });
    }
      
    async   doesRoomHaveUsers(roomId: string): Promise<boolean> {
        const usersInRoom = await this.prisma.joinedTable.findMany({
            where: {
            roomId
            }
        });
        
        return usersInRoom.length > 0;
    }
     
    async   isUserInRoom(userId: string, roomId: string): Promise<boolean> {
        const userInRoom = await this.prisma.joinedTable.findFirst({
          where: {
            userId,
            roomId
          }
        });
      
        return !userInRoom;  
      }
      
      async setNewAdmins(roomId: string, user:any)
    {
        if(user.userType === 'ADMIN' || user.userType === 'OWNER')
            return {error : `you are aleredy seted to ${user.userType}.`}
        
        await this.prisma.joinedTable.update({
            where: {
                userId_roomId: {
                    userId: user.userId,
                    roomId,
                },
            },
            data: {
                userType: "ADMIN",
            },
        });
        return {ok : 'new admin seted succssufuly.'};
    }  
}
