/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import SocketAdapter from './socket.adapter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({whitelist:true,
        forbidNonWhitelisted:true}));
	app.useWebSocketAdapter(new SocketAdapter(app));
	app.use(cookieParser());
	app.enableCors({
		origin: `${process.env.FRONT_HOST}`,
		credentials: true
	})
	await app.listen(3000);
}
bootstrap();
