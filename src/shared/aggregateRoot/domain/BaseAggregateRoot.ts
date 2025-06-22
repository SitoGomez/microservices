import { DomainEvent } from '../../events/DomainEvent';

export class BaseAggregateRoot {
  private events: DomainEvent[] = [];

  public registerEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  public getRegisteredEvents(): DomainEvent[] {
    const events = this.events;

    this.clean();

    return events;
  }

  private clean(): void {
    this.events = [];
  }
}
