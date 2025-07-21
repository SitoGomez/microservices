import { EventStoredDTO } from '../eventStore/EventStoredDTO';

export interface IEventBus {
  publish(event: EventStoredDTO[]): Promise<void>;
  close(): Promise<void>;
}

export const EVENT_BUS = Symbol('EventBus');
