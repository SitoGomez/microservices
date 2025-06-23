import { Migrator } from '@mikro-orm/migrations';
import { InjectMikroORM, MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as colorette from 'colorette';

import { COMMAND_BUS } from '../shared/commandBus/ICommandBus';
import { InMemoryCommandBus } from '../shared/commandBus/InMemoryCommandBus';
import { EVENT_BUS } from '../shared/events/eventBus/domain/IEventBus';
import { FromDomainToRabbitMQIntegrationEventMapper } from '../shared/events/eventBus/infrastructure/FromDomainToIntegrationEventMapper';
import { RabbitMQConnection } from '../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQConnection';
import { RabbitMQPublisherEventBus } from '../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQPublisherEventBus';
import { ILogger, LOGGER } from '../shared/logger/ILogger';
import { WinstonLogger } from '../shared/logger/WinstonLogger';
import { SharedModule } from '../shared/shared.module';

import { USER_ACTIVITY_READ_LAYER } from './user-activity/application/IUserActivityReadLayer';
import { RecordUserRegistrationUseCase } from './user-activity/application/RecordUserRegistration/RecordUserRegistration.usecase';
import { RecordUserRegistrationCommand } from './user-activity/application/RecordUserRegistration/RecordUserRegistrationCommand';
import { UserActivity } from './user-activity/infrastructure/databases/mikroOrm/entities/UserActivity.entity';
import { analyticsMigrations } from './user-activity/infrastructure/databases/mikroOrm/migrations';
import { MikroOrmUserActivityReadLayer } from './user-activity/infrastructure/databases/mikroOrm/MikroOrmUserActivityReadLayer';
import { RabbitMQRecordUserRegistrationMessageHandler } from './user-activity/infrastructure/messageBrokers/rabbitMQ/consumers/RabbitMQRecordUserRegistration.messagehandler';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.development' : '',
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      contextName: 'analytics',
      useFactory: (configService: ConfigService) => ({
        registerRequestContext: false,
        driver: PostgreSqlDriver,
        metadataProvider: TsMorphMetadataProvider,
        forceUndefined: true,
        ignoreUndefinedInQuery: true,
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
    MikroOrmModule.forFeature([UserActivity], 'analytics'),
    MikroOrmModule.forMiddleware(),
  ],
  providers: [
    {
      provide: LOGGER,
      useFactory: (): ILogger => {
        return new WinstonLogger('ANALYTICS-MODULE', colorette.magentaBright);
      },
    },
    {
      provide: COMMAND_BUS,
      useFactory: (logger: ILogger): InMemoryCommandBus => {
        return new InMemoryCommandBus(logger);
      },
      inject: [LOGGER],
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
    RabbitMQRecordUserRegistrationMessageHandler,
    RecordUserRegistrationUseCase,
    {
      provide: USER_ACTIVITY_READ_LAYER,
      useClass: MikroOrmUserActivityReadLayer,
    },
  ],
})
export class AnalyticsModule implements OnModuleInit {
  public constructor(
    @InjectMikroORM('analytics') private readonly orm: MikroORM,
    @Inject(COMMAND_BUS) private readonly commandBus: InMemoryCommandBus,
    private readonly recordUserRegistrationUseCase: RecordUserRegistrationUseCase,
    private readonly rabbitMQRecordUserRegistrationMessageHandler: RabbitMQRecordUserRegistrationMessageHandler,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();

    this.commandBus.register(
      RecordUserRegistrationCommand,
      this.recordUserRegistrationUseCase,
    );

    await this.rabbitMQRecordUserRegistrationMessageHandler.createConsumer(
      'analytics.user-activity.user-registered.queue',
    );
  }
}
