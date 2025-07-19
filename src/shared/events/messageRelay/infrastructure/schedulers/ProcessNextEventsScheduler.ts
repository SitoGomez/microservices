import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { LOGGER, ILogger } from '../../../../logger/ILogger';
import { IMessageRelay, MESSAGE_RELAY } from '../../IMessageRelay';

@Injectable()
export class ProcessNextEventsScheduler {
  public constructor(
    @Inject(LOGGER) private readonly logger: ILogger,
    @Inject(MESSAGE_RELAY) private readonly messageRelay: IMessageRelay,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async execute(): Promise<void> {
    this.logger.info('Executing ProcessNextEventsScheduler...');

    await this.messageRelay.processEvents();

    this.logger.info('ProcessNextEventsScheduler executed successfully.');
  }
}
