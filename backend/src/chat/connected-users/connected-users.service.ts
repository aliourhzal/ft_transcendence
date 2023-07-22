/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ConnectedUsersService 
{
    private readonly prisma = new PrismaClient();

    async create(socketId:string, userId:string)
    {
        return await this.prisma.connectedUsers.create({ // assing evry an socket id
            data: {
                socketId,
                user: { connect: { id: userId } },
            },
        });
          
    }
        

    async  getSocketIdsByUserId(userId: string) 
    {
        return  await this.prisma.connectedUsers.findMany({
            
            where: {
                userId,
            },
            select: {
                socketId: true,
            },
        });
        
    }

    async deleteSocketId(socketId:string)
    {
        return await this.prisma.connectedUsers.deleteMany({
            where: { socketId: socketId },
        });
    }

    
}
