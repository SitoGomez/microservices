import { BaseCommand } from '../../../../shared/commandBus/BaseCommand';

export class LoginUserCommand extends BaseCommand {
  public readonly email: string;
  public readonly password: string;

  public constructor(id: string, email: string, password: string) {
    super(id);

    this.email = email;
    this.password = password;
  }
}
