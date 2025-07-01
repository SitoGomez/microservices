import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'processed_events' })
export class ProcessedEventEntity {
  public constructor(eventId: string, eventType: string, processedAt?: Date) {
    this.eventId = eventId;
    this.eventType = eventType;
    this.processedAt = processedAt;
  }

  @PrimaryKey({ fieldName: 'event_id', type: 'uuid' })
  public eventId: string;

  @Property({ fieldName: 'event_type', type: 'text' })
  public eventType: string;

  @Property({
    fieldName: 'processed_at',
    type: 'timestampz',
  })
  public processedAt: Date | undefined;
}
