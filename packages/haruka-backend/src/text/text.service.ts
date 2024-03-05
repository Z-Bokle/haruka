import { Injectable } from '@nestjs/common';
import { GenerateTextDTO } from './text.dto';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class TextService {
  constructor(private readonly taskService: TaskService) {}

  // 调用文本大模型生成文本
  async generateText(generateTextDTO: GenerateTextDTO) {
    console.log('dto: ', generateTextDTO);
    const text = await this.taskService.doTextTask(
      generateTextDTO.prompt,
      generateTextDTO.apiKey,
    );
    return text;
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
