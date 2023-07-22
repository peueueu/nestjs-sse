import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
import { CreateReportDto } from './dtos/create-report.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('reports')
    private readonly reportsQueue: Queue,
  ) {}

  all() {
    return this.prisma.report.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.report.findUnique({
      where: {
        id,
      },
    });
  }

  async request(createReportDto: CreateReportDto) {
    const report = await this.prisma.report.create({
      data: {
        filename: createReportDto.filename,
        status: Status.PENDING,
      },
    });

    await this.reportsQueue.add({ reportId: report.id });

    return report;
  }

  async produce(reportId: number) {
    await sleep(Math.random() * 10000);

    await this.prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: Status.PROCESSING,
      },
    });

    await sleep(Math.random() * 10000);

    const randomStatus = Math.random() > 0.5 ? Status.DONE : Status.ERROR;

    await this.prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        filename:
          randomStatus === Status.DONE ? `report-${reportId}.pdf` : null,
        status: randomStatus,
      },
    });
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
