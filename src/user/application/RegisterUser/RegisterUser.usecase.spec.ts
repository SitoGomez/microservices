import { DomainEventManager } from '../../../shared/domainEvent/DomainEventHandler';
import { InMemoryEventBus } from '../../../shared/eventBus/InMemoryEventBus';
import { UserWasRegisteredEvent } from '../../domain/events/UserWasRegistered.event';
import { InMemoryUserRepository } from '../../infrastructure/InMemoryUserRepository';
import { RegisterUserCommand } from './RegisterUser.command';
import { RegisterUserUseCase } from './RegisterUser.usecase';

describe('RegisterUserUseCase', () => {
  const userRepository = new InMemoryUserRepository();
  const eventBus = new InMemoryEventBus();
  const domainEventManager = new DomainEventManager();
  const useCase = new RegisterUserUseCase(
    userRepository,
    eventBus,
    domainEventManager,
  );

  const VALID_USER_ID = 'f165cb7c-1d8e-4c5c-9cd2-714305b297f1';
  const VALID_USER_FULLNAME = 'Jose Gomez';
  const VALID_USER_EMAIL = 'jose.test@test.com';
  const VALID_USER_PASSWORD = 'abc123';

  const VALID_COMMAND = new RegisterUserCommand(
    VALID_USER_ID,
    VALID_USER_FULLNAME,
    VALID_USER_EMAIL,
    VALID_USER_PASSWORD,
  );

  afterEach(() => {
    userRepository.clean();
    eventBus.clean();
  });

  it('should register a user', async () => {
    await useCase.execute(VALID_COMMAND);

    expect(userRepository.stored()).toHaveLength(1);
    expect(userRepository.stored()[0].getId()).toEqual(VALID_USER_ID);
  });

  it('should dispatch an UserWasRegisteredEvent', async () => {
    await useCase.execute(VALID_COMMAND);

    expect(eventBus.getDispatchedEvents()).toHaveLength(1);
    expect(eventBus.getDispatchedEvents()[0]).toBeInstanceOf(
      UserWasRegisteredEvent,
    );
  });
});
