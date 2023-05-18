import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-42';



@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, '42') {
	constructor() {
		super({
			clientID: 'u-s4t2ud-43dac9394f6be2d48afb01d79edfb84cea3cf8706b52215019fb77de84ea3e17',
			clientSecret: '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',
			callbackURL: "http://10.11.100.162:3000/auth/42/callback",
			scope: ['public'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		const {id, email, login, url, displayname, image} = profile._json;
		const user = {
			id,
			email,
			login,
			url,
			displayname,
			image: image.link,
			accessToken
		}
		done(null, user);
	}
}

