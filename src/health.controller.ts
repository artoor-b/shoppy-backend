import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealtControler {
  @Get()
  health() {
    return true;
  }
}
