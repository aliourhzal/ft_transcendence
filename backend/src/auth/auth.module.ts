import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    providers: [LocalStrategy]
})
export class AuthModule {}

/**
 * prisma client
 * import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()
 */