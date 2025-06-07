import { Module } from '@nestjs/common';
import { InMemoryEventBus } from './eventBus/InMemoryEventBus';
import { EVENT_BUS } from './eventBus/IEventBus';
import { DOMAIN_EVENT_MANAGER } from './domainEvent/domain/IDomainEventManager';
import { InMemoryDomainEventManager } from './domainEvent/infrastructure/InMemoryDomainEventHandler';
import { SystemDateTimeService } from './dateTimeService/infrastructure/SystemDateTimeService';
import { DATE_TIME_SERVICE } from './dateTimeService/domain/IDateTimeService';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
    {
      provide: DOMAIN_EVENT_MANAGER,
      useClass: InMemoryDomainEventManager,
    },
    {
      provide: DATE_TIME_SERVICE,
      useClass: SystemDateTimeService,
    },
  ],
})
export class SharedModule {}
