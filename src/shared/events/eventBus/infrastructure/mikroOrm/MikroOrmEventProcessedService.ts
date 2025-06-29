import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { ProcessedEvent } from '../../../../../analytics/user-activity/infrastructure/databases/mikroOrm/entities/ProcessedEvent.entity';
import { IProcessedEventService } from '../IProcessedEventService';

@Injectable()
export class MikroOrmProcessedEventService implements IProcessedEventService {
  private readonly processedEventRepository: EntityRepository<ProcessedEvent>;

  public constructor(private readonly em: EntityManager) {
    this.processedEventRepository = this.em.getRepository(ProcessedEvent);
  }

  public async save(eventId: string, eventType: string): Promise<void> {
    const processedEvent = new ProcessedEvent(eventId, eventType);

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
