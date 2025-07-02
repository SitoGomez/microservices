import { EntityManager, RequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { ILogger } from '../logger/ILogger';

import { BaseCommand } from './BaseCommand';
import { NoHandlerForCommandError } from './errors/NoHandlerForCommand.error';
import { ICommandBus } from './ICommandBus';
import { ICommandHandler } from './ICommandHandler';
import { IProcessedCommandService } from './IProcessedCommandService';
import { ProcessedCommandResponseType } from './ProcessedCommandResponse.type';

@Injectable()
export class TransactionalCommandBus implements ICommandBus {
  public constructor(
    private readonly logger: ILogger,
    private readonly mikroOrm: MikroORM,
    private readonly processedCommandService: IProcessedCommandService,
  ) {}

  private registeredCommandHandlers = new Map<
    string,
    ICommandHandler<BaseCommand, any>
  >();

  public register<T extends BaseCommand, TResult = void>(
    commandType: new (...args: any[]) => T,
    handler: ICommandHandler<T, TResult>,
  ): void {
    const commandName = commandType.name;
    this.registeredCommandHandlers.set(
      commandName,
      handler as ICommandHandler<BaseCommand, any>,
    );
  }

  public async execute<T extends BaseCommand, TResult = void>(
    command: T,
  ): Promise<TResult> {
    const commandHandler = this.getCommandHandlerOrThrow<T, TResult>(command);

    const existingEM = RequestContext.getEntityManager();

    if (existingEM) {
      return this.executeCommand<T, TResult>(
        existingEM,
        command,
        commandHandler,
      );
    }

    const emFork = this.mikroOrm.em.fork({ useContext: true });

    return RequestContext.create(emFork, async () => {
      return this.executeCommand<T, TResult>(emFork, command, commandHandler);
    });
  }

  private getCommandHandlerOrThrow<T extends BaseCommand, TResult = void>(
    command: T,
  ): ICommandHandler<T, TResult> {
    const commandName = command.constructor.name;
    const handler = this.registeredCommandHandlers.get(commandName) as
      | ICommandHandler<T, TResult>
      | undefined;

    if (!handler) {
      throw new NoHandlerForCommandError(commandName);
    }

    return handler;
  }

  private executeCommand<T extends BaseCommand, TResult = void>(
    em: EntityManager,
    command: T,
    commandHandler: ICommandHandler<T, TResult>,
  ): Promise<TResult> {
    const commandName = command.constructor.name;
    const commandId = command.id;

    return em.transactional(async () => {
      const alreadyProcessedCommand = await this.getAlreadyProcessedCommand(
        commandId,
        commandName,
      );

      if (alreadyProcessedCommand) {
        if (alreadyProcessedCommand.commandResponse === undefined) {
          return Promise.resolve() as Promise<TResult>;
        }

        return Promise.resolve(
          alreadyProcessedCommand.commandResponse,
        ) as Promise<TResult>;
      }

      this.logger.info(
        `Executing command: ${commandName} with id: ${commandId}`,
      );
      const commandResponse = await commandHandler.execute(command);

      await this.saveProcessedCommand(commandId, commandName, commandResponse);

      return commandResponse;
    });
  }

  private async getAlreadyProcessedCommand(
    commandId: string,
    commandName: string,
  ): Promise<ProcessedCommandResponseType | undefined> {
    return this.processedCommandService.findByCommandIdAndName(
      commandId,
      commandName,
    );
  }

  private async saveProcessedCommand<TResult>(
    commandId: string,
    commandName: string,
    commandResponse?: TResult,
  ): Promise<void> {
    return this.processedCommandService.save(
      commandId,
      commandName,
      commandResponse as string | undefined,
    );
  }
}
