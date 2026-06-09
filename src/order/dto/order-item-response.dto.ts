import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({
    example: '33333333-3333-3333-3333-333333333333',
    format: 'uuid',
  })
  productId: string;

  @ApiProperty({ example: 2 })
  count: number;
}
