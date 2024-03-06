import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import {
  SessionNotFoundException,
  UserNotFoundException,
} from 'src/exceptions/exceptions';
import { SessionRemoveDTO } from './session.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('list')
  async getSessionList(@Headers() headers: Request['headers']) {
    const userIdStr = headers['User-ID'];
    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    const userId = parseInt(userIdStr as string);

    const list = await this.sessionService.getSessionList(userId);

    return list;
  }

  @Post('create')
  async createSession(@Headers() headers: Request['headers']) {
    const userIdStr = headers['User-ID'];
    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    const userId = parseInt(userIdStr as string);

    const result = await this.sessionService.createSession(userId);
    return !!result;
  }

  @Post('remove')
  async removeSession(
    @Headers() headers: Request['headers'],
    @Body() body: SessionRemoveDTO,
  ) {
    const userIdStr = headers['User-ID'];
    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    const userId = parseInt(userIdStr as string);
    const uuid = body.uuid;
    const result = await this.sessionService.removeSession(userId, uuid);
    if (!result) {
      throw new SessionNotFoundException();
    }
    return result;
  }
}
