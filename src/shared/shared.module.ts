import { Module } from '@nestjs/common';

import { InMemoryCommandBus } from './commandBus/CommandBus';
import { COMMAND_BUS, ICommandBus } from './commandBus/ICommandBus';
import { DATE_TIME_SERVICE } from './dateTimeService/domain/IDateTimeService';
import { SystemDateTimeService } from './dateTimeService/infrastructure/SystemDateTimeService';
import { EVENT_BUS } from './events/eventBus/domain/IEventBus';
import { InMemoryEventBus } from './events/eventBus/infrastructure/InMemoryEventBus';
import { ILogger, LOGGER } from './logger/ILogger';
import { WinstonLogger } from './logger/WinstonLogger';

@Module({
  providers: [
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
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
  exports: [EVENT_BUS, DATE_TIME_SERVICE],
})
export class SharedModule {}
