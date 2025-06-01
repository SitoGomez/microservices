import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/User';
import { IUserRepository, USER_REPOSITORY } from '../../domain/UserRepository';
import { RegisterUserCommand } from './RegisterUser.command';
import { EVENT_BUS, IEventBus } from '../../../shared/eventBus/IEventBus';
import {
  DOMAIN_EVENT_MANAGER,
  IDomainEventManager,
} from '../../../shared/domainEvent/IDomainEventManager';

@Injectable()
export class RegisterUserUseCase {
  public constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    @Inject(DOMAIN_EVENT_MANAGER)
    private readonly domainEventManager: IDomainEventManager, // Replace with actual type if available
  ) {}

  public async execute(
    registerUserCommand: RegisterUserCommand,
  ): Promise<void> {
    const { userId: id, fullname, email, password } = registerUserCommand;

    const registeredUser = User.register(
      this.domainEventManager,
      registerUserCommand.id,
      id,
      fullname,
      email,
      password,
      new Date(),
    );

    this.userRepository.register(registeredUser);

    await this.eventBus.dispatch(registeredUser.releaseEvents());
  }
}
