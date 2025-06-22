import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Envelope, Publisher } from 'rabbitmq-client';

import { DomainEvent } from '../../../DomainEvent';
import { IEventBus } from '../../domain/IEventBus';
import { FromDomainToRabbitMQIntegrationEventMapper } from '../FromDomainToIntegrationEventMapper';

import { RabbitMQConnection } from './RabbitMQConnection';

@Injectable()
export class RabbitMQPublisherEventBus implements IEventBus, OnModuleDestroy {
  private publisher: Publisher | null = null;

  public constructor(
    private readonly boundedContextExchange: string,
    private readonly connection: RabbitMQConnection,
    private readonly fromDomainToIntegrationEventMapper: FromDomainToRabbitMQIntegrationEventMapper,
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

  /**
   * @internal DONT USE THIS METHOD DIRECTLY, ITS FOR NEST JS MODULE LIFECYCLE
   */
  public async onModuleDestroy(): Promise<void> {
    await this.publisher?.close();
  }
}
