import { User } from '../../domain/User';
import { RegisterUserCommand } from './RegisterUser.command';

export class RegisterUserUseCase {
  public constructor() {}

  public execute(registerUserCommand: RegisterUserCommand): void {
    const { id, fullname, email, password } = registerUserCommand;

    User.register(id, fullname, email, password, new Date());
  }
}
