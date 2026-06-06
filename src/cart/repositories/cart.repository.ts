import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../database';
import { CartItemRow, CartRow } from '../models';

@Injectable()
export class CartRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOpenByUserId(userId: string): Promise<CartRow | undefined> {
    const result = await this.databaseService.query<CartRow>(
      `SELECT id, user_id, created_at, updated_at, status
       FROM carts
       WHERE user_id = $1 AND status = 'OPEN'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId],
    );

    return result.rows[0];
  }

  async create(userId: string): Promise<CartRow> {
    const result = await this.databaseService.query<CartRow>(
      `INSERT INTO carts (user_id, status)
       VALUES ($1, 'OPEN')
       RETURNING id, user_id, created_at, updated_at, status`,
      [userId],
    );

    return result.rows[0];
  }

  async findItemsByCartId(cartId: string): Promise<CartItemRow[]> {
    const result = await this.databaseService.query<CartItemRow>(
      'SELECT product_id, count, product FROM cart_items WHERE cart_id = $1',
      [cartId],
    );

    return result.rows;
  }

  async deleteItem(cartId: string, productId: string): Promise<void> {
    await this.databaseService.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId],
    );
  }

  async upsertItem(
    cartId: string,
    productId: string,
    count: number,
    product: string,
  ): Promise<void> {
    await this.databaseService.query(
      `INSERT INTO cart_items (cart_id, product_id, count, product)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET count = EXCLUDED.count, product = EXCLUDED.product`,
      [cartId, productId, count, product],
    );
  }

  async touch(cartId: string): Promise<void> {
    await this.databaseService.query(
      'UPDATE carts SET updated_at = now() WHERE id = $1',
      [cartId],
    );
  }

  async deleteOpenByUserId(userId: string): Promise<void> {
    await this.databaseService.query(
      "DELETE FROM carts WHERE user_id = $1 AND status = 'OPEN'",
      [userId],
    );
  }

  async markAsOrdered(cartId: string): Promise<void> {
    await this.databaseService.query(
      `UPDATE carts SET status = 'ORDERED', updated_at = now() WHERE id = $1`,
      [cartId],
    );
  }
}
