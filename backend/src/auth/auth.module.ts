import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy';
import { GoogleStrategy } from './google.stategy';
import { Intra42Strategy } from './42.strategy';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: process.env.AUTH_SECRET,
				signOptions: {
					expiresIn: '60m'
				}
			})
		})
	],
    controllers: [AuthController],
    providers: [LocalStrategy, AuthService, JwtStrategy, GoogleStrategy, Intra42Strategy]
})
export class AuthModule {}

/**
 * prisma client
 * import { PrismaClient } from '@prisma/client'
import { AuthService } from './auth/auth.service';
    const prisma = new PrismaClient()
 */