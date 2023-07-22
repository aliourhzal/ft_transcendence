/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { comparePasswd } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor (
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}
    
    // this function fetch the user from the database by nickname and compare the password
    async validateUser(nickname: string, pass: string) {
        const user = await this.userService.findOneByNickname(nickname);
        if (user && comparePasswd(pass, user.password))
        {
            const {password, ...result} = user;
            return (result);
        }
        return (null);
    }

    // this function signs the jwt token
    async login(user: any) {
        const payload = {
            nickname: user.nickname,
            sub: user.id
        }
        return ({
            access_token: await this.jwtService.signAsync(payload)
        });
    }
}
