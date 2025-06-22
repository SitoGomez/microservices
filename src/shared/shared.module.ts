import { Module } from '@nestjs/common';

import { InMemoryCommandBus } from './commandBus/CommandBus';
import { COMMAND_BUS, ICommandBus } from './commandBus/ICommandBus';
import { DATE_TIME_SERVICE } from './dateTimeService/domain/IDateTimeService';
import { SystemDateTimeService } from './dateTimeService/infrastructure/SystemDateTimeService';
import { EVENT_BUS } from './events/eventBus/domain/IEventBus';
import { FromDomainToRabbitMQIntegrationEventMapper } from './events/eventBus/infrastructure/FromDomainToIntegrationEventMapper';
import { RabbitMQConnection } from './events/eventBus/infrastructure/rabbitMQ/RabbitMQConnection';
import { RabbitMQPublisherEventBus } from './events/eventBus/infrastructure/rabbitMQ/RabbitMQPublisherEventBus';
import { ILogger, LOGGER } from './logger/ILogger';
import { WinstonLogger } from './logger/WinstonLogger';

@Module({
  providers: [
    {
      provide: EVENT_BUS,
      useFactory: (
        rabbitMQConnection: RabbitMQConnection,
        fromDomainToIntegrationEventMapper: FromDomainToRabbitMQIntegrationEventMapper,
      ): RabbitMQPublisherEventBus => {
        return new RabbitMQPublisherEventBus(
          '⚠️ BOUNDED CONTEXT NAME NOT CONFIGURED, you should configure this in each module and avoid using this ⚠️',
          rabbitMQConnection,
          fromDomainToIntegrationEventMapper,
        );
      },
      inject: [RabbitMQConnection, FromDomainToRabbitMQIntegrationEventMapper],
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
    RabbitMQConnection,
    {
      provide: FromDomainToRabbitMQIntegrationEventMapper,
      useFactory: (): FromDomainToRabbitMQIntegrationEventMapper => {
        return new FromDomainToRabbitMQIntegrationEventMapper(
          '⚠️ BOUNDED CONTEXT NAME NOT CONFIGURED, you should configure this in each module and avoid using this ⚠️',
        );
      },
    },
  ],
  exports: [DATE_TIME_SERVICE],
})
export class SharedModule {}
