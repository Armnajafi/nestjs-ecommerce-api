import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // گرفتن محصول با id
  async getProductById(productId: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          images: true,
          videos: true,
          discount: true,
          reviews: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Product Not Found');
      }

      // افزایش بازدید
      await this.prisma.view.create({
        data: {
          productId,
        },
      });

      // محاسبه قیمت تخفیف‌خورده اگر تخفیف دارد
      let finalPrice = product.price;
      if (product.discount && product.discount.percentage > 0) {
        finalPrice = Math.floor(
          product.price * (1 - product.discount.percentage / 100),
        );
      }

      return {
        ...product,
        finalPrice,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // گرفتن محصولات با pagination
  async getProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          images: true,
        },
      }),
      this.prisma.product.count(),
    ]);

    return {
      products,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  // جستجو در محصولات
  async searchProducts(keyword: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          images: true,
        },
      }),
      this.prisma.product.count({
        where: {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      products,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  // ساخت محصول
  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });
  }

  // ویرایش محصول
  async updateProduct(productId: string, data: Prisma.ProductUpdateInput) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });
  }

  // حذف محصول
  async deleteProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { success: true, message: 'Product deleted successfully.' };
  }

  // گرفتن محصولات بر اساس Tag
  async getProductsByTag(tagId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: {
          tags: {
            some: {
              tagId,
            },
          },
        },
        skip,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          images: true,
        },
      }),
      this.prisma.product.count({
        where: {
          tags: {
            some: {
              tagId,
            },
          },
        },
      }),
    ]);

    return {
      products,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
