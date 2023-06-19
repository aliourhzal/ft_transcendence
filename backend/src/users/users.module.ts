import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    MulterModule.register({dest: './uploads'}),
    JwtModule.register({
			secret: process.env.JWT_SECRET
		})
  ],
  providers: [UsersService, AuthService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
