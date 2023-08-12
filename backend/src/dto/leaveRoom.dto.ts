/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoomType } from 'src/utils/userData.interface';



export class LeaveRoom {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
}
 