/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomType } from 'src/utils/userData.interface';



export class Unmute {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    @IsNotEmpty()
    @IsString()
    unmutedUserId: string;
 
}
 