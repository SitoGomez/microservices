import { DomainEvent } from '../../../../shared/domainEvent/domain/DomainEvent';

export interface IUserWasRegisteredEventData {
  userId: string;
  email: string;
  createdAt: Date;
}

export class UserWasRegisteredEvent extends DomainEvent<IUserWasRegisteredEventData> {
  private static readonly eventType = 'auth.UserWasRegistered';

  private constructor(
    public readonly causationId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {
    super({
      eventType: UserWasRegisteredEvent.eventType,
      data: {
        userId,
        email,
        createdAt,
      },
      entityId: userId,
      causationId,
    });
  }

  public static create(
    causationId: string,
    userId: string,
    email: string,
    createdAt: Date,
  ): UserWasRegisteredEvent {
    return new UserWasRegisteredEvent(causationId, userId, email, createdAt);
  }
}
