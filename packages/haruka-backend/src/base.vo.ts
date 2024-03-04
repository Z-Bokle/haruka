import { ApiProperty } from '@nestjs/swagger';

export class BaseVO {
  @ApiProperty({ description: '错误码' })
  errorCode: number | string | null;
  @ApiProperty({ description: '错误信息' })
  errorMessage: string | null;
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
