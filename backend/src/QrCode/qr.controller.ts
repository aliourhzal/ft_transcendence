/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';

import { twoFactorAuth } from './qr.services';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

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
    @Get('codeCheck')
    checkQr(@Req() req: any, @Body('token') tok: string)
    {
        return this.twoFactorAuth.verefyCode(req.user.sub, tok); // return true if tokn valid false otherwise
    }

}