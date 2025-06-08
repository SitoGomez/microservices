import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../../../../auth.module';
import { ICommandHandler } from '../../../../../shared/commandBus/ICommandHandler';
import { RegisterUserCommand } from '../../../application/RegisterUser/RegisterUser.command';
import { RegisterUserUseCase } from '../../../application/RegisterUser/RegisterUser.usecase';
import {
  COMMAND_BUS,
  ICommandBus,
} from '../../../../../shared/commandBus/ICommandBus';

describe('RegisterUserController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();

    const commandBus = app.get<ICommandBus>(COMMAND_BUS);

    commandBus.register(
      RegisterUserCommand,
      app.get<ICommandHandler<RegisterUserCommand>>(RegisterUserUseCase),
    );

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
