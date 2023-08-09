/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';



export class SendMessage {

    @IsNotEmpty()
    @IsString()
    roomName: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}
 