import { Injectable } from '@nestjs/common';

import { DomainEvent } from '../../../DomainEvent';
import { IEventBus } from '../../IEventBus';

@Injectable()
export class EventBusMock implements IEventBus {
  private events: DomainEvent[] = [];

  public dispatch(events: DomainEvent[]): Promise<void> {
    this.events = events;

    return Promise.resolve();
  }

  public close(): Promise<void> {
    this.events = [];
    return Promise.resolve();
  }

  public getDispatchedEvents(): DomainEvent[] {
    return this.events;
  }

  public clean(): void {
    this.events = [];
  }
}
