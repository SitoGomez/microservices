import { DomainEvent } from '../../../../shared/domainEvent/domain/DomainEvent';

export interface IUserLoggedData {
  userId: string;
  email: string;
}

export class UserLogged extends DomainEvent<IUserLoggedData> {
  private static readonly eventType = 'UserLogged';

  private constructor(
    public readonly causationId: string,
    public readonly userId: string,
    public readonly email: string,
  ) {
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
