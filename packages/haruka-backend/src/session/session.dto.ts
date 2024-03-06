import { ApiProperty } from '@nestjs/swagger';

export class SessionRemoveDTO {
  @ApiProperty({ description: '需要移除的会话uuid' })
  uuid: string;
}
