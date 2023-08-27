/* eslint-disable prettier/prettier */

import { ArrayNotEmpty, IsNotEmpty, IsString } from "class-validator";




export class SetOtherAasAdministrators 
{
    @IsNotEmpty()
    @IsString()
    roomName:string;
 

    
    @IsNotEmpty()
    @IsString()
    newAdminId:string;

}