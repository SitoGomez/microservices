import { MikroORM, RequestContext } from '@mikro-orm/core';
import { Consumer } from 'rabbitmq-client';

import { BaseCommand } from '../../../../commandBus/BaseCommand';
import { ICommandBus } from '../../../../commandBus/ICommandBus';
import { ILogger } from '../../../../logger/ILogger';
import { IProcessedEventService } from '../IProcessedEventService';

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
    private readonly mikroOrm: MikroORM,
    private readonly processedEventService: IProcessedEventService,
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
      async ({
        body: eventData,
      }: {
        body: RabbitMQIntegrationEvent<TEventData>;
      }): Promise<void> => {
        const emFork = this.mikroOrm.em.fork({ useContext: true });

        return RequestContext.create(emFork, async () => {
          return emFork.transactional(async () => {
            const isEventAlreadyProcessed =
              await this.processedEventService.isProcessed(
                eventData.eventId,
                eventData.eventType,
              );

            if (isEventAlreadyProcessed) {
              return;
            }

            const command =
              this.fromRabbitMQIntegrationEventToCommand(eventData);

            await this.commandBus.execute(command);

            await this.processedEventService.save(
              eventData.eventId,
              eventData.eventType,
            );
          });
        });
      },
    );
  }

  public async close(): Promise<void> {
    await this.consumer?.close();
    this.consumer = null;

    this.logger.info(`RabbitMQ ${this.constructor.name} closed`);
  }
}
