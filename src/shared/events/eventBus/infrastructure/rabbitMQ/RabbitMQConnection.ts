import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'rabbitmq-client';

import { ILogger, LOGGER } from '../../../../logger/ILogger';

@Injectable()
export class RabbitMQConnection implements OnModuleDestroy {
  private connection: Connection | null;

  public constructor(
    private readonly configService: ConfigService,
    @Inject(LOGGER) private readonly logger: ILogger,
  ) {}

  public async connect(): Promise<Connection> {
    if (!this.connection) {
      this.connection = new Connection(
        `amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_HOST')}:${this.configService.get<string>('RABBITMQ_PORT')}`,
      );
    }

    if (this.connection.ready) {
      return this.connection;
    }

    try {
      await this.connection.onConnect();
      this.logger.info('RabbitMQ connection established successfully');

      return this.connection;
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw new Error('RabbitMQ connection failed');
    }
  }

  /**
   * @internal DONT USE THIS METHOD DIRECTLY, ITS FOR NEST JS MODULE LIFECYCLE
   */
  public async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
    this.logger.info('RabbitMQ connection closed');
  }
}
