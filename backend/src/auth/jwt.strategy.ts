import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor () {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: JwtStrategy.extractJWT
        });
    }

    private static extractJWT(req: Request): string | null {
        if (
            req.cookies &&
            req.cookies.access_token &&
            req.cookies.access_token.length > 0
        ) {
          return req.cookies.access_token;
        }
        return null;
    }
    // this function is called by the jwt strategy after decoding the token: the payload is the object that contains the userid and nickname after the decoding
    async validate(payload: any) {
        return ({
            sub: payload.sub,
            nickname: payload.nickname
        });
    }
}