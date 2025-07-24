import { DomainEvent } from '../../../../shared/events/DomainEvent';

export interface IUserLoggedData {
  userId: string;
  email: string;
}

export class UserLogged extends DomainEvent<IUserLoggedData> {
  private static readonly eventType = 'UserLogged';
  public readonly userId: string;
  public readonly email: string;

  private constructor(causationId: string, userId: string, email: string) {
    super({
      eventType: UserLogged.eventType,
      data: {
        userId,
        email,
      },
      entityId: userId,
      causationId,
    });
  }

  public static create(
    causationId: string,
    userId: string,
    email: string,
  ): UserLogged {
    return new UserLogged(causationId, userId, email);
  }
}
