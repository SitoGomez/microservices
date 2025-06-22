export class DomainEvent<T = any> {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly eventVersion: string;
  public readonly occurredAt: string;
  public readonly entityId: string;
  public readonly causationId: string;
  public readonly data: T;

  protected constructor(params: {
    eventType: string;
    entityId: string;
    data: T;
    eventVersion?: string;
    causationId: string;
  }) {
    this.eventId = crypto.randomUUID();
    this.eventType = params.eventType;
    this.eventVersion = params.eventVersion ?? 'v1';
    this.occurredAt = new Date().toISOString();
    this.entityId = params.entityId;
    this.causationId = params.causationId;
    this.data = Object.freeze(params.data);
  }

  public static happenWhen<T>(params: {
    eventType: string;
    entityId: string;
    data: T;
    eventVersion?: string;
    causationId: string;
  }): DomainEvent<T> {
    return new DomainEvent<T>(params);
  }
}
