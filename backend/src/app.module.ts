/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { gateAwayModule } from './webSocket/web.module';
import { ChatModule } from './chat/chat.module';
import { UtilsService } from './utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { ApiTokenCheckMiddleware } from './api-token-check/api-token-check.middleware';
import { WebSocketServiceService } from './chat/web-socket-service/web-socket-service.service';


@Module({
  imports: [
    gateAwayModule, //socket module
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    ChatModule,
  ],
  controllers: [],
  providers: [UtilsService , JwtService, WebSocketServiceService],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(ApiTokenCheckMiddleware)
        .forRoutes({ path: '/rooms/send-message' , method: RequestMethod.POST } , { path: '/rooms/select-room' , method: RequestMethod.POST });
    }
  }