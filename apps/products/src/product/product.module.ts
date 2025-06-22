import { Module } from '@nestjs/common';
import { AppController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [ProductService],
})
export class AppModule {}
