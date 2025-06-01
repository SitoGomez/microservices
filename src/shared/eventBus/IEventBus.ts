import { DomainEvent } from '../domainEvent/DomainEvent';

export interface IEventBus {
  dispatch(events: DomainEvent[]): Promise<void>;
}

export const EVENT_BUS = Symbol('EventBus');
