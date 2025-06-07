import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../domain/DomainEvent';
import { IDomainEventManager } from '../domain/IDomainEventManager';

@Injectable()
export class InMemoryDomainEventManager implements IDomainEventManager {
  private events: DomainEvent[] = [];

  public register(event: DomainEvent): void {
    this.events.push(event);
  }

  public getRegisteredEvents(): DomainEvent[] {
    const events = this.events;

    this.clean();

    return events;
  }

  public clean(): void {
    this.events = [];
  }
}
