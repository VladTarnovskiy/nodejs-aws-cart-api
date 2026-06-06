import { Type } from 'class-transformer';
import { IsInt, Min, ValidateNested } from 'class-validator';

import { ProductDto } from './product.dto';

export class UpdateCartDto {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  count: number;
}
