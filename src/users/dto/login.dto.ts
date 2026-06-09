import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'yourGithubLogin',
    description: 'Username (same as name used during registration)',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'TEST_PASSWORD' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
