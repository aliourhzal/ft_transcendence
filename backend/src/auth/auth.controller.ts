import { Controller, Post, Get, Request, UseGuards, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {

	constructor (private readonly AuthService: AuthService) {}

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req: any) {
        const {id, username, login, img, nickname } = req.user;
        return ({
            id,
            token: this.AuthService.getTokenForUser(req.user)
        });
    }

	@Get('profile')
	@UseGuards(AuthGuard('jwt'))
	async getProfile(@Request() req: any): Promise<User> {
		return (req.user)
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Request() req: any) {
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Request() req: any, @Response() res: any) {
		console.log('hello');
		if (!req.user)
			return 'no user from google'
		return res.redirect('http://127.0.0.1:3001').json(req.user);
	}

	@Get('42')
	@UseGuards(AuthGuard('42'))
	async intra42Auth(@Request() req: any) {
	}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	intra42AuthRedirect(@Request() req: any, @Response() res: any) {
		if (!req.user)
			return 'no user from google'
		res.cookie('accessToken', req.user.accessToken, {httpOnly: true});
		res.cookie('user_id', req.user.id, {httpOnly: true});
		return res.redirect('http://127.0.0.1:3001/profile');
	}
}
