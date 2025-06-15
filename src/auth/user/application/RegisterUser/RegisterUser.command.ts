import { BaseCommand } from '../../../../shared/commandBus/BaseCommand';

export class RegisterUserCommand extends BaseCommand {
  public constructor(
    public readonly userId: string,
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
