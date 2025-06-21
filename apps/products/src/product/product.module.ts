import { Module } from '@nestjs/common';
import { AppController } from './product.controller';
import { AppService } from './product.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
