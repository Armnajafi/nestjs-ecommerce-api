import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  @Get('ping')
  async ping(): Promise<unknown> {
    return this.productsClient.send({ cmd: 'ping' }, {}).toPromise();
  }
}
