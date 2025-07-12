import { DomainEvent } from '../DomainEvent';

export interface IEventsStore {
  save(events: DomainEvent[]): Promise<void>;
}

export const EVENTS_STORE = Symbol('EventsStore');
