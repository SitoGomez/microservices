import { BaseAggregateRoot } from '../../../shared/aggregateRoot/domain/BaseAggregateRoot';
import { DomainEvent } from '../../../shared/domainEvent/domain/DomainEvent';

import { UserWasRegisteredEvent } from './events/UserWasRegistered.event';

export class User extends BaseAggregateRoot {
  private constructor(
    private userId: string,
    private email: string,
    private password: string,
    private createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  public static register(
    causationId: string,
    userId: string,
    email: string,
    password: string,
    currentTime: Date,
  ): User {
    const newUser = new User(userId, email, password, currentTime, currentTime);

    newUser.registerEvent(
      UserWasRegisteredEvent.create(causationId, userId, email, currentTime),
    );

    return newUser;
  }

  public static fromPrimitives(
    id: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(id, email, password, createdAt, updatedAt);
  }

  public releaseEvents(): DomainEvent[] {
    return this.getRegisteredEvents();
  }

  public getUserId(): string {
    return this.userId;
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
