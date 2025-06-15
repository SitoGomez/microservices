import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';

import { AppModule } from './app.module';
import { registerCommands } from './utils/RegisterCommands';

export async function bootstrapTest(): Promise<INestApplication<App>> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  const orm = app.get(MikroORM);
  await orm.getMigrator().up();

  registerCommands(app);

  await app.init();

  return app;
}

void bootstrapTest();
