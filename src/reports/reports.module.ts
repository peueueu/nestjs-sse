import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { BullModule } from '@nestjs/bull';
import { ReportsJobService } from '../reports-job/reports-job.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'reports' })],
  providers: [ReportsService, ReportsJobService],
  controllers: [ReportsController],
})
export class ReportsModule {}
