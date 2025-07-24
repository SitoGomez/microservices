import { BaseAggregateRoot } from '../../../shared/aggregateRoot/domain/BaseAggregateRoot';
import { DomainEvent } from '../../../shared/events/DomainEvent';

import { UserRegistered } from './events/UserRegistered.event';

export class User extends BaseAggregateRoot {
  private userId: string;
  private email: string;
  private password: string;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(
    userId: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();

    this.userId = userId;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
      UserRegistered.create(causationId, userId, email, currentTime),
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
