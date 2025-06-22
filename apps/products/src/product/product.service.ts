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

  async getProducts(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit; // Calculate the number of products to skip based on the current page

    // Fetch products from the database with pagination
    const products = await this.prisma.product.findMany({
      skip, // Number of products to skip
      take: limit, // Number of products to fetch
    });

    // Get the total number of products in the database
    const totalProducts = await this.prisma.product.count();

    // Return products along with pagination metadata
    return {
      products,
      totalProducts, // Total number of products available
      totalPages: Math.ceil(totalProducts / limit), // Calculate total pages based on limit
      currentPage: page, // Current page number
    };
  }
}
