/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import InvitationsGateway from './invitation.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { GatewayService } from 'src/chat/gateway/gateway.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
    imports: [
        JwtModule,
        UsersModule,
        ChatModule
    ],
    providers: [
        InvitationsGateway,
        
    ],
})
export class InvitationsModule {}
