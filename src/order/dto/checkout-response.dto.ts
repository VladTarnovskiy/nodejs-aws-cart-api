import { ApiProperty } from '@nestjs/swagger';

import { OrderResponseDto } from './order-response.dto';

export class CheckoutResponseDto {
  @ApiProperty({ type: OrderResponseDto })
  order: OrderResponseDto;
}
