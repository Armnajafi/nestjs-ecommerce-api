import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'product.get-product-by-id' })
  getProductById(@Payload() data: { id: string }) {
    return this.productService.getProductById(data.id);
  }

  @MessagePattern({ cmd: 'product.get-products' })
  getProducts(@Payload() data?: { page?: number; limit?: number }) {
    return this.productService.getProducts(data?.page || 1, data?.limit || 20);
  }

  @MessagePattern({ cmd: 'product.search-products' })
  searchProducts(
    @Payload()
    data: {
      keyword: string;
      page?: number;
      limit?: number;
    },
  ) {
    return this.productService.searchProducts(
      data.keyword,
      data.page || 1,
      data.limit || 20,
    );
  }

  @MessagePattern({ cmd: 'product.get-products-by-tag' })
  getProductsByTag(
    @Payload()
    data: {
      tagId: string;
      page?: number;
      limit?: number;
    },
  ) {
    return this.productService.getProductsByTag(
      data.tagId,
      data.page || 1,
      data.limit || 20,
    );
  }
}
