import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AddressDto } from './address.dto';

export class CheckoutOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
