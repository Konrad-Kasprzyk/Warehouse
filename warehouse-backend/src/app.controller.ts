import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'api: /employee /hall /shelf /product /productModel /task';
  }
}
