/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import { SendMessage } from 'src/dto/sendMessage.dto';

@Injectable()
export class WebSocketServiceService 
{
    emitMessageEvent(socket: Socket, user: any) {
        socket.emit('send-message', user);
      }
    
}
