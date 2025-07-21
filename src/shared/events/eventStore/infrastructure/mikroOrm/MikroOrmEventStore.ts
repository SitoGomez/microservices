import { EntityRepository } from '@mikro-orm/core';
import { Inject } from '@nestjs/common';

import {
  DATE_TIME_SERVICE,
  IDateTimeService,
} from '../../../../dateTimeService/domain/IDateTimeService';
import { DomainEvent } from '../../../DomainEvent';
import { EventStatusEnum } from '../../EventStatus.enum';
import { EventStoredDTO } from '../../EventStoredDTO';
import { IEventsStore } from '../../IEventsStore';
import { FromMikroOrmEventStoreEntityToEventStoreDTOEventMapper } from '../FromMikroOrmEventStoreEntityToEventStoreDTOEventMapper';

import { EventStoreEntity } from './entities/EventsStore.entity';

export class MikroOrmEventStore implements IEventsStore {
  public constructor(
    private readonly eventStoreRepository: EntityRepository<EventStoreEntity>,
    private readonly fromMikroOrmEventStoreEntityToEventStoreDTOEventMapper: FromMikroOrmEventStoreEntityToEventStoreDTOEventMapper,
    @Inject(DATE_TIME_SERVICE)
    private readonly dateTimeService: IDateTimeService,
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

  public async getNextEventsToProcess(): Promise<EventStoredDTO[]> {
    const currentDate = new Date(this.dateTimeService.now());
    const maxRetriesPerEvent = 3;

    const pendingEventsOrFailedEventsToBeProcessed =
      await this.eventStoreRepository.find({
        $or: [
          { eventStatus: EventStatusEnum.PENDING },
          {
            $and: [
              { eventStatus: EventStatusEnum.PENDING },
              { nextRetryAt: { $lte: currentDate } },
              { retryCount: { $lt: maxRetriesPerEvent } },
            ],
          },
        ],
      });

    return this.fromMikroOrmEventStoreEntityToEventStoreDTOEventMapper.map(
      pendingEventsOrFailedEventsToBeProcessed,
    );
  }

  public async markEventsAsProcessed(
    eventIds: EventStoredDTO['eventId'][],
  ): Promise<void> {
    if (eventIds.length === 0) {
      return;
    }

    const eventsToMarkAsProcessed = await this.getEventsByIds(eventIds);

    const currentDate = new Date(this.dateTimeService.now());

    const updatedEvents = eventsToMarkAsProcessed.map((event) => {
      event.eventStatus = EventStatusEnum.PROCESSED;
      event.processedAt = currentDate;
      return event;
    });

    this.eventStoreRepository.getEntityManager().persist(updatedEvents);
  }

  public async markEventsAsFailed(
    eventIds: EventStoredDTO['eventId'][],
  ): Promise<void> {
    if (eventIds.length === 0) {
      return;
    }

    const eventsToMarkAsFailed = await this.getEventsByIds(eventIds);

    const updatedEvents = eventsToMarkAsFailed.map((event) => {
      event.retryCount++;
      event.nextRetryAt = this.getNextRetryDate(event.retryCount);

      if (event.retryCount >= 3) {
        event.eventStatus = EventStatusEnum.FAILED;
        event.nextRetryAt = undefined;
      }

      return event;
    });

    this.eventStoreRepository.getEntityManager().persist(updatedEvents);
  }

  private getEventsByIds(
    eventIds: EventStoredDTO['eventId'][],
  ): Promise<EventStoreEntity[]> {
    return this.eventStoreRepository.find({ eventId: { $in: eventIds } });
  }

  //TODO: Extract max retries next retry date and this logic to a backoff system -> New class EventStored
  private getNextRetryDate(retryCount: number): Date {
    const delayInMilliseconds = Math.pow(5, retryCount) * 1000;
    const currentDate = new Date(this.dateTimeService.now());
    return new Date(currentDate.getTime() + delayInMilliseconds);
  }
}
