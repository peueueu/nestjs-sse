import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReportsService } from 'src/reports/reports.service';

@Processor('reports')
export class ReportsJobService {
  constructor(private readonly reportsService: ReportsService) {}

  @Process()
  produce(job: Job<{ reportId: number }>) {
    this.reportsService.produce(job.data.reportId);
    return {};
  }
}
