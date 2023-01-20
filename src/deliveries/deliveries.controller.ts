import { Controller, Get, Param } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get('delivery-options/:cep')
  async getCep(@Param('cep') cep: string) {
    return await this.deliveriesService.getDeliveryOptions(cep);
  }
}
