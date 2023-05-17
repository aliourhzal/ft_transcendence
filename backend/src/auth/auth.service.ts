import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor (private readonly jwtService: JwtService) {}

	public getTokenForUser(user: User): string {
		return (this.jwtService.sign({
			login: user.login,
			sub: user.id
		}));
	}
}
