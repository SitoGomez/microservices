export interface DomainEventPrimitives<T = any> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  entityId: string;
  causationId: string;
  data: T;
}

export class DomainEvent<T = any> {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly eventVersion: number;
  public readonly occurredAt: string;
  public readonly entityId: string;
  public readonly causationId: string;
  public readonly data: T;

  protected constructor(params: {
    eventType: string;
    entityId: string;
    data: T;
    eventVersion?: number;
    causationId: string;
  }) {
    this.eventId = crypto.randomUUID();
    this.eventType = params.eventType;
    this.eventVersion = params.eventVersion ?? 1;
    this.occurredAt = new Date().toISOString();
    this.entityId = params.entityId;
    this.causationId = params.causationId;
    this.data = Object.freeze(params.data);
  }

  public static happenWhen<T>(params: {
    eventType: string;
    entityId: string;
    data: T;
    eventVersion?: number;
    causationId: string;
  }): DomainEvent<T> {
    return new DomainEvent<T>(params);
  }

  public toPrimitives(): DomainEventPrimitives<T> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      eventVersion: this.eventVersion,
      occurredAt: this.occurredAt,
      entityId: this.entityId,
      causationId: this.causationId,
      data: this.data,
    };
  }
}
