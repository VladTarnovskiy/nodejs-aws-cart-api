import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AddressDto } from './address.dto';

export class CheckoutOrderDto {
  @ApiProperty({ type: AddressDto, description: 'Delivery address' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
