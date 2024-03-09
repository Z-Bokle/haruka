import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import {
  SessionNotFoundException,
  UserNotFoundException,
} from 'src/exceptions/exceptions';
import { SessionGoBackDTO, SessionRemoveDTO } from './session.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('info')
  @ApiQuery({ name: 'sessionUUID', required: true })
  async getSessionInfo(
    @Headers() headers: Request['headers'],
    @Query('sessionUUID') sessionUUID: string,
  ) {
    const userIdStr = headers['User-ID'];
    if (!userIdStr) {
      throw new UserNotFoundException();
    }

    if (!sessionUUID) {
      throw new SessionNotFoundException();
    }

    const userId = parseInt(userIdStr as string);

    const session = await this.sessionService.findOne(sessionUUID, userId);

    if (!session) {
      throw new SessionNotFoundException();
    }

    return session;
  }

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
    return result;
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
    const uuid = body.sessionUUID;
    const result = await this.sessionService.removeSession(userId, uuid);
    if (!result) {
      throw new SessionNotFoundException();
    }
    return result;
  }

  @Post('goback')
  async goBack(
    @Headers() headers: Request['headers'],
    @Body() body: SessionGoBackDTO,
  ) {
    const userIdStr = headers['User-ID'];
    if (!userIdStr) {
      throw new UserNotFoundException();
    }
    const uuid = body.sessionUUID;

    const userId = parseInt(userIdStr as string);

    const result = await this.sessionService.sessionGoBack(userId, uuid);

    return result;
  }
}
