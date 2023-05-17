import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
	cors: {
		origin: 'http://127.0.0.1:3001',
		credentials: true
	}
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
