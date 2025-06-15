import { Injectable } from '@nestjs/common';

import { DomainEvent } from '../domainEvent/domain/DomainEvent';

import { IEventBus } from './IEventBus';

@Injectable()
export class InMemoryEventBus implements IEventBus {
  private events: DomainEvent[] = [];

  public dispatch(events: DomainEvent[]): Promise<void> {
    this.events = events;

    return Promise.resolve();
  }

  public getDispatchedEvents(): DomainEvent[] {
    return this.events;
  }

  public clean(): void {
    this.events = [];
  }
}
