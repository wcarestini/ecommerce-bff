import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post()
  createCart(@Body() createCartDto: CreateCartDto) {}
}
