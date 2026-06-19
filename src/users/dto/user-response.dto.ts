import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '11111111-1111-1111-1111-111111111111',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({ example: 'testuser' })
  name: string;
}
