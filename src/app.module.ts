import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiskService } from './disk.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env', '.env.default'] })],
  controllers: [AppController],
  providers: [AppService, DiskService],
})
export class AppModule {}
