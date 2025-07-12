export type RabbitMQIntegrationEvent<T = any> = {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAtTimestamp: number;
  entityId: string;
  causationId: string;
  data: T;
  metadata: {
    integrationEventVersion: number;
    boundedContext: string;
  };
};
