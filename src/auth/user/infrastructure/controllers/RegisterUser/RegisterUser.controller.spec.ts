import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { bootstrapTest } from '../../../../../../app/main.testapplication';
import { randomUUID } from 'node:crypto';

describe('RegisterUserController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await bootstrapTest();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', async () => {
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        userId: randomUUID(),
        fullname: 'Jose Gomez',
        email: randomUUID(),
        password: 'abc123',
      })
      .expect(201);
  });
});
