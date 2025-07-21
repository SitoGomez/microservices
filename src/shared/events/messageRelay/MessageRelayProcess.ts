import { Injectable } from '@nestjs/common';

import { ILogger } from '../../logger/ILogger';
import { IEventBus } from '../eventBus/IEventBus';
import { IEventsStore } from '../eventStore/IEventsStore';

import { IMessageRelay } from './IMessageRelay';

@Injectable()
export class MessageRelayProcess implements IMessageRelay {
  public constructor(
    private readonly eventStore: IEventsStore,
    private readonly eventBus: IEventBus,
    private readonly logger: ILogger,
  ) {}

  public async processEvents(): Promise<void> {
    const eventsToProcess = await this.eventStore.getNextEventsToProcess();

    if (eventsToProcess.length === 0) {
      this.logger.info('No EVENTS to process in MessageRelayProcess.');
      return;
    }

    return this.eventBus.publish(eventsToProcess);
  }
}
