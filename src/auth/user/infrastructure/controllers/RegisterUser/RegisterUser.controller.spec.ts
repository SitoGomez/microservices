import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { bootstrapTest } from '../../../../../../app/main.testapplication';

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
        id: 'f165cb7c-1d8e-4c5c-9cd2-714305b297f1',
        fullname: 'Jose Gomez',
        email: 'jose.test@test.com',
        password: 'abc123',
      })
      .expect(201);
  });
});
