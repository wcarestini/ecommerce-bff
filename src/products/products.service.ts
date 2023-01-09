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

  async findOne(name: string) {
    let product = await this.prisma.product
      .findMany({
        where: {
          name: {
            contains: name,
          },
        },
      })
      .then((products) => products[0]);

    if (!product) {
      throw new HttpException(
        'Não foi possível encontrar produto com o nome informado.',
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
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
}
