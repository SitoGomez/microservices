import { NestFactory } from '@nestjs/core';
import { AuthModule } from '../src/auth/auth.module';
import { registerCommands } from './shared/RegisterCommands';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AuthModule);

  registerCommands(app);

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
