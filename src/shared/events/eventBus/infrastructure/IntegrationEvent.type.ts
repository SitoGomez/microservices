export type IntegrationEvent<T = any> = {
  eventId: string;
  eventType: string;
  eventVersion: string;
  occurredAtTimestamp: number;
  entityId: string;
  causationId: string;
  data: T;
};
