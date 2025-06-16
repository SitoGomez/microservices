import { Inject, Injectable } from '@nestjs/common';

import { ICommandHandler } from '../../../../shared/commandBus/ICommandHandler';
import { EVENT_BUS, IEventBus } from '../../../../shared/eventBus/IEventBus';
import { UserByEmailNotFoundError } from '../../domain/errors/UserByEmailNotFound.error';
import { IPasswordHasher, PASSWORD_HASHER } from '../../domain/IPasswordHasher';
import { IUserRepository, USER_REPOSITORY } from '../../domain/UserRepository';

import { LoginUserCommand } from './LoginUser.command';

@Injectable()
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  public constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async execute(loginUserCommand: LoginUserCommand): Promise<void> {
    const { email } = loginUserCommand;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserByEmailNotFoundError(email);
    }
  }
}
