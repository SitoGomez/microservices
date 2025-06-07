import { DomainEvent } from '../domainEvent/domain/DomainEvent';

export interface IEventBus {
  dispatch(events: DomainEvent[]): Promise<void>;
}

export const EVENT_BUS = Symbol('EventBus');
