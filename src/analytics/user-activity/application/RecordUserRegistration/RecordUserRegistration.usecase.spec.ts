import { UserActivityReadLayerMock } from '../../infrastructure/tests/mocks/UserActivityReadLayerMock';

import { RecordUserRegistrationUseCase } from './RecordUserRegistration.usecase';
import { RecordUserRegistrationCommand } from './RecordUserRegistrationCommand';

describe('Given a RecordUserRegistrationCommand', () => {
  const userActivityReadLayer = new UserActivityReadLayerMock();

  const useCase = new RecordUserRegistrationUseCase(userActivityReadLayer);

  const VALID_COMMAND_ID = 'f983cb7c-1d8e-4c5c-9cd2-714305b297f1';
  const VALID_USER_ID = 'f165cb7c-1d8e-4c5c-9cd2-714305b297f1';
  const VALID_USER_EMAIL = 'jose.test@test.com';
  const VALID_REGISTRATION_DATE = new Date('2023-06-07T10:00:00Z');

  const VALID_COMMAND = new RecordUserRegistrationCommand(
    VALID_COMMAND_ID,
    VALID_USER_ID,
    VALID_USER_EMAIL,
    VALID_REGISTRATION_DATE,
  );

  afterEach(() => {
    userActivityReadLayer.clean();
  });

  describe('when an user got registered', () => {
    it('then a new user activity should be created', async () => {
      await useCase.execute(VALID_COMMAND);

      expect(userActivityReadLayer.getStored()).toHaveLength(1);
      expect(userActivityReadLayer.getStored()[0]!.userId).toEqual(
        VALID_USER_ID,
      );
      expect(userActivityReadLayer.getStored()[0]!.email).toEqual(
        VALID_USER_EMAIL,
      );
      expect(userActivityReadLayer.getStored()[0]!.createdAt).toEqual(
        VALID_REGISTRATION_DATE,
      );
    });
  });
});
