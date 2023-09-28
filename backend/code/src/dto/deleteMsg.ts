/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';



export class deleteMsg {
     
    @IsNotEmpty()
    @IsString()
    roomId: string;
  
    @IsNotEmpty()
    @IsString()
    msgId: string;
}
 