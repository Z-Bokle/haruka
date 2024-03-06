import { Controller, Get, Headers, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import { UserNotFoundException } from 'src/exceptions/exceptions';

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
}
