import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'product.get-product-by-id' })
  getProductById(data: { id: string }) {
    return this.productService.getProductById(data.id);
  }
}
