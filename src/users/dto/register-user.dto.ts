import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'yourGithubLogin', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'TEST_PASSWORD', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
