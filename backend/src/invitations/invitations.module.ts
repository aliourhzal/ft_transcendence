import { Module } from '@nestjs/common';
import InvitationsGateway from './invitation.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        JwtModule,
        UsersModule
    ],
    providers: [
        InvitationsGateway,
    ],
})
export class InvitationsModule {}
