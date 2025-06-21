import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async getProductById(productId: string) {
    const product = await this.prisma.Product.findUnique({
      where: { id: productId },
    });

    // Increment view count
    await this.prisma.Product.update({
      where: { id: productId },
      data: { views: { increment: 1 } }, // Assuming you have a views field
    });

    return product;
  }
}
