import { INestApplication } from '@nestjs/common';
import { RegisterUserCommand } from '../../src/auth/user/application/RegisterUser/RegisterUser.command';
import { RegisterUserUseCase } from '../../src/auth/user/application/RegisterUser/RegisterUser.usecase';
import {
  ICommandBus,
  COMMAND_BUS,
} from '../../src/shared/commandBus/ICommandBus';
import { ICommandHandler } from '../../src/shared/commandBus/ICommandHandler';

export function registerCommands(app: INestApplication<any>): void {
  const commandBus = app.get<ICommandBus>(COMMAND_BUS);

  commandBus.register(
    RegisterUserCommand,
    app.get<ICommandHandler<RegisterUserCommand>>(RegisterUserUseCase),
  );
}
