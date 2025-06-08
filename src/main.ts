import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { COMMAND_BUS, ICommandBus } from './shared/commandBus/ICommandBus';
import { RegisterUserCommand } from './auth/user/application/RegisterUser/RegisterUser.command';
import { INestApplication } from '@nestjs/common';
import { ICommandHandler } from './shared/commandBus/ICommandHandler';
import { RegisterUserUseCase } from './auth/user/application/RegisterUser/RegisterUser.usecase';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AuthModule);

  registerCommands(app);

  await app.listen(process.env.PORT ?? 3001);
}

function registerCommands(app: INestApplication<any>): void {
  const commandBus = app.get<ICommandBus>(COMMAND_BUS);

  commandBus.register(
    RegisterUserCommand,
    app.get<ICommandHandler<RegisterUserCommand>>(RegisterUserUseCase),
  );
}

void bootstrap();
