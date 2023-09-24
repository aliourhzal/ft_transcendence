/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoomType } from 'src/utils/userData.interface';



export class createRoom {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    // @IsNotEmpty()
    @IsString()
    @IsOptional() 
    password?: string;
  
    @ArrayNotEmpty()
    @IsString({ each: true })
    users: string[];
 
  
    @IsNotEmpty()
    @IsString()
    type: RoomType;
}
 