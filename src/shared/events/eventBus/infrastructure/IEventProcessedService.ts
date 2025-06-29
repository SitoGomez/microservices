export interface IEventProcessedService {
  saveEventProcessed(eventId: string, eventType: string): Promise<void>;
  isEventProcessed(eventId: string, eventType: string): Promise<boolean>;
}

export const EVENT_PROCESSED_SERVICE = Symbol('EventProcessedService');
