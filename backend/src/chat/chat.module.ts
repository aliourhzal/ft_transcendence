/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { RoomsService } from './rooms/rooms.service';
import { ConnectedUsersService } from './connected-users/connected-users.service';
import { RoomController } from './rooms/room.controller';
import { UtilsService } from 'src/utils/utils.service';
import { MessagesService } from './messages/messages.service';

@Module({
    imports: [JwtModule,UsersModule],
    providers: [GatewayGateway,RoomsService,ConnectedUsersService,UtilsService,MessagesService],
    controllers: [RoomController]

})
export class ChatModule {}