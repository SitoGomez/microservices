import { DomainEvent } from '../../../DomainEvent';
import { IEventsStore } from '../../IEventsStore';

export class EventStoreMock implements IEventsStore {
  private stored: DomainEvent[] = [];

  public getStored(): DomainEvent[] {
    return this.stored;
  }

  public clean(): void {
    this.stored = [];
  }

  public async save(events: DomainEvent[]): Promise<void> {
    this.stored.push(...events);
    return Promise.resolve();
  }
}
