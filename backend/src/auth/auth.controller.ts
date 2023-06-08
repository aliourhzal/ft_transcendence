import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	// this function is to be call in the frontend to authenticate the user with login and password,
	// the object passed with the request in the frontend should have the "username" and "password" properties
	@UseGuards(AuthGuard('local'))
	@Post('login')
	async logIn(@Request() request: any, @Res() response: Response) {
		// sign the jwt token that contains the user id and user nickname
		const { access_token } = await this.authService.login(request.user);
		//set the cookie
		response.cookie('access_token', access_token);
		response.end('ok');
	}

	//direct you to the 42 authorize page
	@Get('42')
	@UseGuards(AuthGuard('42'))
	intra42Auth(){}

	// this is the callback url provided to the 42 oauth contains all 42_user data (login, wallet, ...)
	@Get('42/callback')
	@UseGuards(AuthGuard('42'))//this authGuard will call the 42 stategy in 42.strategy.ts file
	async intra42AuthRedirect(@Request() request: any, @Res() response: Response)
	{//request contains user_data, response used to bake cookies
		// pass the user data to the function that signs the jwt token
		const { access_token: jwt_access_token } = await this.authService.login(request.user);
		//create the cookie
		response.cookie('access_token', jwt_access_token);
		// to ridrect the user to the profile page
		response.redirect(`${process.env.FRONT_HOST}/profile`);
	}
}
