/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';




export class KickUser {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    @IsNotEmpty()
    @IsString()
    kickedUserId: string;
}
 
