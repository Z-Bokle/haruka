import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GenerateTextVO, ModelListVO, PrePromptListVO } from './text.vo';
import { GenerateTextDTO, UpdateItemsDTO } from './text.dto';
import { TextService } from './text.service';
import { Request } from 'express';
import { UserNotFoundException } from 'src/exceptions/exceptions';

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
  @Post('generate')
  @ApiResponse({ type: GenerateTextVO })
  async generateText(
    @Body() body: GenerateTextDTO,
    @Headers() headers: Request['headers'],
  ) {
    const userIdStr = headers['User-ID'];
    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    const userId = parseInt(userIdStr as string);
    const sessionUUID = body.sessionUUID;
    const text = await this.textService.generateText(userId, sessionUUID);

    return text;
  }

  @Post('items/update')
  async updateItems(
    @Body() body: UpdateItemsDTO,
    @Headers() headers: Request['headers'],
  ) {
    const userIdStr = headers['User-ID'];
    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    const userId = parseInt(userIdStr as string);
    const result = await this.textService.updateItems(userId, body);
    return result;
  }
}
