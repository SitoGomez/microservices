import { DomainEvent } from '../../../DomainEvent';
import { EventStoredDTO } from '../../EventStoredDTO';
import { IEventsStore } from '../../IEventsStore';

export class EventStoreMock implements IEventsStore {
  private stored: DomainEvent[] = [];
  private setToReturn: EventStoredDTO[] = [];

  public getStored(): DomainEvent[] {
    return this.stored;
  }

  public setToReturnEvents(events: EventStoredDTO[]): void {
    this.setToReturn = events;
  }

  public clean(): void {
    this.stored = [];
    this.setToReturn = [];
  }

  public async save(events: DomainEvent[]): Promise<void> {
    this.stored.push(...events);
    return Promise.resolve();
  }

  public async getNextEventsToProcess(): Promise<EventStoredDTO[]> {
    return Promise.resolve(this.setToReturn);
  }

  public async markEventsAsProcessed(
    _eventIds: EventStoredDTO['eventId'][],
  ): Promise<void> {
    return Promise.resolve();
  }

  public async markEventsAsFailed(
    _eventIds: EventStoredDTO['eventId'][],
  ): Promise<void> {
    return Promise.resolve();
  }
}
