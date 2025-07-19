import { Injectable } from '@nestjs/common';
import { Envelope, Publisher } from 'rabbitmq-client';

import { ILogger } from '../../logger/ILogger';
import { RabbitMQConnection } from '../eventBus/infrastructure/rabbitMQ/RabbitMQConnection';
import { IEventsStore } from '../eventStore/IEventsStore';

import { IMessageRelay } from './IMessageRelay';
import { FromIntegrationEventToRabbitMQEventMapper } from './infrastructure/FromIntegrationEventToRabbitMQEventMapper';

@Injectable()
export class MessageRelayProcess implements IMessageRelay {
  private publisher: Publisher | null = null;

  public constructor(
    private readonly eventStore: IEventsStore,
    private readonly fromIntegrationEventToRabbitMQEventMapper: FromIntegrationEventToRabbitMQEventMapper,
    private readonly boundedContextExchange: string,
    private readonly connection: RabbitMQConnection,
    private readonly logger: ILogger,
  ) {}

  public async processEvents(): Promise<void> {
    const eventsToProcess = await this.eventStore.getNextEventsToProcess();

    if (eventsToProcess.length === 0) {
      this.logger.info('No EVENTS to process in MessageRelayProcess.');
      return;
    }

    const publisher = await this.getPublisher();

    const rabbitMQEvents =
      this.fromIntegrationEventToRabbitMQEventMapper.map(eventsToProcess);

    await Promise.all(
      rabbitMQEvents.map((event) =>
        publisher.send(
          {
            contentType: 'application/json',
            persistent: true,
            durable: true,
            exchange: this.boundedContextExchange,
            routingKey: event.eventType,
            timestamp: event.occurredAtTimestamp,
          } as Envelope,
          event,
        ),
      ),
    );
  }

  private async getPublisher(): Promise<Publisher> {
    if (!this.publisher) {
      const connection = await this.connection.connect();
      this.publisher = connection.createPublisher();
    }

    return this.publisher;
  }

  public async close(): Promise<void> {
    await this.publisher?.close();
    this.publisher = null;

    this.logger.info('RabbitMQ CHANNEL closed');
  }
}
