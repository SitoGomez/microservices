import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { ProcessedEventEntity } from '../../../../../analytics/user-activity/infrastructure/databases/mikroOrm/entities/ProcessedEvent.entity';
import { IProcessedEventService } from '../../IProcessedEventService';

@Injectable()
export class MikroOrmProcessedEventService implements IProcessedEventService {
  public constructor(
    private readonly processedEventRepository: EntityRepository<ProcessedEventEntity>,
  ) {}

  public async save(eventId: string, eventType: string): Promise<void> {
    const processedEvent = new ProcessedEventEntity(eventId, eventType);

    await this.processedEventRepository.insert(processedEvent);
  }

  public async isProcessed(
    eventId: string,
    eventType: string,
  ): Promise<boolean> {
    const processedEvent = await this.processedEventRepository.findOne({
      eventId,
      eventType,
    });

    return !!processedEvent;
  }
}
