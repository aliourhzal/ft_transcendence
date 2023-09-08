/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, ConflictException, Controller, ForbiddenException, Get, HttpCode, ImATeapotException, NotAcceptableException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { twoFactorAuth } from './qr.services';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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
    async checkQr(@Req() req: any, @Body('token') tok: string, @Res() response: Response)
    {
        const valid = await this.twoFactorAuth.verifyCode(req.user.sub, tok); // return true if tokn valid false otherwise
        console.log(valid);
        if (valid)
            response.end("ok");
        else
            throw new ConflictException("error while enabling 2FA");
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('disable2FA')
    async disable2FA(@Req() req: any, @Res() response: Response)
    {
        try{
            await this.userServices.twoFactorOff(req.user.sub);
            response.end("ok");
        }
        catch(err)
        {
            throw new ConflictException("error while disabling 2FA");
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('active_or_not')
    async QrActivity(@Req() req: any)
    {
        const user = await this.userServices.findOneById(req.user.sub);
        return {twoFa:(user ? user.twoFactorAuth : undefined)};
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('TokenCheck')
    async verifyToekn(@Req() req: any, @Body('tokenCode') tok: string)
    {
        return {valid:await this.twoFactorAuth.verifyCode(req.user.sub, tok), nickname:req.user.nickname}; // return true if tokn valid false otherwise
        // else
        //     throw new ImATeapotException("error wrong Token !!!");
    }
}