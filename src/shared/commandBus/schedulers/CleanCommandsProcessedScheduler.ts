import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ILogger, LOGGER } from '../../logger/ILogger';
import { CleanCommandsProcessedProcess } from '../CleanCommandsProcessedProcess';

@Injectable()
export class CleanCommandsProcessedScheduler {
  private readonly logger: ILogger;
  private readonly cleanCommandsProcessedProcess: CleanCommandsProcessedProcess;

  public constructor(
    @Inject(LOGGER) logger: ILogger,
    cleanCommandsProcessedProcess: CleanCommandsProcessedProcess,
  ) {
    this.logger = logger;
    this.cleanCommandsProcessedProcess = cleanCommandsProcessedProcess;
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  public async execute(): Promise<void> {
    this.logger.info('Executing CleanCommandsProcessedScheduler...');

    await this.cleanCommandsProcessedProcess.cleanUpCommandsOlderThanSevenDays();

    this.logger.info('CleanCommandsProcessedScheduler executed successfully.');
  }
}
