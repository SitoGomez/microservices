import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../../../../auth.module';

describe('RegisterUserController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
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
