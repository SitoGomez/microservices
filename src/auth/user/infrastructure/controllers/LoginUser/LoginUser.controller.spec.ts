import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../../../../../app/app.module';
import { registerCommands } from '../../../../../../app/utils/RegisterCommands';
import {
  IPasswordHasher,
  PASSWORD_HASHER,
} from '../../../domain/IPasswordHasher';

describe('Given a request to login from an user', () => {
  let app: INestApplication<App>;

  let passwordHasher: IPasswordHasher;
  let entityManager: MikroORM['em'];

  const VALID_USER_ID = '9f62c518-08fc-4f6f-86e0-8db845cc9c2d';
  const VALID_EMAIL = `test@test.com`;
  const VALID_PASSWORD = 'abc123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    passwordHasher = moduleRef.get(PASSWORD_HASHER);

    const orm = moduleRef.get(MikroORM);
    await orm.getMigrator().up();

    entityManager = orm.em.fork();

    const appInstance = moduleRef.createNestApplication();

    registerCommands(appInstance);

    await appInstance.init();

    app = appInstance as INestApplication<App>;
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await entityManager
      .getConnection()
      .execute(`DELETE FROM users WHERE email = '${VALID_EMAIL}';`);
  });

  describe('when the user is registered', () => {
    beforeEach(async () => {
      await entityManager
        .fork()
        .getConnection()
        .execute(
          `INSERT INTO users (
      user_id,
      email,
      password,
      created_at,
      modified_at
    ) VALUES (
      '${VALID_USER_ID}',
      '${VALID_EMAIL}',
      '${await passwordHasher.hash(VALID_PASSWORD)}',
      NOW(),
      NOW()
    );`,
        );
    });

    it('then should login an user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
    });
  });
});
