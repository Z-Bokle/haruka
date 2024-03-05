import { Controller, Get } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('list')
  async getSessionList() {
    const list = await this.sessionService.findAll();

    return list;
  }
}
