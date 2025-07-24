import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { LOGGER, ILogger } from '../../../../logger/ILogger';
import { IMessageRelay, MESSAGE_RELAY } from '../../IMessageRelay';

@Injectable()
export class ProcessNextEventsScheduler {
  private readonly logger: ILogger;
  private readonly messageRelay: IMessageRelay;

  public constructor(
    @Inject(LOGGER) logger: ILogger,
    @Inject(MESSAGE_RELAY) messageRelay: IMessageRelay,
  ) {
    this.logger = logger;
    this.messageRelay = messageRelay;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async execute(): Promise<void> {
    this.logger.info('Executing ProcessNextEventsScheduler...');

    await this.messageRelay.processEvents();

    this.logger.info('ProcessNextEventsScheduler executed successfully.');
  }
}
