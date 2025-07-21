import { Entity, Property, types } from '@mikro-orm/core';

@Entity({ tableName: 'outbox_events' })
export class EventStoreEntity {
  @Property({ primary: true, type: types.uuid })
  public eventId: string;

  @Property({ type: types.text })
  public eventType: string;

  @Property({ type: types.smallint })
  public eventStatus: number;

  @Property({ type: types.smallint })
  public eventVersion: number;

  @Property({ type: types.json })
  public payload: string;

  @Property({ type: types.integer, default: 0 })
  public retryCount: number;

  @Property({ type: types.datetime, nullable: true })
  public nextRetryAt?: Date;

  @Property({ type: types.datetime })
  public occurredAt: Date;

  @Property({ type: types.datetime, nullable: true })
  public processedAt?: Date;

  public constructor(
    eventId: string,
    eventType: string,
    eventStatus: number,
    eventVersion: number,
    payload: string,
    occurredAt: Date,
    retryCount?: number,
    nextRetryAt?: Date,
    processedAt?: Date,
  ) {
    this.eventId = eventId;
    this.eventType = eventType;
    this.eventStatus = eventStatus;
    this.eventVersion = eventVersion;
    this.payload = payload;
    this.retryCount = retryCount ?? 0;
    this.nextRetryAt = nextRetryAt;
    this.occurredAt = occurredAt;
    this.processedAt = processedAt;
  }
}
