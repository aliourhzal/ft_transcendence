import { Module } from "@nestjs/common";
import { myGateAway } from "./web.socket";
// import { SocketGateway } from "./web.socket";

@Module({
    providers: [myGateAway],
})
export class gateAwayModule {}