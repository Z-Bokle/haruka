import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { FileOversizeException } from 'src/exceptions/exceptions';

interface FileValidationPipeConfigs {
  maxSize: number;
  errorMessage?: string;
  fileField: string;
}

export class FileValidationPipe implements PipeTransform {
  constructor(configs: FileValidationPipeConfigs) {
    this.maxSize = configs.maxSize;
    this.errorMessage = configs.errorMessage;
    this.fileField = configs.fileField;
  }

  maxSize: number;
  errorMessage: string | undefined;
  fileField: string;

  transform(value: any, metaData: ArgumentMetadata) {
    if (metaData.type === 'body') {
      const file = value[this.fileField];
      console.log(Object.keys(value));
      if (file.size > this.maxSize) {
        throw new FileOversizeException(this.errorMessage);
      }
    }

    return value;
  }
}
