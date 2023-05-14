import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req: any) {
        const {id, username, login, img, nickname } = req.user;
        return ({
            id,
            username,
            login,
            img,
            nickname
        });
    }
}
