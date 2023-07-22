import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Sse,
  MessageEvent,
  Res,
  Render,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { Observable, defer, map, repeat, tap } from 'rxjs';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('view')
  @Render('reports')
  async view() {
    const reports = await this.reportsService.all();
    return { reports };
  }

  @Get()
  all() {
    return this.reportsService.all();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.reportsService.findOne(id);
  }

  @Post()
  request(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.request(createReportDto);
  }

  @Sse(':id/events')
  events(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() response: Response,
  ): Observable<MessageEvent> {
    return defer(() => this.reportsService.findOne(id)).pipe(
      repeat({
        delay: 1000,
      }),
      tap((report) => {
        if (report.status === 'DONE' || report.status === 'ERROR') {
          setTimeout(() => {
            response.end();
          }, 1000);
        }
      }),
      map((report) => ({ type: 'message', data: report })),
    );
  }
}
