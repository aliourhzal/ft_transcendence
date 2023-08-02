import { Module } from "@nestjs/common";
import { myGateAway } from "./web.socket";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
// import { SocketGateway } from "./web.socket";

@Module({
    imports: [
        JwtModule,
        UsersModule
    ],
    providers: [myGateAway, UsersService],
})
export class gateAwayModule {}