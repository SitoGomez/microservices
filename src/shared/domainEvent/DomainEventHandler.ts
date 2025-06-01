import { Injectable } from '@nestjs/common';
import { DomainEvent } from './DomainEvent';
import { IDomainEventManager } from './IDomainEventManager';

@Injectable()
export class DomainEventManager implements IDomainEventManager {
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
