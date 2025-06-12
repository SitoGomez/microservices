import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { registerCommands } from './utils/RegisterCommands';
import { MikroORM } from '@mikro-orm/core';
import { AppModule } from './app.module';

export async function bootstrapTest(): Promise<INestApplication> {
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
