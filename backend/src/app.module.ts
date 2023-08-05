import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { gateAwayModule } from './webSocket/web.module';
import { ChatModule } from './chat/chat.module';
import { InvitationsModule } from './invitations/invitations.module';


@Module({
  imports: [
    gateAwayModule, //socket module
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    ChatModule,
    InvitationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
