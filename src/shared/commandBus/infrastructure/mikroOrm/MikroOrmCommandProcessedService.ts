import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { IProcessedCommandService } from '../../IProcessedCommand';

import { ProcessedCommandEntity } from './entities/ProcessedCommands.entity';

@Injectable()
export class MikroOrmProcessedCommandService
  implements IProcessedCommandService
{
  public constructor(
    private readonly processedCommandRepository: EntityRepository<ProcessedCommandEntity>,
  ) {}

  public async save(commandId: string, commandType: string): Promise<void> {
    const processedCommand = new ProcessedCommandEntity(commandId, commandType);

    await this.processedCommandRepository.insert(processedCommand);
  }

  public async isProcessed(
    commandId: string,
    commandName: string,
  ): Promise<boolean> {
    const processedCommand = await this.processedCommandRepository.findOne({
      commandId,
      commandName,
    });

    return !!processedCommand;
  }
}
