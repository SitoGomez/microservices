import { EntityRepository } from '@mikro-orm/core';

import { DomainEvent } from '../../../DomainEvent';
import { EventStatusEnum } from '../../EventStatus.enum';
import { IEventsStore } from '../../IEventsStore';

import { EventStoreEntity } from './entities/EventsStore.entity';

export class MikroOrmEventStore implements IEventsStore {
  public constructor(
    private readonly eventStoreRepository: EntityRepository<EventStoreEntity>,
  ) {}

  public async save(events: DomainEvent[]): Promise<void> {
    const NEW_EVENT_STATUS = EventStatusEnum.PENDING;
    const NEW_EVENT_RETRY_COUNT = 0;

    const eventStoreEntities = events.map((event) => {
      const domainEventPrimitives = event.toPrimitives();

      return new EventStoreEntity(
        domainEventPrimitives.eventId,
        domainEventPrimitives.eventType,
        NEW_EVENT_STATUS,
        domainEventPrimitives.eventVersion,
        JSON.stringify(domainEventPrimitives),
        new Date(domainEventPrimitives.occurredAt),
        NEW_EVENT_RETRY_COUNT,
      );
    });

    await this.eventStoreRepository.insertMany(eventStoreEntities);
  }
}
