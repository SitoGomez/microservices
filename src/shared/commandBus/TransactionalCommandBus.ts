import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ILogger } from '../logger/ILogger';

import { BaseCommand } from './BaseCommand';
import { NoHandlerForCommandError } from './errors/NoHandlerForCommand.error';
import { ICommandBus } from './ICommandBus';
import { ICommandHandler } from './ICommandHandler';

@Injectable()
export class TransactionalCommandBus implements ICommandBus {
  public constructor(
    private readonly logger: ILogger,
    private readonly mikroOrm: MikroORM,
  ) {}

  private handlers = new Map<string, ICommandHandler<BaseCommand, any>>();

  public register<T extends BaseCommand, TResult = void>(
    commandType: new (...args: any[]) => T,
    handler: ICommandHandler<T, TResult>,
  ): void {
    const commandName = commandType.name;
    this.handlers.set(
      commandName,
      handler as ICommandHandler<BaseCommand, any>,
    );
  }

  public async execute<T extends BaseCommand, TResult = void>(
    command: T,
  ): Promise<TResult> {
    const commandName = command.constructor.name;
    const commandId = command.id;

    const handler = this.handlers.get(commandName) as
      | ICommandHandler<T, TResult>
      | undefined;

    if (!handler) {
      throw new NoHandlerForCommandError(commandName);
    }

    this.logger.info(`Executing command: ${commandName} with id: ${commandId}`);

    /* IMPORTANT: This forked EntityManager is used to ensure that the command
    execution is transactional and the context is isolated between commands. */
    const forkedEm = this.mikroOrm.em.fork();
    await forkedEm.begin();

    try {
      const commandExecutionResult = await handler.execute(command);
      await forkedEm.commit();

      return commandExecutionResult;
    } catch (error) {
      await forkedEm.rollback();
      throw error;
    }
  }
}
