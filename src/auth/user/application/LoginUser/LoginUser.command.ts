import { BaseCommand } from '../../../../shared/commandBus/BaseCommand';

export class LoginUserCommand extends BaseCommand {
  public constructor(
    id: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    super(id);
  }
}
