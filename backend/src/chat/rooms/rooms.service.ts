/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient, RoomType, UserBnned, UserMUTE, UserType } from '@prisma/client';
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

    // create dual room

    async   createPrivateRoom(currentUserId: string, user2Id: string)  
    {
        const dmRooms = await this.prisma.room.findMany({
            where: {
              roomType: 'DM',
              users: {
                some: {
                  userId: currentUserId,
                },
              },
            },
          });


        const dmRooms_2 = await this.prisma.room.findMany({
            where: {
              roomType: 'DM',
              users: {
                some: {
                  userId: user2Id,
                },
              },
            },
          });
          

          const haveSharedRooms = dmRooms.some((dmRoom) =>
        dmRooms_2.some((room) => room.id === dmRoom.id)
        );

        if (haveSharedRooms) {
            console.log('The users have shared rooms in DM-type rooms.');
            return {error: 'The users have shared rooms in DM-type rooms.'}
        } 
        

            const newDmRoom = await this.prisma.room.create({
            data: {
              roomType: 'DM',
            },
          }); 
          await this.prisma.joinedTable.create({
            data: {
            userId : currentUserId,
            roomId : newDmRoom.id,
            },
        })
            await this.prisma.joinedTable.create({
            data: {
            userId : user2Id,
            roomId : newDmRoom.id,
            },
        })

        console.log('create DM-type rooms.');
        
    
    return {newDmRoom};


    }

    async linkBetweenUsersAndRooms(roomId: string, usersIds:string[])  
    {
        let users:any = [];

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
                users.push(await this.prisma.joinedTable.create({
                    data: {
                    userId : usersIds[i],
                    roomId,
                    },
                }));
                
            }
        }

        
         
        return {users};
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

     

    

    async removeRoom(roomId: string) 
    { 
        await this.prisma.joinedTable.deleteMany({
            where: {
                roomId: roomId,
            },
        });

         await this.prisma.blackList.deleteMany({
            where: {
                roomId: roomId,
            },
        });
 
        await this.prisma.room.delete({
            where: {
                id: roomId,
            },
        });
        
    }

    async setNewOwner(roomId: string, newOwnerId:string)
    {
        return await this.prisma.joinedTable.update({
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

    async changeToUser(roomId: string, demoteUserId: string)
    {
        
        const updatesUserType = await this.prisma.joinedTable.update({
            where: {
                userId_roomId: {
                    userId: demoteUserId,
                    roomId,
                },
            },
            data: {
                userType: "USER",
            },
        });
        return {updatesUserType}
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
        return await this.prisma.room.update({
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
        return await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                password : hash ,
            },
        });
    }
    
    async   removeUserFromRoom(roomId: string, kickedUserId: string ) {
        
        
        const kickedUser = await this.prisma.joinedTable.delete({
            where: {
                userId_roomId: {
                    roomId: roomId,
                    userId: kickedUserId,
                },
            },
        });
   
        return {kickedUser}
    } 
      
    async getFirstUserInRoom(roomId: string, userType_: UserType) {
        return await this.prisma.joinedTable.findFirst({
            where: {
                roomId,
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
          
          const updatesUserType = await this.prisma.joinedTable.update({
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
          return {updatesUserType};
    }
    

    async bannUser(banExpiresAt : any , userId:string,roomId:string , banType : UserBnned  )
    {
        const existingBan = await this.prisma.blackList.findUnique({
            where: { userId_roomId: { userId, roomId } },
          });
        
          if (existingBan) 
          {
            return await this.prisma.blackList.update({
              where: { userId_roomId: { userId, roomId } },
              data: {
                isBanned: banType,
                banExpiresAt,
              },
            });
          } 
          else 
          {
            // Create a new record
            return await this.prisma.blackList.create({
              data: {
                user: { connect: { id: userId } },
                room: { connect: { id: roomId } },
                isBanned: banType,
                banExpiresAt,
              },
            });
          }
        
    }


    async muteUser(muteExpiresAt : any , userId:string, roomId:string , muteType : UserMUTE )
    {
        const existingmute = await this.prisma.joinedTable.findUnique({
            where: { userId_roomId: { userId, roomId } },
          });
        
          if (existingmute) 
          {
            return await this.prisma.joinedTable.update({
              where: { userId_roomId: { userId, roomId } },
              data: {
                isMuted: muteType,
                muteExpiresAt,
              },
            });
          } 
          else 
          {
            // Create a new record
            return await this.prisma.joinedTable.create({
              data: {
                user: { connect: { id: userId } },
                room: { connect: { id: roomId } },
                isMuted: muteType,
                muteExpiresAt,
              },
            });
          }
        
    }
    
    async makeUserUnbanned( userId:string, roomId:string  )
    {
        await this.prisma.blackList.update({
            where: 
            {
                userId_roomId: 
                    {
                        userId , 
                        roomId
                    } 
            },
            data: { isBanned: 'UNBANNED', banExpiresAt: null },
        });
    }
    
    async makeUserUnMuted( userId:string, roomId:string  )
    {
        await this.prisma.joinedTable.update({
            where: 
            {
                userId_roomId: 
                    {
                        userId , 
                        roomId
                    } 
            },
            data: { isMuted: 'UNMUTED'},
        });
    }
    
    async banUserForEver( userId:string , roomId:string  )
    {
       
        // for if is banned for limmited time and want to banned for ever
        const existingBan = await this.prisma.blackList.findUnique({
            where: { userId_roomId: { userId, roomId } },
          });
        
          if (existingBan) 
          {
            await this.prisma.blackList.update({
              where: { userId_roomId: { userId, roomId } },
              data: {
                isBanned: 'BANNEDUNLIMMITED_TIME',
                banExpiresAt: null,
              },
            });
          } 
          else 
          {
            // Create a new record
            await this.prisma.blackList.create({
              data: {
                user: { connect: { id: userId } },
                room: { connect: { id: roomId } },
                isBanned: 'BANNEDUNLIMMITED_TIME',
                banExpiresAt: null,
              },
            });
          }
    }

    async deleteRoomPassword(roomId: string) {
        const updatedRoom = await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                password: null,
                roomType : 'PUBLIC',
            },
        });
    
        return updatedRoom;
    }

}
