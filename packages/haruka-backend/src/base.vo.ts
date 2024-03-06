import { ApiProperty } from '@nestjs/swagger';

export class BaseVO {
  @ApiProperty({ description: '错误码', type: String })
  errorCode: number | string | null;

  @ApiProperty({ description: '错误信息', type: String })
  errorMessage: string | null;

  @ApiProperty({ description: '提示信息', type: String })
  message: string | null;

  @ApiProperty({ description: '时间戳', type: Number })
  timestamp: number;

  @ApiProperty({ description: '数据' })
  data: any;
}

export class BasePagingVO extends BaseVO {
  data: any[];

  @ApiProperty({ description: '总页数' })
  totalPage: number;

  @ApiProperty({ description: '当前页码' })
  currentPage: number;
}
