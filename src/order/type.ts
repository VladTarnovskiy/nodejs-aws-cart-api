export enum OrderStatus {
  Open = 'OPEN',
  Approved = 'APPROVED',
  Confirmed = 'CONFIRMED',
  Sent = 'SENT',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

export type Address = {
  address: string;
  firstName: string;
  lastName: string;
  comment: string;
};

export type CreateOrderPayload = {
  userId: string;
  cartId: string;
  items: Array<{ productId: string; count: number }>;
  address: Address;
  total: number;
};
