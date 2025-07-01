import { RequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ILogger } from '../logger/ILogger';

import { BaseCommand } from './BaseCommand';
import { NoHandlerForCommandError } from './errors/NoHandlerForCommand.error';
import { ICommandBus } from './ICommandBus';
import { ICommandHandler } from './ICommandHandler';
import { IProcessedCommandService } from './IProcessedCommand';

@Injectable()
export class TransactionalCommandBus implements ICommandBus {
  public constructor(
    private readonly logger: ILogger,
    private readonly mikroOrm: MikroORM,
    private readonly processedCommandService: IProcessedCommandService,
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

    const existingEM = RequestContext.getEntityManager();

    if (existingEM) {
      if (await this.isCommandAlreadyProcessed(commandId, commandName)) {
        //TODO: Return the same result
        return Promise.resolve() as TResult;
      }

      this.logger.info(
        `Executing command: ${commandName} with id: ${commandId}`,
      );
      return existingEM.transactional(async () => {
        const result = handler.execute(command);

        await this.markCommandAsProcessed(commandId, commandName);

        return result;
      });
    }

    const emFork = this.mikroOrm.em.fork({ useContext: true });

    return RequestContext.create(emFork, async () => {
      return emFork.transactional(async () => {
        if (await this.isCommandAlreadyProcessed(commandId, commandName)) {
          return Promise.resolve() as TResult;
        }

        this.logger.info(
          `Executing command: ${commandName} with id: ${commandId}`,
        );
        const result = handler.execute(command);

        await this.markCommandAsProcessed(commandId, commandName);

        return result;
      });
    });
  }

  private async isCommandAlreadyProcessed(
    commandId: string,
    commandName: string,
  ): Promise<boolean> {
    return this.processedCommandService.isProcessed(commandId, commandName);
  }

  private async markCommandAsProcessed(
    commandId: string,
    commandName: string,
  ): Promise<void> {
    return this.processedCommandService.save(commandId, commandName);
  }
}
