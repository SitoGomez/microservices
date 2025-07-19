import { EventStoredDTO } from '../eventStore/EventStoredDTO';

export interface IMessageBrokerPublisher {
  publish(event: EventStoredDTO[]): Promise<void>;
}

export const MESSAGE_BROKER_PUBLISHER = Symbol('MessageBrokerPublisher');
