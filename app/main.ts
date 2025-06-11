import { NestFactory } from '@nestjs/core';
import { AuthModule } from '../src/auth/auth.module';
import { registerCommands } from './shared/RegisterCommands';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AuthModule);

  const orm = app.get(MikroORM);
  await orm.getMigrator().up();

  registerCommands(app);

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
