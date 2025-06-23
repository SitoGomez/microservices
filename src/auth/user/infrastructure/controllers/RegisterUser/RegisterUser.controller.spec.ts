import { MikroORM } from '@mikro-orm/core';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AuthModule } from '../../../../auth.module';

describe('Given a request to register an user', () => {
  let app: INestApplication<App>;

  let entityManager: MikroORM['em'];

  const VALID_USER_ID = '8f62c518-08fc-4f6f-86e0-8db845cc9c2d';
  const VALID_EMAIL = `test1@test.com`;
  const VALID_PASSWORD = 'abcd1234';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    const orm = moduleRef.get<MikroORM>('auth_MikroORM');

    entityManager = orm.em.fork();

    const appInstance = moduleRef.createNestApplication();

    appInstance.useGlobalPipes(new ValidationPipe());

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

  describe('when the user is not registered yet', () => {
    it('then it should get registered', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({
          userId: VALID_USER_ID,
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
        })
        .expect(HttpStatus.CREATED);
    });
  });
});
