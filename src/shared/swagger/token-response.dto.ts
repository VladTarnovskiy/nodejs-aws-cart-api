import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ example: 'Basic', enum: ['Basic', 'Bearer'] })
  token_type: string;

  @ApiProperty({
    example: 'dGVzdHVzZXI6VEVTVF9QQVNTV09SRA==',
    description: 'Base64-encoded credentials for Basic auth',
  })
  access_token: string;
}
