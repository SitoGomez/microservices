import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IProcessedEventService } from '../../../../../../shared/events/eventBus/infrastructure/IProcessedEventService';
import { ProcessedEvent } from '../entities/ProcessedEvent.entity';

@Injectable()
export class MikroOrmProcessedEventService implements IProcessedEventService {
  private readonly processedEventRepository: EntityRepository<ProcessedEvent>;

  public constructor(
    @InjectEntityManager('analytics') private readonly em: EntityManager,
  ) {
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
