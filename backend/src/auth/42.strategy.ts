import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { PrismaClient } from '@prisma/client'
import { UsersService } from "src/users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Strategy42 extends PassportStrategy(Strategy, '42') {
	private prisma = new PrismaClient();

	constructor(private readonly usersService: UsersService) {
		super({
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL,
		})
	}
	extractUserData(profile: any, accessToken: string) {
		return ({
			intra_id: profile._json.id,
			email: profile._json.email,
			login: profile._json.login,
			firstName: profile._json.first_name,
			lastName: profile._json.last_name,
			profilePic: profile._json.image.link,
			wallet: profile._json.wallet,
			level: profile._json.cursus_users[1].level,
			grade: profile._json.cursus_users[1].grade,
			access_token: accessToken
		});
	}
	async validate(accessToken: string, refreshToken: string, profile: any, cb: Function) {
		const user = this.extractUserData(profile, accessToken);
		const storedUser = await this.usersService.findOneByIntraID(user.intra_id);
		console.log(user);
		if (!storedUser)
			await this.usersService.createNewUser(user);
		return cb(null, user);
	}
}