import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from './user-response.dto';

export class ProfileResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
