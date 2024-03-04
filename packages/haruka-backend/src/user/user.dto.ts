import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  readonly userName: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  readonly password: string;
}
