import { Injectable } from '@nestjs/common';

import { RabbitMQIntegrationEvent } from '../../eventBus/infrastructure/rabbitMQ/RabbitMQIntegrationEvent.type';
import { EventStoreEntity } from '../../eventStore/infrastructure/mikroOrm/entities/EventsStore.entity';

@Injectable()
export class FromIntegrationEventToRabbitMQEventMapper {
  public constructor(private readonly boundedContext: string) {}

  public map(events: EventStoreEntity[]): RabbitMQIntegrationEvent[] {
    return events.map((event) => {
      interface ParsedEventData {
        entityId: string;
        causationId: string;
        data: unknown;
      }

      const data: ParsedEventData = JSON.parse(
        event.payload,
      ) as ParsedEventData;

      return {
        eventId: event.eventId,
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        occurredAtTimestamp: new Date(event.occurredAt).getTime(),
        entityId: data.entityId,
        causationId: data.causationId,
        data: data.data,
        metadata: {
          integrationEventVersion: event.eventVersion,
          boundedContext: this.boundedContext,
        },
      };
    });
  }
}
