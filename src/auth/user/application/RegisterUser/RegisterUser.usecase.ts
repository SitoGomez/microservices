import { Inject, Injectable } from '@nestjs/common';

import { ICommandHandler } from '../../../../shared/commandBus/ICommandHandler';
import {
  DATE_TIME_SERVICE,
  IDateTimeService,
} from '../../../../shared/dateTimeService/domain/IDateTimeService';
import {
  DOMAIN_EVENT_MANAGER,
  IDomainEventManager,
} from '../../../../shared/domainEvent/domain/IDomainEventManager';
import { EVENT_BUS, IEventBus } from '../../../../shared/eventBus/IEventBus';
import { User } from '../../domain/User';
import { IUserRepository, USER_REPOSITORY } from '../../domain/UserRepository';

import { RegisterUserCommand } from './RegisterUser.command';

@Injectable()
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  public constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    @Inject(DOMAIN_EVENT_MANAGER)
    private readonly domainEventManager: IDomainEventManager,
    @Inject(DATE_TIME_SERVICE)
    private readonly dateTimeService: IDateTimeService,
  ) {}

  public async execute(
    registerUserCommand: RegisterUserCommand,
  ): Promise<void> {
    const { userId, email, password } = registerUserCommand;

    const registeredUser = User.register(
      this.domainEventManager,
      registerUserCommand.id,
      userId,
      email,
      password,
      new Date(this.dateTimeService.now()),
    );

    await this.userRepository.register(registeredUser);

    await this.eventBus.dispatch(registeredUser.releaseEvents());
  }
}
