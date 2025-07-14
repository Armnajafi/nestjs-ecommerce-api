import { Controller, Get, Inject, Param, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  @Get('/product/:id')
  getProductById(@Param('id') id: string) {
    return this.productClient.send(
      { cmd: 'product.get-product-by-id' },
      { id },
    );
  }

  @Post('search')
  searchProducts(
    @Body() body: { keyword?: string; page?: number; limit?: number },
  ) {
    const { keyword = '', page = 1, limit = 20 } = body;
    return this.productClient.send(
      { cmd: 'product.search-products' },
      { keyword, page, limit },
    );
  }
}
