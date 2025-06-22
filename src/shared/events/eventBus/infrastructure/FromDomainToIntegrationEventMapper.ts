import { Injectable } from '@nestjs/common';

import { DomainEvent } from '../../DomainEvent';

import { RabbitMQIntegrationEvent } from './IntegrationEvent.type';

@Injectable()
export class FromDomainToRabbitMQIntegrationEventMapper {
  public constructor(private readonly boundedContext: string) {}

  public map<T>(event: DomainEvent<T>): RabbitMQIntegrationEvent<T> {
    return {
      eventId: event.eventId,
      eventType: `${this.boundedContext}.${event.eventType}`,
      eventVersion: 'v1',
      occurredAtTimestamp: new Date(event.occurredAt).getTime(),
      entityId: event.entityId,
      causationId: event.causationId,
      data: event.data,
    };
  }
}
