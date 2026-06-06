export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  id: string;
  user_id: string;
  created_at: number;
  updated_at: number;
  status: CartStatuses;
  items: CartItem[];
};

export interface CartRow {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  status: CartStatuses;
}

export interface CartItemRow {
  product_id: string;
  count: number;
  product: Product;
}
