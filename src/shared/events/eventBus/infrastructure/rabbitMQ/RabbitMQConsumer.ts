import { AsyncMessage, Consumer } from 'rabbitmq-client';

import { BaseCommand } from '../../../../commandBus/BaseCommand';
import { ICommandBus } from '../../../../commandBus/ICommandBus';
import { ILogger } from '../../../../logger/ILogger';

import { RabbitMQConnection } from './RabbitMQConnection';
import { RabbitMQIntegrationEvent } from './RabbitMQIntegrationEvent.type';

export abstract class RabbitMQConsumer<
  TEventData,
  TCommand extends BaseCommand,
> {
  protected consumer: Consumer | null;

  protected constructor(
    private readonly rabbitMQConnection: RabbitMQConnection,
    private readonly commandBus: ICommandBus,
    private readonly logger: ILogger,
  ) {}

  protected abstract fromRabbitMQIntegrationEventToCommand(
    event: RabbitMQIntegrationEvent<TEventData>,
  ): TCommand;

  public async createConsumer(queueName: string): Promise<void> {
    const connection = await this.rabbitMQConnection.connect();

    this.consumer = connection.createConsumer(
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

  public async close(): Promise<void> {
    await this.consumer?.close();
    this.consumer = null;

    this.logger.info(`RabbitMQ ${this.constructor.name} closed`);
  }
}
