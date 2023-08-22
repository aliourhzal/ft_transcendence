/* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-empty-function */
// /* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from 'src/users/users.service';
// import { RoomsService } from '../rooms/rooms.service';
// import { UtilsService } from 'src/utils/utils.service';
// import { MessagesService } from '../messages/messages.service';

// @Injectable()
// export class GatewayService 
// {
//     constructor(private readonly jwtService:JwtService, 
//         private readonly usersService:UsersService,
//         private readonly roomService:RoomsService,
//         private readonly utils:UtilsService,
//         private readonly messagesService:MessagesService
//         ){}

//     onConnected()
//     {
//         this.soketsId.push({userId : existingUser.existingUser[0], socketIds:socket.id})

//             const rooms = await this.utils.getRoomsForUser(existingUser.existingUser[0]); // all rooms who this user is member into it

//             let messages:any[] = [];

    
//             for(let i = 0; i < rooms.length; i++)
//             {
//                 messages.push({msg : await this.messagesService.getAllMessagesofRoom(rooms[i]['room']['room_name']) , room : rooms[i] , usersInRoom: await this.utils.getUserInfosInRoom(rooms[i].roomId)})
//             }
            
//             this.server.to(socket.id).emit("list-rooms",{messages});  //  evry client will connected will display the rooms who is member into 
//             return {ok : 'connected from chat'}

//     }


//     // async utilsFunction(socket: Socket , currentUserId :string , roomName ? :string , userId ?: string , flag?:number) // add flag for join room
//     //     {
//     //         let existingUser:any;
 
//     //         if(userId)
//     //         {
//     //             existingUser = await this.utils.getUserId([currentUserId  , userId]); // if both users in db
//     //         }
//     //         else
//     //         {
//     //             existingUser = await this.utils.getUserId([currentUserId]); // if current user in db
//     //         }

//     //         if(existingUser.error)
//     //         {
//     //             return existingUser;
//     //         } 

//     //         if(roomName) // if pass room name
//     //         {
//     //             const roomId = await this.utils.getRoomByName(roomName); 
                
//     //             if(roomId)  // if room exist
//     //             {
//     //                 const ifUsersInRoom = await this.utils.getUserType(roomId.id,existingUser.existingUser); // if both users in this room



//     //             }
//     //             else
//     //             {
//     //                 return {error : 'room not found'}
//     //             }
                
//     //         }
            
//     //         
//     //     }







    
// }
