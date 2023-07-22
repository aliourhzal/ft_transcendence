/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { RoomsService } from './rooms/rooms.service';

@Module({
    imports: [JwtModule,UsersModule],
    providers: [GatewayGateway,RoomsService],

})
export class ChatModule {}