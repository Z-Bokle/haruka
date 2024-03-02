import { Controller, Get } from '@nestjs/common';

@Controller('text')
export class TextController {
  constructor() {}

  @Get('qqq')
  async get() {
    return {
      message: 'Hello World',
      data: {
        name: 'John',
        age: 20,
      },
    };
  }
}
