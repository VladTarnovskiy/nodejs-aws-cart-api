import { ApiProperty } from '@nestjs/swagger';

import { AddressDto } from './address.dto';
import { OrderItemResponseDto } from './order-item-response.dto';
import { OrderStatusHistoryResponseDto } from './order-status-history-response.dto';

export class OrderResponseDto {
  @ApiProperty({
    example: '55555555-5555-5555-5555-555555555555',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: '11111111-1111-1111-1111-111111111111',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    example: '22222222-2222-2222-2222-222222222222',
    format: 'uuid',
  })
  cartId: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ type: AddressDto })
  address: AddressDto;

  @ApiProperty({ type: [OrderStatusHistoryResponseDto] })
  statusHistory: OrderStatusHistoryResponseDto[];
}
