import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested } from 'class-validator';

import { ProductDto } from './product.dto';

export class UpdateCartDto {
  @ApiProperty({ type: ProductDto })
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @ApiProperty({
    example: 2,
    minimum: 0,
    description: 'Set to 0 to remove the product from cart',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  count: number;
}
