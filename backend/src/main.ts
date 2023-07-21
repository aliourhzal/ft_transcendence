import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import SocketAdapter from './socket.adapter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useWebSocketAdapter(new SocketAdapter(app));
	app.use(cookieParser());
	app.enableCors({
		origin: 'http://127.0.0.1:3001',
		credentials: true
	})
	await app.listen(3000);
}
bootstrap();
