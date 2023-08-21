/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomType } from 'src/utils/userData.interface';



export class Mute {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    @IsNotEmpty()
    @IsString()
    mutedUserId: string;

    @IsNotEmpty()
    @IsNumber()
    duration:number;   
}
 