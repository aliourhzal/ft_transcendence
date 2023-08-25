/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';



export class SelectRoom {
     @IsNotEmpty()
    @IsString()
    roomId: string;

}
 