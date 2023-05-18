import { Controller, Post, Get, Request, UseGuards, Response, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import axios from 'axios';

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
		return res.redirect(process.env.FRONT_HOST).json(req.user);
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
		res.cookie('accessToken', req.user.accessToken);
		res.cookie('user_id', req.user.id);
		return res.redirect(`${process.env.FRONT_HOST}/profile`);
	}

	@Get('user')
	async getUserData(@Query('id') id: String, @Query('accessToken') accessToken: String) {
		const {data: userData} = await axios.get(`${process.env.API_42}/v2/users/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
		console.log(userData);
		return (userData);
	}	
}
