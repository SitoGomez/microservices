import { Inject, Injectable } from '@nestjs/common';

import { ILogger, LOGGER } from '../logger/ILogger';

import { NoHandlerForCommandError } from './errors/NoHandlerForCommand.error';
import { BaseCommand } from './BaseCommand';
import { ICommandBus } from './ICommandBus';
import { ICommandHandler } from './ICommandHandler';

@Injectable()
export class InMemoryCommandBus implements ICommandBus {
  public constructor(@Inject(LOGGER) private readonly logger: ILogger) {}

  private handlers = new Map<string, ICommandHandler<BaseCommand>>();

  public register<T extends BaseCommand>(
    commandType: new (...args: any[]) => T,
    handler: ICommandHandler<T>,
  ): void {
    const commandName = commandType.name;

    this.handlers.set(commandName, handler);
  }

  public async execute<T extends BaseCommand>(command: T): Promise<void> {
    const commandName = command.constructor.name;
    const commandId = command.id;

    const handler = this.handlers.get(commandName);

    if (!handler) {
      throw new NoHandlerForCommandError(commandName);
    }

    this.logger.info(`Executing command: ${commandName} with id: ${commandId}`);
    await handler.execute(command);
  }
}
