import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger, LOGGER } from '../../../../shared/logger/ILogger';
import { IQueryBus, QUERY_BUS } from '../../../../shared/queryBus/IQueryBus';
import { GetTopHundredActiveUsersQuery } from '../../application/GetTopHundredActiveUsers/GetTopHundredActiveUsersQuery';

@Injectable()
export class GetTopHundredActiveUsersScheduler {
  public constructor(
    @Inject(LOGGER) private readonly logger: ILogger,
    @Inject(QUERY_BUS) private readonly queryBus: IQueryBus,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  public async execute(): Promise<void> {
    this.logger.info('Executing GetTopHundredActiveUsersScheduler...');

    await this.queryBus.execute(new GetTopHundredActiveUsersQuery());

    this.logger.info(
      'GetTopHundredActiveUsersScheduler executed successfully.',
    );
  }
}
