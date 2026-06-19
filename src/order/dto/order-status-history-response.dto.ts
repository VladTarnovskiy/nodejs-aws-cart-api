import { ApiProperty } from '@nestjs/swagger';

import { OrderStatus } from '../type';

export class OrderStatusHistoryResponseDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.Open })
  status: OrderStatus;

  @ApiProperty({ example: 1710000000000 })
  timestamp: number;

  @ApiProperty({ example: 'Order created' })
  comment: string;
}
