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

    async validateUser(nickname: string, pass: string) {
        const user = await this.userService.findOneByNickname(nickname);
        if (user && comparePasswd(pass, user.password))
        {
            const {password, ...result} = user;
            return (result);
        }
        return (null);
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user.id
        }
        return ({
            access_token: await this.jwtService.signAsync(payload)
        });
    }
}
