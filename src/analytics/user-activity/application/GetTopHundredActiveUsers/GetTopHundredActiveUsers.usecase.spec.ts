import { randomUUID } from 'crypto';

import { UserActivityReadLayerMock } from '../../infrastructure/tests/mocks/UserActivityReadLayerMock';
import { UsersReportGeneratorMock } from '../../infrastructure/tests/mocks/UsersReportGeneratorMock';

import { GetTopHundredActiveUsersUseCase } from './GetTopHundredActiveUsers.usecase';
import { GetTopHundredActiveUsersQuery } from './GetTopHundredActiveUsersQuery';

describe(`Given a GetTopHundredActiveUsersQuery to handle`, () => {
  let userActivityReadLayer: UserActivityReadLayerMock;
  let usersReportGenerator: UsersReportGeneratorMock;
  let getTopHundredActiveUsersUseCase: GetTopHundredActiveUsersUseCase;

  const VALID_ACTIVE_USER = {
    userId: randomUUID().toString(),
    email: 'test@test.com',
    registrationDate: new Date(),
    lastLoginAt: new Date(),
    loginCount: 1,
  };

  beforeAll(() => {
    userActivityReadLayer = new UserActivityReadLayerMock();
    usersReportGenerator = new UsersReportGeneratorMock();
    getTopHundredActiveUsersUseCase = new GetTopHundredActiveUsersUseCase(
      userActivityReadLayer,
      usersReportGenerator,
    );
  });

  afterEach(() => {
    userActivityReadLayer.clean();
    usersReportGenerator.clean();
  });

  describe(`When there no active users in the platform`, () => {
    it(`Then it should save no data`, async () => {
      userActivityReadLayer.setToReturn([]);

      const query = new GetTopHundredActiveUsersQuery();

      await getTopHundredActiveUsersUseCase.execute(query);

      expect(usersReportGenerator.getStored()).toEqual([]);
    });
  });

  describe(`When there are active users in the platform`, () => {
    it(`Then it save the top hundred active users`, async () => {
      userActivityReadLayer.setToReturn([VALID_ACTIVE_USER]);

      const query = new GetTopHundredActiveUsersQuery();

      await getTopHundredActiveUsersUseCase.execute(query);

      expect(usersReportGenerator.getStored()).toEqual([VALID_ACTIVE_USER]);
    });
  });
});
