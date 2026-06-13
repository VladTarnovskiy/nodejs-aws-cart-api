import { BadRequestException, Injectable } from '@nestjs/common';

import { Order, OrderRow } from '../models';
import { OrdersRepository } from '../repositories';
import { CreateOrderPayload, OrderStatus } from '../type';

@Injectable()
export class OrderService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getByUserId(userId: string): Promise<Order[]> {
    const rows = await this.ordersRepository.findAllByUserId(userId);

    return rows.map((row) => this.mapRow(row));
  }

  async getAll(): Promise<Order[]> {
    const rows = await this.ordersRepository.findAll();

    return rows.map((row) => this.mapRow(row));
  }

  async findByIdForUser(
    orderId: string,
    userId: string,
  ): Promise<Order | undefined> {
    const row = await this.ordersRepository.findByIdForUser(orderId, userId);

    return row ? this.mapRow(row) : undefined;
  }

  async findById(orderId: string): Promise<Order | undefined> {
    const row = await this.ordersRepository.findById(orderId);

    return row ? this.mapRow(row) : undefined;
  }

  async create(data: CreateOrderPayload): Promise<Order> {
    const row = await this.ordersRepository.create(data);

    return this.mapRow(row);
  }

  async checkout(data: CreateOrderPayload): Promise<Order> {
    try {
      const row = await this.ordersRepository.checkout(data);

      return this.mapRow(row);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Cart is not available for checkout'
      ) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  async update(orderId: string, data: Order): Promise<void> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    await this.ordersRepository.update(orderId, data);
  }

  private mapRow(row: OrderRow): Order {
    return {
      id: row.id,
      userId: row.user_id,
      cartId: row.cart_id,
      items: row.payment?.items ?? [],
      address: row.delivery ?? {
        address: '',
        firstName: '',
        lastName: '',
        comment: row.comments ?? '',
      },
      statusHistory: [
        {
          status: (row.status as OrderStatus.Open) ?? OrderStatus.Open,
          timestamp: Date.now(),
          comment: row.comments ?? '',
        },
      ],
    };
  }
}
