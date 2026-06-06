import { Address, OrderStatus } from '../type';

export type Order = {
  id?: string;
  userId: string;
  items: Array<{ productId: string; count: number }>;
  cartId: string;
  address: Address;
  statusHistory: Array<{
    status: OrderStatus.Open;
    timestamp: number;
    comment: string;
  }>;
};

export interface OrderRow {
  id: string;
  user_id: string;
  cart_id: string;
  payment: { items?: Array<{ productId: string; count: number }> } | null;
  delivery: Address | null;
  comments: string | null;
  status: string;
  total: string;
}
