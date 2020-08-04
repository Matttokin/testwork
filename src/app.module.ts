import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelController } from './excel/excel.controller';


@Module({
  imports: [],
  controllers: [AppController, ExcelController],
  providers: [AppService],
})
export class AppModule {}
