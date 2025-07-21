import { EntityManager } from '@mikro-orm/core';
import {
  getEntityManagerToken,
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
import { ScheduleModule } from '@nestjs/schedule';
import * as colorette from 'colorette';

import { COMMAND_BUS } from '../shared/commandBus/ICommandBus';
import { ProcessedCommandEntity } from '../shared/commandBus/infrastructure/mikroOrm/entities/ProcessedCommands.entity';
import { MikroOrmProcessedCommandService } from '../shared/commandBus/infrastructure/mikroOrm/MikroOrmCommandProcessedService';
import {
  IProcessedCommandService,
  PROCESSED_COMMAND_SERVICE,
} from '../shared/commandBus/IProcessedCommandService';
import { TransactionalCommandBus } from '../shared/commandBus/TransactionalCommandBus';
import { MikroOrmProcessedEventService } from '../shared/events/eventBus/infrastructure/mikroOrm/MikroOrmEventProcessedService';
import { RabbitMQConnection } from '../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQConnection';
import { PROCESSED_EVENT_SERVICE } from '../shared/events/eventBus/IProcessedEventService';
import { ILogger, LOGGER } from '../shared/logger/ILogger';
import { WinstonLogger } from '../shared/logger/WinstonLogger';
import { InMemoryQueryBus } from '../shared/queryBus/InMemoryQueryBus';
import { QUERY_BUS } from '../shared/queryBus/IQueryBus';
import { SharedModule } from '../shared/shared.module';

import { GenerateTopHundredActiveUsersReportUseCase } from './user-activity/application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReport.usecase';
import { GenerateTopHundredActiveUsersReportQuery } from './user-activity/application/GenerateTopHundredActiveUsersReport/GenerateTopHundredActiveUsersReportQuery';
import { USERS_REPORT_GENERATOR } from './user-activity/application/GenerateTopHundredActiveUsersReport/IUsersReportGenerator';
import { USER_ACTIVITY_READ_LAYER } from './user-activity/application/IUserActivityReadLayer';
import { RecordUserRegistrationUseCase } from './user-activity/application/RecordUserRegistration/RecordUserRegistration.usecase';
import { RecordUserRegistrationCommand } from './user-activity/application/RecordUserRegistration/RecordUserRegistrationCommand';
import { ProcessedEventEntity } from './user-activity/infrastructure/databases/mikroOrm/entities/ProcessedEvent.entity';
import { UserActivityEntity } from './user-activity/infrastructure/databases/mikroOrm/entities/UserActivity.entity';
import { createMikroOrmQueriesDDBBBaseConfig } from './user-activity/infrastructure/databases/mikroOrm/MikroOrmQueriesDDBB.base.config';
import { MikroOrmUserActivityReadLayer } from './user-activity/infrastructure/databases/mikroOrm/MikroOrmUserActivityReadLayer';
import { RabbitMQRecordUserRegistrationMessageHandler } from './user-activity/infrastructure/messageBrokers/rabbitMQ/consumers/RabbitMQRecordUserRegistration.messagehandler';
import { CSVUserReportGenerator } from './user-activity/infrastructure/reports/CSVUsersReportGenerator';
import { GenerateTopHundredActiveUsersReportScheduler } from './user-activity/infrastructure/schedulers/GenerateTopHundredActiveUsersReportScheduler';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SharedModule,
    MikroOrmModule.forRoot({
      contextName: 'analytics',
      registerRequestContext: false,
      ...createMikroOrmQueriesDDBBBaseConfig(),
    }),
    MikroOrmModule.forFeature(
      [UserActivityEntity, ProcessedEventEntity, ProcessedCommandEntity],
      'analytics',
    ),
    MikroOrmModule.forMiddleware(),
    ScheduleModule.forRoot(),
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
        mikroORM: MikroORM,
        processedCommandService: IProcessedCommandService,
      ): TransactionalCommandBus => {
        return new TransactionalCommandBus(
          logger,
          mikroORM,
          processedCommandService,
        );
      },
      inject: [
        LOGGER,
        getMikroORMToken('analytics'),
        PROCESSED_COMMAND_SERVICE,
      ],
    },
    {
      provide: QUERY_BUS,
      useFactory: (logger: ILogger): InMemoryQueryBus => {
        return new InMemoryQueryBus(logger);
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
    RabbitMQRecordUserRegistrationMessageHandler,
    RecordUserRegistrationUseCase,
    {
      provide: USER_ACTIVITY_READ_LAYER,
      useClass: MikroOrmUserActivityReadLayer,
    },
    {
      provide: USERS_REPORT_GENERATOR,
      useClass: CSVUserReportGenerator,
    },
    GenerateTopHundredActiveUsersReportUseCase,
    GenerateTopHundredActiveUsersReportScheduler,
    {
      provide: PROCESSED_EVENT_SERVICE,
      useFactory: (em: EntityManager): MikroOrmProcessedEventService => {
        return new MikroOrmProcessedEventService(
          em.getRepository(ProcessedEventEntity),
        );
      },
      inject: [getEntityManagerToken('analytics')],
    },
    {
      provide: PROCESSED_COMMAND_SERVICE,
      useFactory: (em: EntityManager): MikroOrmProcessedCommandService => {
        return new MikroOrmProcessedCommandService(
          em.getRepository(ProcessedCommandEntity),
        );
      },
      inject: [getEntityManagerToken('analytics')],
    },
  ],
})
export class AnalyticsModule implements OnModuleInit, OnApplicationShutdown {
  public constructor(
    @InjectMikroORM('analytics') private readonly orm: MikroORM,
    @Inject(COMMAND_BUS) private readonly commandBus: TransactionalCommandBus,
    @Inject(QUERY_BUS) private readonly queryBus: InMemoryQueryBus,
    private readonly recordUserRegistrationUseCase: RecordUserRegistrationUseCase,
    private readonly generateTopHundredActiveUsersReportUseCase: GenerateTopHundredActiveUsersReportUseCase,
    private readonly rabbitMQRecordUserRegistrationMessageHandler: RabbitMQRecordUserRegistrationMessageHandler,
    private readonly rabbitMQConnection: RabbitMQConnection,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();

    this.commandBus.register(
      RecordUserRegistrationCommand,
      this.recordUserRegistrationUseCase,
    );

    this.queryBus.register(
      GenerateTopHundredActiveUsersReportQuery,
      this.generateTopHundredActiveUsersReportUseCase,
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
    await this.rabbitMQConnection.close();
  }
}
