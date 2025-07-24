import { BaseCommand } from '../../../../shared/commandBus/BaseCommand';

export class RegisterUserCommand extends BaseCommand {
  public readonly userId: string;
  public readonly email: string;
  public readonly password: string;

  public constructor(
    id: string,
    userId: string,
    email: string,
    password: string,
  ) {
    super(id);
    this.userId = userId;
    this.email = email;
    this.password = password;
  }
}
