/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { twoFactorAuth } from './qr.services';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';

@Controller('qr')
export class QrController {

	constructor (
        private readonly twoFactorAuth: twoFactorAuth,
        private readonly userServices: UsersService
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Get('code')
    showQR(@Req() req: any)
    {
        return this.twoFactorAuth.secreteGenerator(req.user.sub);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('codeCheck')
    async checkQr(@Req() req: any, @Body('token') tok: string)
    {
        console.log( await this.twoFactorAuth.verifyCode(req.user.sub, tok)); // return true if tokn valid false otherwise
    }

}