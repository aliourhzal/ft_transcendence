import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { gateAwayModule } from './webSocket/web.module';


import { GatewayGateway } from './chat/gateway/gateway.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    gateAwayModule, //socket module
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
