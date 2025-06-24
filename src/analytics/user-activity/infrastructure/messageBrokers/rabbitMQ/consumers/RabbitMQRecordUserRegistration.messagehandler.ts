import { Injectable, Inject } from '@nestjs/common';

import { IUserWasRegisteredEventData } from '../../../../../../auth/user/domain/events/UserRegistered.event';
import {
  COMMAND_BUS,
  ICommandBus,
} from '../../../../../../shared/commandBus/ICommandBus';
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
  ) {
    super(rabbitMQConnection, commandBus, logger);
  }

  protected fromRabbitMQIntegrationEventToCommand(
    event: RabbitMQIntegrationEvent<IUserWasRegisteredEventData>,
  ): RecordUserRegistrationCommand {
    return new RecordUserRegistrationCommand(
      event.data.userId,
      event.data.email,
      new Date(event.data.createdAt),
    );
  }
}
