import { Injectable } from '@nestjs/common';
import { ICommand } from './ICommand';
import { ICommandBus } from './ICommandBus';
import { ICommandHandler } from './ICommandHandler';
import { NoHandlerForCommandError } from './errors/NoHandlerForCommand.error';

@Injectable()
export class InMemoryCommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandler<ICommand>>();

  public register<T extends ICommand>(
    commandType: new (...args: any[]) => T,
    handler: ICommandHandler<T>,
  ): void {
    const commandName = commandType.name;

    this.handlers.set(commandName, handler);
  }

  public async execute<T extends ICommand>(command: T): Promise<void> {
    const handler = this.handlers.get(command.constructor.name);

    if (!handler) {
      throw new NoHandlerForCommandError(command.constructor.name);
    }

    await handler.execute(command);
  }
}
