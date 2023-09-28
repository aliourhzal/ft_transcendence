/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';




export class DirectMessages {
    @IsNotEmpty()
    @IsString()
    reciverUserId: string;
}
 



// 