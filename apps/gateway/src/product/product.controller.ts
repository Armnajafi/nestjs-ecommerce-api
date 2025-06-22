import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  @Get('/product/:id') // Define the route with a parameter
  getProductById(@Param('id') id: string) {
    return this.productClient.send(
      { cmd: 'product.get-product-by-id' },
      { id },
    );
  }
}
