import { InMemoryDateTimeService } from '../../../../shared/dateTimeService/infrastructure/doubles/InMemoryDateTimeService';
import { InMemoryDomainEventManager } from '../../../../shared/domainEvent/infrastructure/InMemoryDomainEventHandler';
import { InMemoryEventBus } from '../../../../shared/eventBus/InMemoryEventBus';
import { UserWasRegisteredEvent } from '../../domain/events/UserWasRegistered.event';
import { PasswordHasherMock } from '../../infrastructure/mocks/PasswordHasherMock';
import { UserRepositoryMock } from '../../infrastructure/mocks/UserRepositoryMock';

import { RegisterUserCommand } from './RegisterUser.command';
import { RegisterUserUseCase } from './RegisterUser.usecase';

describe('RegisterUserUseCase', () => {
  const userRepository = new UserRepositoryMock();
  const eventBus = new InMemoryEventBus();
  const domainEventManager = new InMemoryDomainEventManager();
  const dateTimeService = new InMemoryDateTimeService();
  const passwordHasher = new PasswordHasherMock();

  const useCase = new RegisterUserUseCase(
    userRepository,
    eventBus,
    domainEventManager,
    dateTimeService,
    passwordHasher,
  );

  const VALID_USER_ID = 'f165cb7c-1d8e-4c5c-9cd2-714305b297f1';
  const VALID_USER_EMAIL = 'jose.test@test.com';
  const VALID_USER_PASSWORD = 'abc123';
  const VALID_TIMESTAMP_IN_MS = 1749285081000;
  const HASHED_PASSWORD = 'hashed-password';

  const VALID_COMMAND = new RegisterUserCommand(
    VALID_USER_ID,
    VALID_USER_EMAIL,
    VALID_USER_PASSWORD,
  );

  afterEach(() => {
    userRepository.clean();
    eventBus.clean();
    domainEventManager.clean();
    dateTimeService.clean();
    passwordHasher.clean();
  });

  beforeEach(() => {
    dateTimeService.setTimestamp(VALID_TIMESTAMP_IN_MS);
    passwordHasher.setHash(HASHED_PASSWORD);
  });

  it('should register a user', async () => {
    await useCase.execute(VALID_COMMAND);

    expect(userRepository.stored()).toHaveLength(1);
    expect(userRepository.stored()[0].getId()).toEqual(VALID_USER_ID);
    expect(userRepository.stored()[0].getEmail()).toEqual(VALID_USER_EMAIL);
    expect(userRepository.stored()[0].getPassword()).toEqual(HASHED_PASSWORD);
    expect(userRepository.stored()[0].getCreatedAt()).toEqual(
      new Date(VALID_TIMESTAMP_IN_MS),
    );
    expect(userRepository.stored()[0].getUpdatedAt()).toEqual(
      new Date(VALID_TIMESTAMP_IN_MS),
    );
  });

  it('should dispatch an UserWasRegisteredEvent', async () => {
    await useCase.execute(VALID_COMMAND);

    expect(eventBus.getDispatchedEvents()).toHaveLength(1);
    expect(eventBus.getDispatchedEvents()[0]).toBeInstanceOf(
      UserWasRegisteredEvent,
    );
  });
});
