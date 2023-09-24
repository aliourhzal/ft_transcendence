/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AllMessages } from 'src/utils/userData.interface';
import { RoomsService } from '../rooms/rooms.service';
// import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessagesService 
{

    constructor(private roomService:RoomsService){}
    private readonly prisma = new PrismaClient();
    
    async getAllMessagesofRoom(roomId : string , userId : string)
    {
        const allMessages: AllMessages[] = [];

        const allUsersBlockedByMe = (await this.roomService.allUsersBlockedByMe(userId)).blockedUsers;
            
        const allUsersWhoBlockMe = await this.roomService.allUsersWhoBlockMe(  userId);
    
        let allBlockedUsers =   allUsersWhoBlockMe.map((item) => item.id);
        
        allBlockedUsers.push(...allUsersBlockedByMe.map((item) => item.id))

        const messages = await this.prisma.room.findUnique({
            where: { id: roomId },
            include: {
              messages: {
                where: {
                  NOT: {
                    userId: {
                      in: allBlockedUsers,
                    },
                  },
                },
              },
              users: true,
            },
          });

        if(messages)
        { 

            for (let i = 0; i < messages.messages.length; i++) {// put them in map or array of obj and return it
                
                const msg: AllMessages = {
                    userId: (await this.findUserById(messages.messages[i].userId)).id,
                    msg: messages.messages[i]
                };
                allMessages.push(msg);
            }
        
            return allMessages;

            // return {username:this.findUserById(messages.users[0].userId) , message:messages.messages};
        }
        else
        {
            console.log('error from getAllMessagesofRoom() ')
            // room name not found
        }
        // return messages;
    }
    
    async  linkUserWithMessageAndRoom(message: string, userId: string, roomId:string) 
    {
        return await this.prisma.messages.create({ //  
            data: {
              text: message,
              user: { connect: { id: userId } },
              room: { connect: { id: roomId } },
            },
        });
    }

    async usersConnectedInRoom(roomId: string) 
    {
        const usersConnectedInRoom = await this.prisma.joinedTable.findMany({
            where: {
                roomId,  
            },
            include: {
                user: true,
            }
        });
        
        
        return usersConnectedInRoom;
    }
      
    
    async createMessages(message: string, userId: string, roomId: string)
    {
        const rtn =  await this.linkUserWithMessageAndRoom(message, userId, roomId); // link user with message and room

        const userAndText = {userId: rtn.id, msg: rtn.text}

        const user = (await this.findUserById(userId)).id;

        if(user)
        {
            return { 
                user, 
                msg: userAndText.msg,
                idOfMsg:rtn.id
                 
            }
        }
        else
        {
            // user not found
                // error
        }
    }
                
                
    async findUserById(userId: string)
    {

        const username = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if(username)
            return username;
        else
            return null;
    }
}