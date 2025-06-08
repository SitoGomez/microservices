import { AuthModule } from '../src/auth/auth.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { registerCommands } from './shared/RegisterCommands';

export async function bootstrapTest(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AuthModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  registerCommands(app);

  await app.init();

  return app;
}

void bootstrapTest();
