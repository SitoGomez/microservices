import { Module } from '@nestjs/common';
import { InMemoryEventBus } from './eventBus/InMemoryEventBus';
import { EVENT_BUS } from './eventBus/IEventBus';
import { DOMAIN_EVENT_MANAGER } from './domainEvent/domain/IDomainEventManager';
import { InMemoryDomainEventManager } from './domainEvent/infrastructure/InMemoryDomainEventHandler';
import { SystemDateTimeService } from './dateTimeService/infrastructure/SystemDateTimeService';
import { DATE_TIME_SERVICE } from './dateTimeService/domain/IDateTimeService';
import { COMMAND_BUS } from './commandBus/ICommandBus';
import { InMemoryCommandBus } from './commandBus/CommandBus';

@Module({
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
    {
      provide: COMMAND_BUS,
      useClass: InMemoryCommandBus,
    },
  ],
  exports: [EVENT_BUS, DOMAIN_EVENT_MANAGER, DATE_TIME_SERVICE, COMMAND_BUS],
})
export class SharedModule {}
