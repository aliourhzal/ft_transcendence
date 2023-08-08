/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from  'socket.io';
import { UsersService } from 'src/users/users.service';
import { UserData, roomAndUsers } from 'src/utils/userData.interface';
import { RoomsService } from '../rooms/rooms.service';
import { ConnectedUsersService } from '../connected-users/connected-users.service';

@WebSocketGateway()
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    
    constructor(private readonly jwtService:JwtService, 
        private readonly usersService:UsersService,
        private readonly roomService:RoomsService,
        private readonly connectedUsersService:ConnectedUsersService
        ){}

    @WebSocketServer()
    server:Server;
    
    user : UserData;
    
    socketOfcurrentUser:Socket
    
    async handleConnection(socket: Socket) 
    {
        try 
        {
            // connect to socket with jwt
            const decodeJWt =   this.jwtService.verify(socket.handshake.auth['token'],{ secret: process.env.JWT_SECRET })
    
            // verify the user
            const userInfos = await this.usersService.findOneByNickname(decodeJWt['nickname']);
    
            if(!userInfos)
            {
                this.OnWebSocektError(socket);
            }
            else
            { 
                // make this for entring chat in routes
                // console.log("connected")
                 
                this.user =  userInfos;

                this.socketOfcurrentUser = socket

                const idOfuser = await this.roomService.getUserIdByEmail(this.user.email);

                 
                const rooms = await this.roomService.getRoomsForUser(idOfuser); // all rooms who this user is member into it

                 
                await this.connectedUsersService.create(socket.id, idOfuser) // set evry client an (multi )socket id

                let listOfRoomsOfUser:string[] = [];

                for(let i = 0; i < rooms.length; i++)
                {
                    listOfRoomsOfUser.push(rooms[i]['room']['room_name']);
                }
                
                this.server.to(socket.id).emit("list-rooms",listOfRoomsOfUser);  //  evry client will connected will display the rooms who is member into it
            }
             
        } 
        catch (error) 
        {
            console.log("from error")
            this.OnWebSocektError(socket);
        }
    }
   
    @SubscribeMessage('create-room')  // after entred the in infos in create room form should reload the  page => this is bug
    async onCreateRoom(@MessageBody() roomandUsers: roomAndUsers) 
    {
        const idOfuser = await this.roomService.getUserIdByEmail(this.user.email)
        const ifUserExist = await this.roomService.getUsersId(idOfuser,roomandUsers.users)
         
        if(roomandUsers.roomName !== '' && ifUserExist) // if room name is not empty and users  exist
        {
            

            const rtn = await this.roomService.createRoom(roomandUsers, idOfuser); // return all the room who the admin is member into it
           
            // console.log(rtn)

            if(rtn === 1)
                this.server.to(this.socketOfcurrentUser.id).emit("error",` ${roomandUsers.roomName} room name is aleredy in use.`)
           
            if(rtn === 3)
                this.server.to(this.socketOfcurrentUser.id).emit("error",`you try to enter the admin`)
        
            if(rtn === 4)
                this.server.to(this.socketOfcurrentUser.id).emit("error",`the user is aleredy in this room.`)
            
            const adminRooms = await this.roomService.getRoomsForUser(idOfuser) // return all the room who the admin is member into it
    
            
            for(const room of adminRooms)
            {
                const usersInRooms = await this.roomService.getUsersInRooms(room.roomId) // return all users in evry room

                for(const usersInRoom of usersInRooms) // send to evry user the rooms who is member into it
                {
                    const sockerIds = await this.connectedUsersService.getSocketIdsByUserId(usersInRoom['userId']);
                    
                    for(const socketId of sockerIds)
                    {
                        this.server.to(socketId['socketId']).emit("rooms",room.room.room_name);
                    }
                }
            }

        }
    }

    @SubscribeMessage('chat')  // after entred the in infos in create room form should reload the  page => this is bug
    async displayRooms(@MessageBody() jwtAndSocketId: object) 
    {
        



        // const idOfuser = await this.roomService.getUserIdByEmail(this.user.email);

                 
        // const rooms = await this.roomService.getRoomsForUser(idOfuser); // all rooms who this user is member into it

         
        // await this.connectedUsersService.create(socket.id, idOfuser) // set evry client an (multi )socket id

        // let listOfRoomsOfUser:string[] = [];

        // for(let i = 0; i < rooms.length; i++)
        // {
        //     listOfRoomsOfUser.push(rooms[i]['room']['room_name']);
        // }
        
        // this.server.to(socket.id).emit("list-rooms",listOfRoomsOfUser); 
        

    }

    OnWebSocektError(socket:Socket)
    { 
        
        // console.log("disconnected")
        socket.emit("error", new UnauthorizedException());
        socket.disconnect();
    }


    async handleDisconnect(socket: Socket) {
        // console.log("disconnected");
        await this.connectedUsersService.deleteSocketId(socket.id);
        this.OnWebSocektError(socket);
    }

   
    
}
