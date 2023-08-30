import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { QrController } from './qr.controller';
import { twoFactorAuth } from './qr.services';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [UsersModule, JwtModule],
    controllers: [QrController],
    providers: [twoFactorAuth],//what services do we want to be initialized/used within our module
    exports: []//what services do we want to be consumed by other modules
})

export class twoFactorAuths {}