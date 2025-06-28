import {
  getMikroORMToken,
  InjectMikroORM,
  MikroOrmModule,
} from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/postgresql';
import {
  Inject,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as colorette from 'colorette';

import { COMMAND_BUS } from '../shared/commandBus/ICommandBus';
import { TransactionalCommandBus } from '../shared/commandBus/TransactionalCommandBus';
import {
  EVENT_BUS,
  IEventBus,
} from '../shared/events/eventBus/domain/IEventBus';
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
import { createMikroOrmQueriesDDBBBaseConfig } from './user-activity/infrastructure/databases/mikroOrm/MikroOrmQueriesDDBB.base.config';
import { MikroOrmUserActivityReadLayer } from './user-activity/infrastructure/databases/mikroOrm/MikroOrmUserActivityReadLayer';
import { RabbitMQRecordUserRegistrationMessageHandler } from './user-activity/infrastructure/messageBrokers/rabbitMQ/consumers/RabbitMQRecordUserRegistration.messagehandler';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MikroOrmModule.forRoot({
      contextName: 'analytics',
      registerRequestContext: false,
      ...createMikroOrmQueriesDDBBBaseConfig(),
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
      useFactory: (
        logger: ILogger,
        mikroOrm: MikroORM,
      ): TransactionalCommandBus => {
        return new TransactionalCommandBus(logger, mikroOrm);
      },
      inject: [LOGGER, getMikroORMToken('analytics')],
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
        logger: ILogger,
      ): RabbitMQPublisherEventBus => {
        return new RabbitMQPublisherEventBus(
          configService.get<string>('ANALYTICS_RABBITMQ_EXCHANGE')!,
          rabbitMQConnection,
          fromDomainToIntegrationEventMapper,
          logger,
        );
      },
      inject: [
        ConfigService,
        RabbitMQConnection,
        FromDomainToRabbitMQIntegrationEventMapper,
        LOGGER,
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
export class AnalyticsModule implements OnModuleInit, OnApplicationShutdown {
  public constructor(
    @InjectMikroORM('analytics') private readonly orm: MikroORM,
    @Inject(COMMAND_BUS) private readonly commandBus: TransactionalCommandBus,
    private readonly recordUserRegistrationUseCase: RecordUserRegistrationUseCase,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    private readonly rabbitMQRecordUserRegistrationMessageHandler: RabbitMQRecordUserRegistrationMessageHandler,
    private readonly rabbitMQConnection: RabbitMQConnection,
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

  public async onApplicationShutdown(): Promise<void> {
    await this.orm.close(true);

    /* IMPORTANT: The order to close RabbitMQ stuff MATTERS!
     * 1. Close the RabbitMQ message handler/s first to stop receiving messages
     * 2. Close the RabbitMQ publisher to stop sending messages
     * 3. Close the RabbitMQ connection
     */
    await this.rabbitMQRecordUserRegistrationMessageHandler.close();
    await this.eventBus.close();
    await this.rabbitMQConnection.close();
  }
}
