import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartRepository } from './repositories';
import { CartService } from './services';

@Module({
  imports: [OrderModule],
  providers: [CartRepository, CartService],
  controllers: [CartController],
})
export class CartModule {}
