import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger, LOGGER } from '../../../../shared/logger/ILogger';
import { IQueryBus, QUERY_BUS } from '../../../../shared/queryBus/IQueryBus';
import { GenerateTopHundredActiveUsersReportQuery } from '../../application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReportQuery';

@Injectable()
export class GenerateTopHundredActiveUsersReportScheduler {
  private readonly logger: ILogger;
  private readonly queryBus: IQueryBus;

  public constructor(
    @Inject(LOGGER) logger: ILogger,
    @Inject(QUERY_BUS) queryBus: IQueryBus,
  ) {
    this.logger = logger;
    this.queryBus = queryBus;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async execute(): Promise<void> {
    this.logger.info(
      'Executing GenerateTopHundredActiveUsersReportScheduler...',
    );

    await this.queryBus.execute(new GenerateTopHundredActiveUsersReportQuery());

    this.logger.info(
      'GenerateTopHundredActiveUsersReportScheduler executed successfully.',
    );
  }
}
