import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async processing(@Body() body: any): Promise<any> {
    console.log(JSON.stringify(body));
    const userId = body.session.user.user_id;
    const response = await this.appService.processRequest(userId, body);

    return response;
  }
}
