import { InMemoryDateTimeService } from '../../../../shared/dateTimeService/infrastructure/doubles/InMemoryDateTimeService';
import { InMemoryEventBus } from '../../../../shared/eventBus/InMemoryEventBus';
import { UserByEmailNotFoundError } from '../../domain/errors/UserByEmailNotFound.error';
import { PasswordHasherMock } from '../../infrastructure/mocks/PasswordHasherMock';
import { UserRepositoryMock } from '../../infrastructure/mocks/UserRepositoryMock';

import { LoginUserCommand } from './LoginUser.command';
import { LoginUserUseCase } from './LoginUser.usecase';

describe('Given an LoginUserCommand', () => {
  const userRepository = new UserRepositoryMock();
  const eventBus = new InMemoryEventBus();
  const dateTimeService = new InMemoryDateTimeService();
  const passwordHasher = new PasswordHasherMock();

  const useCase = new LoginUserUseCase(
    userRepository,
    eventBus,
    passwordHasher,
  );

  const VALID_USER_EMAIL = 'jose.test@test.com';
  const VALID_USER_PASSWORD = 'abc123';
  const VALID_TIMESTAMP_IN_MS = 1749285081000;
  const HASHED_PASSWORD = 'hashed-password';

  const VALID_COMMAND = new LoginUserCommand(
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

  describe('when the user is not found', () => {
    it('then should authenticate the user', async () => {
      await expect(useCase.execute(VALID_COMMAND)).rejects.toThrow(
        UserByEmailNotFoundError,
      );
    });
  });
});
