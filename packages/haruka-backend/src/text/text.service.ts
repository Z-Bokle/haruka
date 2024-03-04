import { Injectable } from '@nestjs/common';
import { GenerateTextDTO } from './text.dto';

@Injectable()
export class TextService {
  constructor() {}

  // 生成文本
  async generateText(generateTextDTO: GenerateTextDTO) {
    console.log(generateTextDTO);
    return 'Hello World!';
  }

  // 查找模型列表
  async getModelList() {
    return [];
  }

  // 查找提示词预设方案列表
  async getPrePromptList() {
    return [];
  }
}
