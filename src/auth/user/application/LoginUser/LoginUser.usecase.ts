import { Inject, Injectable } from '@nestjs/common';

import { ICommandHandler } from '../../../../shared/commandBus/ICommandHandler';
import {
  EVENT_BUS,
  IEventBus,
} from '../../../../shared/events/eventBus/IEventBus';
import {
  EVENTS_STORE,
  IEventsStore,
} from '../../../../shared/events/eventStore/IEventsStore';
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
import { LoginUserResponse } from './LoginUserResponse.type';

@Injectable()
export class LoginUserUseCase
  implements ICommandHandler<LoginUserCommand, LoginUserResponse>
{
  public constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    @Inject(EVENTS_STORE) private readonly eventsStore: IEventsStore,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
    @Inject(ACCESS_TOKEN_MANAGER)
    private readonly accessTokenManager: IAccessTokenManager,
  ) {}

  public async execute(
    loginUserCommand: LoginUserCommand,
  ): Promise<LoginUserResponse> {
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

    const userLoggedEvent = UserLogged.create(
      loginUserCommand.id,
      user.getUserId(),
      email,
    );

    await this.eventsStore.save([userLoggedEvent]);
    await this.eventBus.dispatch([userLoggedEvent]);

    //TODO: FIX THIS, commands should not return a response
    return {
      access_token:
        await this.accessTokenManager.generateAccessTokenFromUser(user),
    };
  }
}
