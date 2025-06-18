import { BaseCommand } from './BaseCommand';
import { ICommandHandler } from './ICommandHandler';

export interface ICommandBus {
  register<T extends BaseCommand>(
    commandType: new (...args: any[]) => T,
    handler: ICommandHandler<T>,
  ): void;

  execute<T extends BaseCommand, TResult = void>(command: T): Promise<TResult>;
}

export const COMMAND_BUS = Symbol('CommandBus');
