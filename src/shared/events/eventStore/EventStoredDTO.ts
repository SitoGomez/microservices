export interface EventStoredDTO {
  eventId: string;
  eventType: string;
  eventStatus: number;
  eventVersion: number;
  payload: string;
  retryCount: number;
  nextRetryAt?: Date;
  occurredAt: Date;
  processedAt?: Date;
}
