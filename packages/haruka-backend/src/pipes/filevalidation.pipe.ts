import { PipeTransform } from '@nestjs/common';
import { FileOversizeException } from 'src/exceptions/exceptions';

export class FileValidationPipe implements PipeTransform {
  /**
   *
   * @param size 文件大小，单位B
   */
  constructor(size: number, errorMessage?: string) {
    this.size = size;
    this.errorMessage = errorMessage;
  }

  size: number;
  errorMessage: string | undefined;

  transform(value: any) {
    if (value.size > this.size) {
      // 大小超出，抛异常
      throw new FileOversizeException(this.errorMessage);
    } else {
      // 继续传递文件对象
      return value;
    }
  }
}
