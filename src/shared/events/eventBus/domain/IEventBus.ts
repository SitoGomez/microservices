import { DomainEvent } from '../../DomainEvent';

export interface IEventBus {
  dispatch(events: DomainEvent[]): Promise<void>;
  close(): Promise<void>;
}

export const EVENT_BUS = Symbol('EventBus');
