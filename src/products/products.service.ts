import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    const { name, description, price, imageUrl } = createProductDto;
    const categories = {
      create: createProductDto.categories.map((category) => {
        return {
          category: {
            connect: {
              id: category,
            },
          },
        };
      }),
    };

    return this.prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categories,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  async findOneByName(searchTerm: string) {
    let products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });

    if (!products || products.length === 0) {
      throw new HttpException(
        'Não foi possível encontrar produto com o nome informado.',
        HttpStatus.NOT_FOUND,
      );
    }

    return products.map((product) => {
      const { id, name, price } = product;
      return { id, name, price };
    });
  }

  async delete(id: number): Promise<any> {
    if (typeof id === 'string') {
      id = parseInt(id);
    }
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async findByCategoryName(categoryName: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      throw new HttpException(
        'Nenhuma categoria com o nome informado foi encontrada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const products = await this.prisma.product.findMany({
      where: {
        categories: {
          some: {
            categoryId: category.id,
          },
        },
      },
    });

    return products;
  }

  async findById(id: number) {
    if (typeof id === 'string') {
      id = parseInt(id);
    }

    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      throw new HttpException(
        'Nenhum produto encontrado com o id informado.',
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }
}
