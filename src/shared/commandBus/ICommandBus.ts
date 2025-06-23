import { BaseCommand } from './BaseCommand';
import { ICommandHandler } from './ICommandHandler';

export interface ICommandBus {
  register<TCommand extends BaseCommand, TResult = void>(
    commandType: new (...args: any[]) => TCommand,
    handler: ICommandHandler<TCommand, TResult>,
  ): void;

  execute<TCommand extends BaseCommand, TResult = void>(
    command: TCommand,
  ): Promise<TResult>;
}

export const COMMAND_BUS = Symbol('CommandBus');
