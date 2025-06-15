import { MikroORM } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { registerCommands } from './utils/RegisterCommands';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const orm = app.get(MikroORM);
  await orm.getMigrator().up();

  registerCommands(app);

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
