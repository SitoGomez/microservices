import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EVENT_BUS } from '../shared/events/eventBus/domain/IEventBus';
import { FromDomainToRabbitMQIntegrationEventMapper } from '../shared/events/eventBus/infrastructure/FromDomainToIntegrationEventMapper';
import { RabbitMQConnection } from '../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQConnection';
import { RabbitMQPublisherEventBus } from '../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQPublisherEventBus';
import { ILogger, LOGGER } from '../shared/logger/ILogger';
import { WinstonLogger } from '../shared/logger/WinstonLogger';

import { analyticsMigrations } from './user-activity/infrastructure/databases/mikroOrm/migrations';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => ({
        entities: [
          'dist/src/analytics/**/infrastructure/databases/mikroOrm/entities/*.entity.js',
        ],
        entitiesTs: [
          'src/analytics/**/infrastructure/databases/mikroOrm/entities/*.entity.ts',
        ],
        dbName: configService.get<string>(
          'ANALYTICS_QUERIES_DB_NAME',
          'postgres',
        ),
        user: configService.get<string>(
          'ANALYTICS_QUERIES_DB_USER',
          'postgres',
        ),
        password: configService.get<string>(
          'ANALYTICS_QUERIES_DB_PASSWORD',
          'postgres',
        ),
        host: configService.get<string>(
          'ANALYTICS_QUERIES_DB_HOST',
          'localhost',
        ),
        port: configService.get<number>('ANALYTICS_QUERIES_DB_PORT', 5430),
        driver: PostgreSqlDriver,
        debug: ['development', 'test'].includes(
          configService.get<string>('NODE_ENV', 'otherEnvironment'),
        ),
        colors: true,
        extensions: [Migrator],
        migrations: {
          path: 'dist/src/analytics/**/infrastructure/databases/mikroOrm/migrations',
          pathTs:
            'src/analytics/**/infrastructure/databases/mikroOrm/migrations',
          transactional: true,
          allOrNothing: true,
          snapshot: true,
          migrationsList: analyticsMigrations,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: LOGGER,
      useFactory: (): ILogger => {
        return new WinstonLogger('ANALYTICS-MODULE');
      },
    },
    {
      provide: RabbitMQConnection,
      useFactory: (
        configService: ConfigService,
        logger: ILogger,
      ): RabbitMQConnection => {
        return new RabbitMQConnection(configService, logger);
      },
      inject: [ConfigService, LOGGER],
    },
    {
      provide: FromDomainToRabbitMQIntegrationEventMapper,
      useFactory: (): FromDomainToRabbitMQIntegrationEventMapper => {
        return new FromDomainToRabbitMQIntegrationEventMapper('analytics');
      },
    },
    {
      provide: EVENT_BUS,
      useFactory: (
        configService: ConfigService,
        rabbitMQConnection: RabbitMQConnection,
        fromDomainToIntegrationEventMapper: FromDomainToRabbitMQIntegrationEventMapper,
      ): RabbitMQPublisherEventBus => {
        return new RabbitMQPublisherEventBus(
          configService.get<string>('ANALYTICS_RABBITMQ_EXCHANGE', ''),
          rabbitMQConnection,
          fromDomainToIntegrationEventMapper,
        );
      },
      inject: [
        ConfigService,
        RabbitMQConnection,
        FromDomainToRabbitMQIntegrationEventMapper,
      ],
    },
  ],
})
export class AnalyticsModule {}
