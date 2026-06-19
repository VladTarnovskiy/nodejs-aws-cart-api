import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../database';
import { OrderRow, Order } from '../models';
import { CreateOrderPayload, OrderStatus } from '../type';

@Injectable()
export class OrdersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<OrderRow[]> {
    const result = await this.databaseService.query<OrderRow>(
      'SELECT id, user_id, cart_id, payment, delivery, comments, status, total FROM orders ORDER BY created_at DESC',
    );

    return result.rows;
  }

  async findAllByUserId(userId: string): Promise<OrderRow[]> {
    const result = await this.databaseService.query<OrderRow>(
      `SELECT id, user_id, cart_id, payment, delivery, comments, status, total
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    return result.rows;
  }

  async findByIdForUser(
    orderId: string,
    userId: string,
  ): Promise<OrderRow | undefined> {
    const result = await this.databaseService.query<OrderRow>(
      `SELECT id, user_id, cart_id, payment, delivery, comments, status, total
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId],
    );

    return result.rows[0];
  }

  async findById(orderId: string): Promise<OrderRow | undefined> {
    const result = await this.databaseService.query<OrderRow>(
      'SELECT id, user_id, cart_id, payment, delivery, comments, status, total FROM orders WHERE id = $1',
      [orderId],
    );

    return result.rows[0];
  }

  async create(data: CreateOrderPayload): Promise<OrderRow> {
    const result = await this.databaseService.query<OrderRow>(
      `INSERT INTO orders (user_id, cart_id, payment, delivery, comments, status, total)
       VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7)
       RETURNING id, user_id, cart_id, payment, delivery, comments, status, total`,
      [
        data.userId,
        data.cartId,
        JSON.stringify({ items: data.items }),
        JSON.stringify(data.address),
        data.address.comment ?? '',
        OrderStatus.Open,
        data.total,
      ],
    );

    return result.rows[0];
  }

  async checkout(data: CreateOrderPayload): Promise<OrderRow> {
    return this.databaseService.withTransaction(async (query) => {
      const orderResult = await query<OrderRow>(
        `INSERT INTO orders (user_id, cart_id, payment, delivery, comments, status, total)
         VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7)
         RETURNING id, user_id, cart_id, payment, delivery, comments, status, total`,
        [
          data.userId,
          data.cartId,
          JSON.stringify({ items: data.items }),
          JSON.stringify(data.address),
          data.address.comment ?? '',
          OrderStatus.Open,
          data.total,
        ],
      );

      const cartResult = await query(
        `UPDATE carts
         SET status = 'ORDERED', updated_at = now()
         WHERE id = $1 AND user_id = $2 AND status = 'OPEN'`,
        [data.cartId, data.userId],
      );

      if (cartResult.rowCount === 0) {
        throw new Error('Cart is not available for checkout');
      }

      return orderResult.rows[0];
    });
  }

  async update(orderId: string, data: Order): Promise<void> {
    await this.databaseService.query(
      `UPDATE orders
       SET payment = $2::jsonb, delivery = $3::jsonb, comments = $4, status = $5, total = $6
       WHERE id = $1`,
      [
        orderId,
        JSON.stringify({ items: data.items }),
        JSON.stringify(data.address),
        data.statusHistory?.[0]?.comment ?? '',
        data.statusHistory?.[0]?.status ?? OrderStatus.Open,
        0,
      ],
    );
  }
}
