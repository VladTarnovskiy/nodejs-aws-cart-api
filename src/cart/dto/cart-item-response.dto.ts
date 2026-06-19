import { ApiProperty } from '@nestjs/swagger';

import { ProductDto } from './product.dto';

export class CartItemResponseDto {
  @ApiProperty({ type: ProductDto })
  product: ProductDto;

  @ApiProperty({ example: 2, minimum: 1 })
  count: number;
}
