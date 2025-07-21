import { Injectable } from '@nestjs/common';
import { Envelope, Publisher } from 'rabbitmq-client';

import { ILogger } from '../../../../logger/ILogger';
import { EventStoredDTO } from '../../../eventStore/EventStoredDTO';
import { FromIntegrationEventToRabbitMQEventMapper } from '../../../messageRelay/infrastructure/FromIntegrationEventToRabbitMQEventMapper';
import { IEventBus } from '../../IEventBus';

import { RabbitMQConnection } from './RabbitMQConnection';

@Injectable()
export class RabbitMQEventBus implements IEventBus {
  private publisher: Publisher | null = null;

  public constructor(
    private readonly connection: RabbitMQConnection,
    private readonly boundedContextExchange: string,
    private readonly fromIntegrationEventToRabbitMQEventMapper: FromIntegrationEventToRabbitMQEventMapper,
    private readonly logger: ILogger,
  ) {}

  public async publish(events: EventStoredDTO[]): Promise<void> {
    const publisher: Publisher = await this.getPublisher();

    const rabbitMQEvents =
      this.fromIntegrationEventToRabbitMQEventMapper.map(events);

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
