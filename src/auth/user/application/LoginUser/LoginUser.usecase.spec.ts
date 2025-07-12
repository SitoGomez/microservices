import { InMemoryDateTimeService } from '../../../../shared/dateTimeService/infrastructure/doubles/InMemoryDateTimeService';
import { EventBusMock } from '../../../../shared/events/eventBus/infrastructure/testing/EventBusMock';
import { EventStoreMock } from '../../../../shared/events/eventStore/infrastructure/testing/EventStoreMock';
import { UserByEmailNotFoundError } from '../../domain/errors/UserByEmailNotFound.error';
import { WrongUserCredentialsError } from '../../domain/errors/WrongUserCredentials.error';
import { UserLogged } from '../../domain/events/UserLogged.event';
import { UserBuilder } from '../../infrastructure/tests/builders/User.builder';
import { AccessTokenManagerMock } from '../../infrastructure/tests/mocks/AccessTokenManagerMock';
import { PasswordHasherMock } from '../../infrastructure/tests/mocks/PasswordHasherMock';
import { UserRepositoryMock } from '../../infrastructure/tests/mocks/UserRepositoryMock';

import { LoginUserCommand } from './LoginUser.command';
import { LoginUserUseCase } from './LoginUser.usecase';

describe('Given an LoginUserCommand', () => {
  const userRepository = new UserRepositoryMock();
  const eventBus = new EventBusMock();
  const eventStore = new EventStoreMock();
  const dateTimeService = new InMemoryDateTimeService();
  const passwordHasher = new PasswordHasherMock();
  const accessTokenManagerMock = new AccessTokenManagerMock();

  const useCase = new LoginUserUseCase(
    userRepository,
    eventBus,
    eventStore,
    passwordHasher,
    accessTokenManagerMock,
  );

  const VALID_COMMAND_ID = 'f983cb7c-1d8e-4c5c-9cd2-714305b297f1';
  const VALID_USER_EMAIL = 'jose.test@test.com';
  const VALID_USER_PASSWORD = 'abc123';
  const VALID_TIMESTAMP_IN_MS = 1749285081000;
  const HASHED_PASSWORD = 'hashed-password';

  const VALID_ACCESS_TOKEN = 'valid-access-token';
  const VALID_ACCESS_TOKEN_DATA = {
    sub: 'f165cb7c-1d8e-4c5c-9cd2-714305b297f1',
    email: VALID_USER_EMAIL,
    iat: 100,
    exp: 150,
    iss: 'auth-service',
    aud: 'auth-service',
  };

  const VALID_COMMAND = new LoginUserCommand(
    VALID_COMMAND_ID,
    VALID_USER_EMAIL,
    VALID_USER_PASSWORD,
  );

  afterEach(() => {
    userRepository.clean();
    eventBus.clean();
    eventStore.clean();
    dateTimeService.clean();
    passwordHasher.clean();
    accessTokenManagerMock.clean();
  });

  beforeEach(() => {
    dateTimeService.setTimestamp(VALID_TIMESTAMP_IN_MS);
    passwordHasher.setHash(HASHED_PASSWORD);
    accessTokenManagerMock.setAccessToken(VALID_ACCESS_TOKEN);
    accessTokenManagerMock.setAccessTokenData(VALID_ACCESS_TOKEN_DATA);
  });

  describe('when the user is not found', () => {
    it('then should throw an error', async () => {
      await expect(useCase.execute(VALID_COMMAND)).rejects.toThrow(
        UserByEmailNotFoundError,
      );
    });
  });

  describe('when the password is not valid', () => {
    beforeEach(() => {
      const user = UserBuilder.anUser().build();

      userRepository.setUsers([user]);

      passwordHasher.setMatch(false);
    });

    it('then should throw an error', async () => {
      await expect(useCase.execute(VALID_COMMAND)).rejects.toThrow(
        WrongUserCredentialsError,
      );
    });
  });

  describe('when the user is registered already', () => {
    beforeEach(() => {
      const user = UserBuilder.anUser().build();

      userRepository.setUsers([user]);

      passwordHasher.setMatch(true);
    });

    it('then should return an access token', async () => {
      const result = await useCase.execute(VALID_COMMAND);

      expect(result).toEqual({
        access_token: VALID_ACCESS_TOKEN,
      });
    });

    it('should store an UserWasRegisteredEvent', async () => {
      await useCase.execute(VALID_COMMAND);

      expect(eventStore.getStored()).toHaveLength(1);
      expect(eventStore.getStored()[0]).toBeInstanceOf(UserLogged);
    });

    it('then an event should be dispatched', async () => {
      await useCase.execute(VALID_COMMAND);

      expect(eventBus.getDispatchedEvents()).toHaveLength(1);
      expect(eventBus.getDispatchedEvents()[0]).toBeInstanceOf(UserLogged);
    });
  });
});
