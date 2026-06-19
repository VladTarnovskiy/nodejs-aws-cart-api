import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: '33333333-3333-3333-3333-333333333333',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Product A' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Test product A' })
  @IsString()
  description: string;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsNumber()
  price: number;
}
