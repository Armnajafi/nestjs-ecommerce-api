import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async getProductById(productId: string) {
    try {
      // get product by id
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      // get existance
      if (!product) {
        return { success: false, message: 'Product Not Found' };
      }

      // increment products views
      await this.prisma.productViews.upsert({
        where: { id: productId },
        update: { views: { increment: 1 }, lastUpdated: new Date() },
        create: { productId, views: 1 },
      });

      // return product in service output
      return product;
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Server Error' };
    }
  }
}
