import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(name: string) {
    let product = await this.prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (!product) {
      throw new HttpException(
        'Não foi possível encontrar produto com o nome informado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return product;
  }
}
