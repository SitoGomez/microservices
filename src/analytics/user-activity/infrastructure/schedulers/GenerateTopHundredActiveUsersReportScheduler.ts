import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger, LOGGER } from '../../../../shared/logger/ILogger';
import { IQueryBus, QUERY_BUS } from '../../../../shared/queryBus/IQueryBus';
import { GenerateTopHundredActiveUsersReportQuery } from '../../application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReportQuery';

@Injectable()
export class GenerateTopHundredActiveUsersReportScheduler {
  public constructor(
    @Inject(LOGGER) private readonly logger: ILogger,
    @Inject(QUERY_BUS) private readonly queryBus: IQueryBus,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
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
