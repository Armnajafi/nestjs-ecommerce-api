import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'auth.request-otp' })
  requestOtp(data: { phone: string }) {
    return this.productService.(data.phone);
  }
}
