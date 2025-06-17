import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../../../../../app/app.module';
import { registerCommands } from '../../../../../../app/utils/RegisterCommands';

describe('RegisterUserController', () => {
  let app: INestApplication<App>;

  let entityManager: MikroORM['em'];

  const VALID_USER_ID = '8f62c518-08fc-4f6f-86e0-8db845cc9c2d';
  const VALID_EMAIL = `test1@test.com`;
  const VALID_PASSWORD = 'abc123';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const appInstance = moduleRef.createNestApplication();

    entityManager = moduleRef.get(MikroORM).em.fork();

    const orm = appInstance.get(MikroORM);
    await orm.getMigrator().up();

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

  it('should register an user', async () => {
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        userId: VALID_USER_ID,
        email: VALID_EMAIL,
        password: VALID_PASSWORD,
      })
      .expect(201);
  });
});
