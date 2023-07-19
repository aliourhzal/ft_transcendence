import { Body, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'

@WebSocketGateway(3003, { cors: true } ) //tell's the class that it using socket not http and use the port 3003 instead of default one 3000
export class myGateAway implements OnModuleInit
{
    @WebSocketServer()
    server:Server;

    onModuleInit()//directly after a client connect to the socket do :
    {
        //connect or connection both works
        this.server.on('connect', (socket) => {
            console.log("socker ID: " + socket.id);
            console.log('connected successfuly to webSocket');
        });
    }

    @SubscribeMessage('newMessageAsalek') //get events in websocket protocol
    onNewMessage(@MessageBody() messageContent: any)// once the subscribeMessage event triggerd log the recieved message
    {
        console.log(messageContent);
        this.server.emit('onMessage', { //when ever a newMessageAsalek event triggers send back an event 'onMessage' object
            msg: 'new message resend',
            content: messageContent,
        });
    }
}