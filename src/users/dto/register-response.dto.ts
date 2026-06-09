import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: '11111111-1111-1111-1111-111111111111',
    format: 'uuid',
  })
  userId: string;
}
