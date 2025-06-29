import { randomUUID } from 'crypto';

import { MikroORM } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { Injectable, Inject } from '@nestjs/common';

import { IUserWasRegisteredEventData } from '../../../../../../auth/user/domain/events/UserRegistered.event';
import {
  COMMAND_BUS,
  ICommandBus,
} from '../../../../../../shared/commandBus/ICommandBus';
import {
  IProcessedEventService,
  PROCESSED_EVENT_SERVICE,
} from '../../../../../../shared/events/eventBus/infrastructure/IProcessedEventService';
import { RabbitMQConnection } from '../../../../../../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQConnection';
import { RabbitMQConsumer } from '../../../../../../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQConsumer';
import { RabbitMQIntegrationEvent } from '../../../../../../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQIntegrationEvent.type';
import { LOGGER, ILogger } from '../../../../../../shared/logger/ILogger';
import { RecordUserRegistrationCommand } from '../../../../application/RecordUserRegistration/RecordUserRegistrationCommand';

@Injectable()
export class RabbitMQRecordUserRegistrationMessageHandler extends RabbitMQConsumer<
  IUserWasRegisteredEventData,
  RecordUserRegistrationCommand
> {
  public constructor(
    rabbitMQConnection: RabbitMQConnection,
    @Inject(COMMAND_BUS) commandBus: ICommandBus,
    @Inject(LOGGER) logger: ILogger,
    @Inject(getMikroORMToken('analytics')) mikroOrm: MikroORM,
    @Inject(PROCESSED_EVENT_SERVICE)
    processedEventService: IProcessedEventService,
  ) {
    super(
      rabbitMQConnection,
      commandBus,
      logger,
      mikroOrm,
      processedEventService,
    );
  }

  protected fromRabbitMQIntegrationEventToCommand(
    event: RabbitMQIntegrationEvent<IUserWasRegisteredEventData>,
  ): RecordUserRegistrationCommand {
    return new RecordUserRegistrationCommand(
      randomUUID(),
      event.data.userId,
      event.data.email,
      new Date(event.data.createdAt),
    );
  }
}
