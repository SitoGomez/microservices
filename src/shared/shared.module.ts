import { Module } from '@nestjs/common';

import { InMemoryCommandBus } from './commandBus/CommandBus';
import { COMMAND_BUS, ICommandBus } from './commandBus/ICommandBus';
import { DATE_TIME_SERVICE } from './dateTimeService/domain/IDateTimeService';
import { SystemDateTimeService } from './dateTimeService/infrastructure/SystemDateTimeService';
import { DOMAIN_EVENT_MANAGER } from './domainEvent/domain/IDomainEventManager';
import { InMemoryDomainEventManager } from './domainEvent/infrastructure/InMemoryDomainEventHandler';
import { EVENT_BUS } from './eventBus/IEventBus';
import { InMemoryEventBus } from './eventBus/InMemoryEventBus';
import { ILogger, LOGGER } from './logger/ILogger';
import { WinstonLogger } from './logger/WinstonLogger';

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
      provide: LOGGER,
      useFactory: (): ILogger => {
        return new WinstonLogger(
          '⚠️ SERVICE NAME NOT CONFIGURED, you should configure this in each module and avoid using this ⚠️',
        );
      },
    },
    {
      provide: COMMAND_BUS,
      useFactory: (logger: ILogger): ICommandBus => {
        return new InMemoryCommandBus(logger);
      },
      inject: [LOGGER],
    },
  ],
  exports: [EVENT_BUS, DOMAIN_EVENT_MANAGER, DATE_TIME_SERVICE, COMMAND_BUS],
})
export class SharedModule {}
