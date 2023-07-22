/* eslint-disable prettier/prettier */
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor (private readonly authService: AuthService) {
        super()
    }

    // this function is called be the localStrategy
    async validate(username: string, password: string) {
        console.log("AAA");
        // authenticate the user
        const user = await this.authService.validateUser(username, password);
        console.log(user);
        // if the user does not exist or wrong password throw unauthorizedException
        if (!user)
            throw new UnauthorizedException()
        return user
    }
}