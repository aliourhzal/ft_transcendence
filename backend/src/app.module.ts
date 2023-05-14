import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
