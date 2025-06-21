import { Controller, Get } from '@nestjs/common';
import { AppService } from './product.service';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'ping' })
  ping() {
    return { msg: 'pong from products_service' };
  }
}
