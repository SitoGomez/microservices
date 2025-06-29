import { randomUUID } from 'crypto';

import { UserActivityReadLayerMock } from '../../infrastructure/tests/mocks/UserActivityReadLayerMock';
import { UsersReportGeneratorMock } from '../../infrastructure/tests/mocks/UsersReportGeneratorMock';

import { GenerateTopHundredActiveUsersReportUseCase } from './GenerateTopHundredActiveUsersReport.usecase';
import { GenerateTopHundredActiveUsersReportQuery } from './GenerateTopHundredActiveUsersReportQuery';

describe(`Given a GenerateTopHundredActiveUsersReportQuery to handle`, () => {
  let userActivityReadLayer: UserActivityReadLayerMock;
  let usersReportGenerator: UsersReportGeneratorMock;
  let generateTopHundredActiveUsersReportUseCase: GenerateTopHundredActiveUsersReportUseCase;

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
    generateTopHundredActiveUsersReportUseCase =
      new GenerateTopHundredActiveUsersReportUseCase(
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

      const query = new GenerateTopHundredActiveUsersReportQuery();

      await generateTopHundredActiveUsersReportUseCase.execute(query);

      expect(usersReportGenerator.getStored()).toEqual([]);
    });
  });

  describe(`When there are active users in the platform`, () => {
    it(`Then it save the top hundred active users`, async () => {
      userActivityReadLayer.setToReturn([VALID_ACTIVE_USER]);

      const query = new GenerateTopHundredActiveUsersReportQuery();

      await generateTopHundredActiveUsersReportUseCase.execute(query);

      expect(usersReportGenerator.getStored()).toEqual([VALID_ACTIVE_USER]);
    });
  });
});
