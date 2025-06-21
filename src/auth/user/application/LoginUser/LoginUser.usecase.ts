import { Inject, Injectable } from '@nestjs/common';

import { ICommandHandler } from '../../../../shared/commandBus/ICommandHandler';
import { EVENT_BUS, IEventBus } from '../../../../shared/eventBus/IEventBus';
import { UserByEmailNotFoundError } from '../../domain/errors/UserByEmailNotFound.error';
import { WrongUserCredentialsError } from '../../domain/errors/WrongUserCredentials.error';
import { UserLogged } from '../../domain/events/UserLogged.event';
import {
  ACCESS_TOKEN_MANAGER,
  IAccessTokenManager,
} from '../../domain/IAccessTokenManager';
import { IPasswordHasher, PASSWORD_HASHER } from '../../domain/IPasswordHasher';
import { IUserRepository, USER_REPOSITORY } from '../../domain/UserRepository';

import { LoginUserCommand } from './LoginUser.command';

@Injectable()
export class LoginUserUseCase
  implements ICommandHandler<LoginUserCommand, { access_token: string }>
{
  public constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
    @Inject(ACCESS_TOKEN_MANAGER)
    private readonly accessTokenManager: IAccessTokenManager,
  ) {}

  public async execute(
    loginUserCommand: LoginUserCommand,
  ): Promise<{ access_token: string }> {
    const { email, password } = loginUserCommand;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserByEmailNotFoundError(email);
    }

    const isPasswordValid = await this.passwordHasher.match(
      password,
      user.getPassword(),
    );

    if (!isPasswordValid) {
      throw new WrongUserCredentialsError(email);
    }

    await this.eventBus.dispatch([
      UserLogged.create(loginUserCommand.id, user.getUserId(), email),
    ]);

    return {
      access_token:
        await this.accessTokenManager.generateAccessTokenFromUser(user),
    };
  }
}
