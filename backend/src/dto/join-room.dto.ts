/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';



export class JoinRoomDto {
     
    // constructor()
    // {
    //     console.log("object")
    // }
    // @IsNotEmpty()
    // @IsString()
    roomName: string;
  
    
    // @IsNotEmpty()
    // @IsString()
    auth: string;
    
    // @IsNotEmpty()
    // @IsString()
    socket: string;
 
  }
 