import { DomainEvent } from '../../../../shared/events/DomainEvent';

export interface IUserWasRegisteredEventData {
  userId: string;
  email: string;
  createdAt: Date;
}

export class UserRegistered extends DomainEvent<IUserWasRegisteredEventData> {
  private static readonly eventType = 'UserRegistered';
  public readonly userId: string;
  public readonly email: string;

  private constructor(
    causationId: string,
    userId: string,
    email: string,
    public readonly createdAt: Date,
  ) {
    super({
      eventType: UserRegistered.eventType,
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
  ): UserRegistered {
    return new UserRegistered(causationId, userId, email, createdAt);
  }
}
