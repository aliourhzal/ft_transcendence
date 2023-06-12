import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Req() request: any, @Res() response: Response) {
        response.end('ok');
    }   
}
