import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
  });
  app.setGlobalPrefix('api');

  await app.listen(3003);
  console.log('Gateway is running on http://localhost:3003');
}
bootstrap();