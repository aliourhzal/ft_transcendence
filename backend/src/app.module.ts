/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { gateAwayModule } from './webSocket/web.module';
import { ChatModule } from './chat/chat.module';
import { UtilsService } from './utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { InvitationsModule } from './invitations/invitations.module';
import { twoFactorAuths } from './QrCode/qr.module';


@Module({
  imports: [
    gateAwayModule, //socket module
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    ChatModule,
    InvitationsModule,
    twoFactorAuths
  ],
  controllers: [],
  providers: [UtilsService , JwtService],
})
export class AppModule {}
