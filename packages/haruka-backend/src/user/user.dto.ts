import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  readonly userName: string;

  @ApiProperty()
  readonly password: string;
}
