import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { prisma } from "src/app.module";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

    private logger: Logger = new Logger(LocalStrategy.name);

    public async validate(login: string, password: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                login
            }
        });

        if (!user) {
            this.logger.debug(`user ${login} not found`);
            throw new UnauthorizedException('userNotFound');
        }

        if (user.password !== password) {
            this.logger.debug(`Invalid credentials for user ${user.login}`);
            throw new UnauthorizedException('InvalidPasswd');
        }
        return (user);
    }
}