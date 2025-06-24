import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'rabbitmq-client';

import { ILogger, LOGGER } from '../../../../logger/ILogger';

@Injectable()
export class RabbitMQConnection {
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

  public async close(): Promise<void> {
    await this.connection?.close();
    this.connection = null;

    this.logger.info('RabbitMQ CONNECTION closed');
  }
}
