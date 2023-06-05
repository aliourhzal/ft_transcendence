import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async logIn(@Request() request: any, @Res() response: Response) {
		const { access_token } = await this.authService.login(request.user);
		response.cookie('access_token', access_token);
		response.end('ok');
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async profile(@Request() request: any) {
		return (request.user);
	}

	@Get('42')
	@UseGuards(AuthGuard('42'))
	intra42Auth(){}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	async intra42AuthRedirect(@Request() request: any, @Res() response: Response) {
		response.cookie('access_token', request.user.access_token);
		const {access_token, ...user} = request.user;
		response.json(user);
		response.end();
	}
}
