import { Injectable } from '@nestjs/common';

import { EventStoreEntity } from '../../eventStore/infrastructure/mikroOrm/entities/EventsStore.entity';
import { EventStoredDTO } from '../EventStoredDTO';

@Injectable()
export class FromMikroOrmEventStoreEntityToEventStoreDTOEventMapper {
  public constructor() {}

  public map(events: EventStoreEntity[]): EventStoredDTO[] {
    return events.map((event) => {
      return {
        eventId: event.eventId,
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        eventStatus: event.eventStatus,
        payload: event.payload,
        retryCount: event.retryCount,
        nextRetryAt: event.nextRetryAt,
        occurredAt: event.occurredAt,
        processedAt: event.processedAt,
      };
    });
  }
}
