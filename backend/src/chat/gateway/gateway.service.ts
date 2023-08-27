/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from '../rooms/rooms.service';
import { UtilsService } from 'src/utils/utils.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class GatewayService 
{
    constructor(private readonly jwtService:JwtService, 
        private readonly usersService:UsersService,
        private readonly roomService:RoomsService,
        private readonly utils:UtilsService,
        private readonly messagesService:MessagesService
        ){}

 
            /*-------------------------------------------------when send join room use this utils function--------------------------------------------------------- */
        
        async checkOnAddNewUsers(currentUserId :string  , usersId : string[] , roomName  : string)
        {
            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInRoom = await this.utils.getUserType(roomInfos.id, [currentUserId]);

                if(ifUserInRoom.error)
                {
                    return {error : ifUserInRoom.error}
                }
                if(ifUserInRoom.usersType[0].userType !== 'USER')
                {
                    for(const userId of usersId)  
                    {
                        const isBanned = await this.utils.ifUserIsBanned(userId , roomInfos.id);

                        if(isBanned)
                        {
                            if(isBanned.isBanned !== 'UNBANNED') // if is banned make it not banned
                            {
                                await this.roomService.makeUserUnbanned(userId, roomInfos.id);
                                console.log('user unbanned')
                            }
                        }

                        const isMuted = await this.utils.isUserMuted(userId , roomInfos.id);
                        if(isMuted)
                        {
                            if(isMuted.isMuted !== 'UNMUTED') // if is muted make it not banned
                            {
                                await this.roomService.makeUserUnMuted(userId, roomInfos.id);
                                console.log('user unmuted')

                            }
                        }
                    } 
                    return { roomId: roomInfos , usersId};
                }
                else
                {
                    return {error : 'dont have the permmission to add users to this room.'}
                }
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */




        /*-------------------------------------------------when send join room use this utils function--------------------------------------------------------- */
        
        async checkOnJoinRoom(currentUserId :string , roomName  : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const isBanned = await this.utils.ifUserIsBanned(currentUserId , roomInfos.id);
                
                if(!isBanned) // if first time want to join tfhe room
                {
                    return {room : roomInfos  , currentUserId };
                }
                else // if this user is banned from the room and want to join another time
                {
                    if(isBanned.isBanned === 'BANNEDFORLIMMITED_TIME')
                    {
                        if (isBanned.banExpiresAt <= new Date()) // if ban Expire
                        {
                            await this.roomService.makeUserUnbanned(currentUserId, roomInfos.id); // make user unbanned
                            
                            console.log('user is unbanned.')
                            
                            return {room : roomInfos  , currentUserId };
                        }
                        return {error : 'you are banned for limmited time.'}
                        
                    }
                    else if(isBanned.isBanned === 'UNBANNED')
                        return {room : roomInfos  , currentUserId };
                    else
                        return {error : 'you are banned for forever.'}
                }
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */



        async checkUnMuteUser(currentUserId :string , roomName  : string, unmutedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , unmutedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , unmutedUserId ]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

                // check if user is muted , if its make it unmute
                 
                if(ifUserInroom.usersType[0].userType !== 'USER')
                {
                    const isMuted = await this.utils.isUserMuted(unmutedUserId , roomInfos.id);
                     
                    if(isMuted)
                    {
                        if(isMuted.isMuted !== 'UNMUTED') // if is muted make it not banned
                        {
                            const unMutedUser = await this.roomService.makeUserUnMuted(unmutedUserId, roomInfos.id);
                            console.log('user unmuted succsufuly')
                            return {room : roomInfos , unMutedUser}
                        }
                         
                    }
                    else
                    {
                        return {error : "user not muted."};
                    }
                }
                else
                {
                    return {error : 'dont have the permmission to add users to this room.'}
                }
                // return {room : roomInfos , ifUserInroom , currentUserId };
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        

        /*-------------------------------------------------when send mute user use this utils function--------------------------------------------------------- */
        
        async checkMuteUser(currentUserId :string , roomName  : string, bannedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , bannedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , bannedUserId ]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

                return {room : roomInfos , ifUserInroom , currentUserId };
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */




        /*-------------------------------------------------when send ban user use this utils function--------------------------------------------------------- */
        
        async checkBanUser(currentUserId :string , roomName  : string, bannedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , bannedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , bannedUserId ]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

                return {room : roomInfos , ifUserInroom , currentUserId };
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */


        /*-------------------------------------------------kick--------------------------------------------------------- */
        
        async checkKickUser(currentUserId :string , roomName  : string, kickedUserId : string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , kickedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , kickedUserId ]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

                return {room : roomInfos , ifUserInroom , currentUserId };
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        
        
        
        /*---------------------------------------------------------------------------------------------------------------------------------------- */



        /*-------------------------------------------------when send message use this utils function--------------------------------------------------------- */
        
        async checkSendMessage(currentUserId :string , roomId  :string)
        {
            const existingUser = await this.utils.getUserId([currentUserId]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoominfosById(roomId); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

            
                // check if user is muted or not

                const isMuted = await this.utils.isUserMuted(currentUserId, roomInfos.id);
                
                if(!isMuted) // if user is not in the black list table
                {
                    return {room : roomInfos , ifUserInroom , currentUserId };
                }
                else if(isMuted.isMuted === 'UNMUTED')
                {
                    return {room : roomInfos , ifUserInroom , currentUserId };
                }
                
                else if(isMuted.isMuted === 'MUTEDFORLIMITEDTIME')
                    return {error : 'user is muted for limmited time, cannot send message.'};                     
                
                return {error : 'user is muted for ever, cannot send message.'};                     
            }
            else 
            {
                return {error : 'room not found'}
            }

        }
        /*---------------------------------------------------------------------------------------------------------- */


        async checkLeave(currentUserId :string , roomName  :string)
        {
            const existingUser = await this.utils.getUserId([currentUserId]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

                return {room : roomInfos , ifUserInroom , currentUserId };
            }    
            else 
            {
                return {error : 'room not found'}
            }

        }


        async checkUpdateRoom(currentUserId :string , roomName  :string)
        {
            const existingUser = await this.utils.getUserId([currentUserId]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }
                if(ifUserInroom.usersType[0].userType  === 'USER' )
                {
                    return {error : 'dont have permmition.'}
                }

                return {room : roomInfos , ifUserInroom , currentUserId };
            }    
            else 
            {
                return {error : 'room not found'}
            }

        }

        async checkUserPromotion(currentUserId :string , roomName  : string , newAdminId:string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , newAdminId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , newAdminId]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }

            
                // check if user is muted remove the mute

                if(ifUserInroom.usersType[0].userType === 'OWNER')
                { 
                    const isMuted = await this.utils.isUserMuted(newAdminId , roomInfos.id);
                    
                    if(!isMuted)
                        return { roomInfos , ifUserInroom};

                    if(isMuted.isMuted !== 'UNMUTED')  
                    {
                        await this.roomService.makeUserUnMuted(newAdminId, roomInfos.id);
                    } 
                 
                    return { roomInfos , ifUserInroom};
                }
                else
                {
                    return {error : 'dont have the permmission to set an admin.'}
                }              
            }
            else 
            {
                return {error : 'room not found'}
            }

        }

        async checkUserDemote(currentUserId :string , roomName  : string , dmotedUserId:string)
        {
            const existingUser = await this.utils.getUserId([currentUserId , dmotedUserId ]); // if current user in db

            if(existingUser.error)
            {
                return {error : 'user not found.'};
            } 

            const roomInfos = await this.utils.getRoomByName(roomName); 

            if(roomInfos)  // if room exist
            {
                const ifUserInroom = await this.utils.getUserType(roomInfos.id , [currentUserId , dmotedUserId]); // if both users in this room
                
                if(ifUserInroom.error)
                {
                    return {error : ifUserInroom.error};
                }
                if(ifUserInroom.usersType[1].userType === 'USER')
                {
                    return {error : 'you are not admin.'}
                }
                return { roomInfos , ifUserInroom};
            }
            else 
            {
                return {error : 'room not found'}
            }
        }



        async checkDirectMessages(currentUserId :string  , reciverUserId : string , flag?:number)
        {
            let existingUser:any;

            if(!flag)
            {
                existingUser = await this.utils.getUserinfos([currentUserId , reciverUserId ]); // if current user in db
    
                if(existingUser.error)
                {
                    return {error : 'user not found.'};
                } 
    
                if(currentUserId === reciverUserId)
                    return {error : 'same user'}
            }
            const rtn = await this.roomService.createPrivateRoom(currentUserId ,reciverUserId)

            if(rtn.error)
            {
                return {error : rtn.error}
            }

            return {newDmRoom : rtn.newDmRoom ,existingUser };

             
            
            
        }
        

    
}
