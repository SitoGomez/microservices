import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';

export interface ICommandBus {
  register<T extends ICommand>(
    commandType: new (...args: any[]) => T,
    handler: ICommandHandler<T>,
  ): void;

  execute<T extends ICommand>(command: T): Promise<void>;
}

export const COMMAND_BUS = Symbol('CommandBus');
