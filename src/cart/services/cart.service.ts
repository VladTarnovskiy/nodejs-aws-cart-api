import { Injectable } from '@nestjs/common';
import { UpdateCartDto } from '../dto';

import { Cart, CartItem, CartRow } from '../models';
import { CartRepository } from '../repositories';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async findByUserId(userId: string): Promise<Cart | undefined> {
    const cart = await this.findOpenCart(userId);

    if (!cart) {
      return undefined;
    }

    cart.items = await this.findCartItems(cart.id);

    return cart;
  }

  async createByUserId(userId: string): Promise<Cart> {
    const row = await this.cartRepository.create(userId);

    return { ...this.mapCart(row), items: [] };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      return existing;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, payload: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);

    if (payload.count === 0) {
      await this.cartRepository.deleteItem(cart.id, payload.product.id);
    } else {
      await this.cartRepository.upsertItem(
        cart.id,
        payload.product.id,
        payload.count,
        JSON.stringify(payload.product),
      );
    }

    await this.cartRepository.touch(cart.id);
    cart.items = await this.findCartItems(cart.id);

    return cart;
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.cartRepository.deleteOpenByUserId(userId);
  }

  async markAsOrdered(cartId: string): Promise<void> {
    await this.cartRepository.markAsOrdered(cartId);
  }

  private async findOpenCart(userId: string): Promise<Cart | undefined> {
    const row = await this.cartRepository.findOpenByUserId(userId);

    return row ? this.mapCart(row) : undefined;
  }

  private async findCartItems(cartId: string): Promise<CartItem[]> {
    const rows = await this.cartRepository.findItemsByCartId(cartId);

    return rows.map((row) => ({
      product: row.product,
      count: row.count,
    }));
  }

  private mapCart(row: CartRow): Cart {
    return {
      id: row.id,
      user_id: row.user_id,
      created_at: new Date(row.created_at).getTime(),
      updated_at: new Date(row.updated_at).getTime(),
      status: row.status,
      items: [],
    };
  }
}
