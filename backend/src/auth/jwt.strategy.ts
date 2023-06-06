import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    // this function is called by the jwt strategy after decoding the token: the payload is the object that contains the userid and nickname after the decoding
    async validate(payload: any) {
        return ({
            sub: payload.sub,
            username: payload.username
        });
    }
}