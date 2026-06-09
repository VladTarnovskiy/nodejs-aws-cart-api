import { Test, TestingModule } from '@nestjs/testing';
import { mockDatabaseServiceProvider } from '../database/mock-database.service';
import { CartController } from './cart.controller';
import { CartRepository } from './repositories';
import { CartService } from './services';
import { OrdersRepository } from '../order/repositories';
import { OrderService } from '../order/services';

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        CartRepository,
        OrderService,
        OrdersRepository,
        mockDatabaseServiceProvider,
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
