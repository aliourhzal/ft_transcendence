import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { prisma } from "src/app.module";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor () {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.AUTH_SECRET
		})
	}

	async validate(payload: any): Promise<User> {
		return (prisma.user.findUnique({
			where: {
				id: payload.sub
			}
		}));
	}
}