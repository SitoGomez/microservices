import { IDomainEventManager } from 'src/shared/domainEvent/domain/IDomainEventManager';

import { DomainEvent } from '../../../shared/domainEvent/domain/DomainEvent';

import { UserWasRegisteredEvent } from './events/UserWasRegistered.event';

export class User {
  private constructor(
    private readonly domainEventHandler: IDomainEventManager,
    private id: string,
    private email: string,
    private password: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static register(
    domainEventHandler: IDomainEventManager,
    causationId: string,
    id: string,
    email: string,
    password: string,
    currentTime: Date,
  ): User {
    const newUser = new User(
      domainEventHandler,
      id,
      email,
      password,
      currentTime,
      currentTime,
    );

    newUser.domainEventHandler.register(
      UserWasRegisteredEvent.create(causationId, id, email, currentTime),
    );

    return newUser;
  }

  public static fromPrimitives(
    domainEventHandler: IDomainEventManager,
    id: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      domainEventHandler,
      id,
      email,
      password,
      createdAt,
      updatedAt,
    );
  }

  public releaseEvents(): DomainEvent[] {
    return this.domainEventHandler.getRegisteredEvents();
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
