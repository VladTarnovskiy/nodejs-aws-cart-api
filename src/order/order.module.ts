import { Module } from '@nestjs/common';

import { OrdersRepository } from './repositories';
import { OrderService } from './services';

@Module({
  providers: [OrdersRepository, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
