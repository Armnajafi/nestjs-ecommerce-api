import { NestFactory } from '@nestjs/core';
import { AppModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
