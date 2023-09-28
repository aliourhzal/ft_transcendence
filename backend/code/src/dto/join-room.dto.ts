/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';



export class JoinRoomDto {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    @IsString()
    @IsOptional() 
    password?: string;
}
 