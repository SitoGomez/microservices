import { AuthModule } from '../src/auth/auth.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { registerCommands } from './shared/RegisterCommands';
import { MikroORM } from '@mikro-orm/core';

export async function bootstrapTest(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AuthModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  const orm = app.get(MikroORM);
  await orm.getMigrator().up();

  registerCommands(app);

  await app.init();

  return app;
}

void bootstrapTest();
