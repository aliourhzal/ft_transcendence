/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';



export class CreateUserDto {
     
    @IsNotEmpty()
    @IsString()
    roomName: string;
  
    @IsNotEmpty()
    @IsString()
    @IsOptional() 
    password?: string;
  
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true }) // Use "each" option to validate each element of the array as a string
    users: string[];
  
    @IsNotEmpty()
    @IsString()
    auth: string;
 
  }
 