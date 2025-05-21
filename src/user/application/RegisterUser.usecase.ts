import { User } from '../domain/User';
import { RegisterUserCommand } from '../infrastructure/commands/RegisterUser.command';

export class RegisterUserUseCase {
  public constructor() {}

  public async execute(
    registerUserCommand: RegisterUserCommand,
  ): Promise<void> {
    const { id, fullname, email, password } = registerUserCommand;

    User.register(id, fullname, email, password, Date.now());
  }
}
