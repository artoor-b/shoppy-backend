/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { promises as fs } from 'fs';
import { Injectable } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { cwd } from 'process';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    return this.prismaService.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getProducts() {
    const products = await this.prismaService.product.findMany();

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    );
  }

  private async imageExists(productId: number) {
    try {
      await fs.access(
        join(process.cwd(), `public/products/${productId}.jpg`),
        fs.constants.F_OK,
      );
      return true;
    } catch (err) {
      return false;
    }
  }
}
