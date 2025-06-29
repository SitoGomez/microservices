import { BaseCommand } from '../../../../shared/commandBus/BaseCommand';

export class RegisterUserCommand extends BaseCommand {
  public constructor(
    id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    super(id);
  }
}
