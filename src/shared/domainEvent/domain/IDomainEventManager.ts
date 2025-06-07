import { DomainEvent } from './DomainEvent';

export interface IDomainEventManager {
  register(event: DomainEvent): void;
  getRegisteredEvents(): DomainEvent[];
  clean(): void;
}

export const DOMAIN_EVENT_MANAGER = Symbol('DomainEventManager');
