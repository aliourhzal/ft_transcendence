/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';



export class AddNewUsersToRoom {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    @ArrayNotEmpty()
    @IsString({ each: true })
    users: string[];
}
 