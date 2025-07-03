import { InMemoryDateTimeService } from '../../../../shared/dateTimeService/infrastructure/doubles/InMemoryDateTimeService';
import { EventBusMock } from '../../../../shared/events/eventBus/infrastructure/testing/EventBusMock';
import { UserRegistered } from '../../domain/events/UserRegistered.event';
import { PasswordHasherMock } from '../../infrastructure/tests/mocks/PasswordHasherMock';
import { UserRepositoryMock } from '../../infrastructure/tests/mocks/UserRepositoryMock';

import { RegisterUserCommand } from './RegisterUser.command';
import { RegisterUserUseCase } from './RegisterUser.usecase';

describe('Given a RegisterUserCommand', () => {
  const userRepository = new UserRepositoryMock();
  const eventBus = new EventBusMock();
  const dateTimeService = new InMemoryDateTimeService();
  const passwordHasher = new PasswordHasherMock();

  const useCase = new RegisterUserUseCase(
    userRepository,
    eventBus,
    dateTimeService,
    passwordHasher,
  );

  const VALID_COMMAND_ID = 'f983cb7c-1d8e-4c5c-9cd2-714305b297f1';
  const VALID_USER_ID = 'f165cb7c-1d8e-4c5c-9cd2-714305b297f1';
  const VALID_USER_EMAIL = 'jose.test@test.com';
  const VALID_USER_PASSWORD = 'abc123';
  const VALID_TIMESTAMP_IN_MS = 1749285081000;
  const HASHED_PASSWORD = 'hashed-password';

  const VALID_COMMAND = new RegisterUserCommand(
    VALID_COMMAND_ID,
    VALID_USER_ID,
    VALID_USER_EMAIL,
    VALID_USER_PASSWORD,
  );

  afterEach(() => {
    userRepository.clean();
    eventBus.clean();
    dateTimeService.clean();
    passwordHasher.clean();
  });

  beforeEach(() => {
    dateTimeService.setTimestamp(VALID_TIMESTAMP_IN_MS);
    passwordHasher.setHash(HASHED_PASSWORD);
  });

  describe('when the user is not registered', () => {
    it('then should register a user', async () => {
      await useCase.execute(VALID_COMMAND);

      expect(userRepository.stored()).toHaveLength(1);
      expect(userRepository.stored()[0].getUserId()).toEqual(VALID_USER_ID);
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
      expect(eventBus.getDispatchedEvents()[0]).toBeInstanceOf(UserRegistered);
    });
  });
});
