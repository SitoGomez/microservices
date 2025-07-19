import { Injectable } from '@nestjs/common';

import { ILogger } from '../../logger/ILogger';
import { IEventsStore } from '../eventStore/IEventsStore';
import { IMessageBrokerPublisher } from '../messageBrokerPublisher/IMessageBrokerPublisher';

import { IMessageRelay } from './IMessageRelay';

@Injectable()
export class MessageRelayProcess implements IMessageRelay {
  public constructor(
    private readonly eventStore: IEventsStore,
    private readonly messageBrokerPublisher: IMessageBrokerPublisher,
    private readonly logger: ILogger,
  ) {}

  public async processEvents(): Promise<void> {
    const eventsToProcess = await this.eventStore.getNextEventsToProcess();

    if (eventsToProcess.length === 0) {
      this.logger.info('No EVENTS to process in MessageRelayProcess.');
      return;
    }

    return this.messageBrokerPublisher.publish(eventsToProcess);
  }
}
