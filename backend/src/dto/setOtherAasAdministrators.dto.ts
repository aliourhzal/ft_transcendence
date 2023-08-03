/* eslint-disable prettier/prettier */

import { ArrayNotEmpty, IsNotEmpty, IsString } from "class-validator";




export class SetOtherAasAdministrators 
{
    @IsNotEmpty()
    @IsString()
    roomName:string;

    @ArrayNotEmpty()
    @IsString({ each: true })
    users:string[];

    
    @IsNotEmpty()
    @IsString()
    auth:string;

}