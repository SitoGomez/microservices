import { randomUUID } from 'node:crypto';

import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../../../../../app/app.module';
import { registerCommands } from '../../../../../../app/utils/RegisterCommands';

describe('RegisterUserController', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const appInstance = moduleRef.createNestApplication();

    const orm = appInstance.get(MikroORM);
    await orm.getMigrator().up();

    registerCommands(appInstance);

    await appInstance.init();

    app = appInstance as INestApplication<App>;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register an user', async () => {
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        userId: randomUUID(),
        email: randomUUID(),
        password: 'abc123',
      })
      .expect(201);
  });
});
