export interface IProcessedEventService {
  save(eventId: string, eventType: string): Promise<void>;
  isProcessed(eventId: string, eventType: string): Promise<boolean>;
}

export const PROCESSED_EVENT_SERVICE = Symbol('ProcessedEventService');
