import { RequestContext } from '@mikro-orm/core';
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

    const emFork = this.mikroOrm.em.fork({ useContext: true });

    return RequestContext.create(emFork, async () => {
      return emFork.transactional(async (_em) => {
        return handler.execute(command);
      });
    });
  }
}
