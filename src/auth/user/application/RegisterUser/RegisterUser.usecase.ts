import { Inject, Injectable } from '@nestjs/common';

import { ICommandHandler } from '../../../../shared/commandBus/ICommandHandler';
import {
  DATE_TIME_SERVICE,
  IDateTimeService,
} from '../../../../shared/dateTimeService/domain/IDateTimeService';
import {
  EVENT_BUS,
  IEventBus,
} from '../../../../shared/events/eventBus/IEventBus';
import {
  EVENTS_STORE,
  IEventsStore,
} from '../../../../shared/events/eventStore/IEventsStore';
import { IPasswordHasher, PASSWORD_HASHER } from '../../domain/IPasswordHasher';
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
    @Inject(EVENTS_STORE) private readonly eventsStore: IEventsStore,
    @Inject(DATE_TIME_SERVICE)
    private readonly dateTimeService: IDateTimeService,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
  ) {}

  public async execute(
    registerUserCommand: RegisterUserCommand,
  ): Promise<void> {
    const { userId, email, password } = registerUserCommand;

    const registeredUser = User.register(
      registerUserCommand.id,
      userId,
      email,
      await this.passwordHasher.hash(password),
      new Date(this.dateTimeService.now()),
    );

    await this.userRepository.register(registeredUser);

    const events = registeredUser.releaseEvents();

    await this.eventsStore.save(events);
    await this.eventBus.dispatch(events);
  }
}
