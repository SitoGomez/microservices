import { DomainEvent } from '../DomainEvent';

import { EventStoredDTO } from './EventStoredDTO';

export interface IEventsStore {
  save(events: DomainEvent[]): Promise<void>;
  getNextEventsToProcess(): Promise<EventStoredDTO[]>;
}

export const EVENTS_STORE = Symbol('EventsStore');
