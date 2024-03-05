import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GenerateTextVO, ModelListVO, PrePromptListVO } from './text.vo';
import { GenerateTextDTO } from './text.dto';
import { Response } from 'express';
import { TextService } from './text.service';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  // 获取模型列表
  @Get('model/list')
  @ApiResponse({ type: ModelListVO })
  async getModelList() {
    const list = await this.textService.getModelList();

    return list;
  }

  // 获取提示词预设方案列表
  @Get('preprompt/list')
  @ApiResponse({ type: PrePromptListVO })
  async getPrepromptList() {
    const list = await this.textService.getPrePromptList();

    return list;
  }

  // 生成文本
  @Post('generate/text')
  @ApiResponse({ type: GenerateTextVO })
  async generateText(@Body() body: GenerateTextDTO) {
    const text = await this.textService.generateText(body);

    return text;
  }
}
