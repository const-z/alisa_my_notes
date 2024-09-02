import { Body, Controller, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { AlisaRequest } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async processing(@Body() body: AlisaRequest): Promise<any> {
    console.log(JSON.stringify(body));
    const userId = body.session.user.user_id;
    const response = await this.appService.processRequest({
      userId,
      value: body.request.nlu?.intents?.test_add_note?.slots?.note?.value,
      session: body.session,
      version: body.version,
    });

    return response;
  }
}
