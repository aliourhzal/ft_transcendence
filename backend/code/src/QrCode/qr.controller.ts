/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, ConflictException, Controller, ForbiddenException, Get, HttpCode, ImATeapotException, NotAcceptableException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { twoFactorAuth } from './qr.services';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { error } from 'console';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { AuthService } from 'src/auth/auth.service';

@Controller('qr')
export class QrController {

	constructor (
        private readonly twoFactorAuth: twoFactorAuth,
        private readonly userServices: UsersService,
        private readonly authService: AuthService

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

    @Post('TokenCheck')
    async verifyToekn(@Req() req: any, @Body('tokenCode') tok: string, @Res() response: Response)
    {
        const userId = req.cookies.userId;
        const user = await this.userServices.findOneById(userId);
        const valid = await this.twoFactorAuth.verifyCode(userId, tok);
        if (valid)
        {
            response.clearCookie("userId");
            const { access_token: jwt_access_token } = await this.authService.login(user);//*
            //create the cookie
            response.cookie('access_token', jwt_access_token);
            response.cookie('login', user.nickname);
            response.send({valid, nickname:user.nickname});
        }
        else
            response.send({valid, nickname:user.nickname}); // return true if tokn valid false otherwise
        // else
        //     throw new ImATeapotException("error wrong Token !!!");
    }
}