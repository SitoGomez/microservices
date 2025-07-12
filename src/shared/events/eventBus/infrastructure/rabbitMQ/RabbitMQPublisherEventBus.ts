import { Injectable } from '@nestjs/common';
import { Envelope, Publisher } from 'rabbitmq-client';

import { ILogger } from '../../../../logger/ILogger';
import { DomainEvent } from '../../../DomainEvent';
import { IEventBus } from '../../IEventBus';
import { FromDomainToRabbitMQIntegrationEventMapper } from '../FromDomainToRabbitMQIntegrationEventMapper';

import { RabbitMQConnection } from './RabbitMQConnection';

@Injectable()
export class RabbitMQPublisherEventBus implements IEventBus {
  private publisher: Publisher | null = null;

  public constructor(
    private readonly boundedContextExchange: string,
    private readonly connection: RabbitMQConnection,
    private readonly fromDomainToIntegrationEventMapper: FromDomainToRabbitMQIntegrationEventMapper,
    private readonly logger: ILogger,
  ) {}

  public async dispatch(events: DomainEvent[]): Promise<void> {
    const publisher = await this.getPublisher();

    const integrationEvents = events.map((event) =>
      this.fromDomainToIntegrationEventMapper.map(event),
    );

    await Promise.all(
      integrationEvents.map((event) =>
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
