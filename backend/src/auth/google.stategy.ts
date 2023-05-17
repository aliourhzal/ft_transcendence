import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-google-oauth20'


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID: '621150742729-kivrto8m13focs86hsdbs6no925ro8up.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: "http://127.0.0.1:3000/auth/google/callback",
			scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		console.log('test');
		const {name, emails, photos} = profile;
		const user = {
			username: `${name.givenName} ${name.familyName}`,
			email: emails[0].value,
			img: photos[0].value,
			accessToken
		}
		done(null, user);
	}
}

