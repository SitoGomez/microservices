import { DomainEvent } from '../DomainEvent';

import { EventStoredDTO } from './EventStoredDTO';

export interface IEventsStore {
  save(events: DomainEvent[]): Promise<void>;
  getNextEventsToProcess(): Promise<EventStoredDTO[]>;
  markEventsAsProcessed(eventIds: EventStoredDTO['eventId'][]): Promise<void>;
  markEventsAsFailed(eventIds: EventStoredDTO['eventId'][]): Promise<void>;
}

export const EVENTS_STORE = Symbol('EventsStore');
