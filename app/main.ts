import { MikroORM } from '@mikro-orm/core';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { registerCommands } from './utils/RegisterCommands';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const orm = app.get(MikroORM);
  await orm.getMigrator().up();

  registerCommands(app);

  app.setGlobalPrefix('api');
  await app.listen(process.env.HTTP_SERVER_PORT ?? 3000);
}

void bootstrap();
