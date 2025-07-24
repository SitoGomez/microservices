import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { IProcessedCommandService } from '../../IProcessedCommandService';
import { ProcessedCommandResponseType } from '../../ProcessedCommandResponse.type';

import { ProcessedCommandEntity } from './entities/ProcessedCommands.entity';

@Injectable()
export class MikroOrmProcessedCommandService
  implements IProcessedCommandService
{
  private readonly processedCommandRepository: EntityRepository<ProcessedCommandEntity>;

  public constructor(
    processedCommandRepository: EntityRepository<ProcessedCommandEntity>,
  ) {
    this.processedCommandRepository = processedCommandRepository;
  }

  public async save(
    commandId: string,
    commandType: string,
    commandResponse: string | undefined,
  ): Promise<void> {
    const processedCommand = new ProcessedCommandEntity(
      commandId,
      commandType,
      commandResponse,
    );

    await this.processedCommandRepository.insert(processedCommand);
  }

  public async findByCommandIdAndName(
    commandId: string,
    commandName: string,
  ): Promise<ProcessedCommandResponseType | undefined> {
    const result = await this.processedCommandRepository.findOne({
      commandId,
      commandName,
    });

    return result ? result : undefined;
  }
}
