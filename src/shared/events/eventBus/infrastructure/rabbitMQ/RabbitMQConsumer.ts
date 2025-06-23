import { AsyncMessage } from 'rabbitmq-client';

import { BaseCommand } from '../../../../commandBus/BaseCommand';
import { ICommandBus } from '../../../../commandBus/ICommandBus';

import { RabbitMQConnection } from './RabbitMQConnection';
import { RabbitMQIntegrationEvent } from './RabbitMQIntegrationEvent.type';

export abstract class RabbitMQConsumer<
  TEventData,
  TCommand extends BaseCommand,
> {
  protected constructor(
    private readonly rabbitMQConnection: RabbitMQConnection,
    private readonly commandBus: ICommandBus,
  ) {}

  protected abstract fromRabbitMQIntegrationEventToCommand(
    event: RabbitMQIntegrationEvent<TEventData>,
  ): TCommand;

  public async createConsumer(queueName: string): Promise<void> {
    const connection = await this.rabbitMQConnection.connect();

    connection.createConsumer(
      {
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
      async (message: AsyncMessage): Promise<void> => {
        const command = this.fromRabbitMQIntegrationEventToCommand(
          message.body as RabbitMQIntegrationEvent<TEventData>,
        );

        await this.commandBus.execute(command);
      },
    );
  }
}
