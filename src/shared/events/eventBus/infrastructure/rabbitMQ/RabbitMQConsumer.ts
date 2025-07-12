import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';
import { Consumer } from 'rabbitmq-client';

import { BaseCommand } from '../../../../commandBus/BaseCommand';
import { ICommandBus } from '../../../../commandBus/ICommandBus';
import { ILogger } from '../../../../logger/ILogger';
import { IProcessedEventService } from '../../IProcessedEventService';

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
          return this.executeCommand(emFork, eventData);
        });
      },
    );
  }

  private async executeCommand(
    em: EntityManager,
    eventData: RabbitMQIntegrationEvent<TEventData>,
  ): Promise<void> {
    return em.transactional(async () => {
      if (
        await this.isEventAlreadyProcessed(
          eventData.eventId,
          eventData.eventType,
        )
      ) {
        return;
      }

      const command = this.fromRabbitMQIntegrationEventToCommand(eventData);

      try {
        await this.commandBus.execute(command);
        return this.markEventAsProcessed(
          eventData.eventId,
          eventData.eventType,
        );
      } catch (error: any) {
        //TODO: Handle failing events
        this.logger.error(
          `Error processing event ${eventData.eventType} with ID ${eventData.eventId}: ${error}`,
          error,
        );
      }
    });
  }

  private isEventAlreadyProcessed(
    eventId: string,
    eventType: string,
  ): Promise<boolean> {
    return this.processedEventService.isProcessed(eventId, eventType);
  }

  private markEventAsProcessed(
    eventId: string,
    eventType: string,
  ): Promise<void> {
    return this.processedEventService.save(eventId, eventType);
  }

  public async close(): Promise<void> {
    await this.consumer?.close();
    this.consumer = null;

    this.logger.info(`RabbitMQ ${this.constructor.name} closed`);
  }
}
