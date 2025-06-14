import { ICommand } from '../../../../shared/commandBus/ICommand';

export class RegisterUserCommand implements ICommand {
  public readonly id: string;

  public constructor(
    public readonly userId: string,
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    this.id = crypto.randomUUID();
  }
}
