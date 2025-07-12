import {
  getEntityManagerToken,
  getMikroORMToken,
  InjectMikroORM,
  MikroOrmModule,
} from '@mikro-orm/nestjs';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationShutdown,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as colorette from 'colorette';

import { COMMAND_BUS } from '../shared/commandBus/ICommandBus';
import { ProcessedCommandEntity } from '../shared/commandBus/infrastructure/mikroOrm/entities/ProcessedCommands.entity';
import { MikroOrmProcessedCommandService } from '../shared/commandBus/infrastructure/mikroOrm/MikroOrmCommandProcessedService';
import {
  IProcessedCommandService,
  PROCESSED_COMMAND_SERVICE,
} from '../shared/commandBus/IProcessedCommandService';
import { TransactionalCommandBus } from '../shared/commandBus/TransactionalCommandBus';
import { EVENT_BUS, IEventBus } from '../shared/events/eventBus/IEventBus';
import { FromDomainToRabbitMQIntegrationEventMapper } from '../shared/events/eventBus/infrastructure/FromDomainToIntegrationEventMapper';
import { RabbitMQConnection } from '../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQConnection';
import { RabbitMQPublisherEventBus } from '../shared/events/eventBus/infrastructure/rabbitMQ/RabbitMQPublisherEventBus';
import { ILogger, LOGGER } from '../shared/logger/ILogger';
import { WinstonLogger } from '../shared/logger/WinstonLogger';
import { RequiredIdempotentKeyMiddleware } from '../shared/middlewares/RequiredIdempotentKeyMiddleware/RequiredIdempotentKeyMiddleware';
import { SharedModule } from '../shared/shared.module';

import { LoginUserCommand } from './user/application/LoginUser/LoginUser.command';
import { LoginUserUseCase } from './user/application/LoginUser/LoginUser.usecase';
import { RegisterUserCommand } from './user/application/RegisterUser/RegisterUser.command';
import { RegisterUserUseCase } from './user/application/RegisterUser/RegisterUser.usecase';
import { ACCESS_TOKEN_MANAGER } from './user/domain/IAccessTokenManager';
import { PASSWORD_HASHER } from './user/domain/IPasswordHasher';
import { USER_REPOSITORY } from './user/domain/UserRepository';
import { JWTAccessTokenManager } from './user/infrastructure/accessTokenManager/JWTAccessTokenManager';
import { LoginUserController } from './user/infrastructure/controllers/LoginUser/LoginUser.controller';
import { RegisterUserController } from './user/infrastructure/controllers/RegisterUser/RegisterUser.controller';
import { UserEntity } from './user/infrastructure/databases/mikroOrm/entities/User.entity';
import { createMikroOrmCommandsDDBBBaseConfig } from './user/infrastructure/databases/mikroOrm/MikroOrmCommandsDDBB.base.config';
import { MikroOrmUserMapper } from './user/infrastructure/databases/mikroOrm/MikroOrmUserMapper';
import { MikroOrmUserRepository } from './user/infrastructure/databases/mikroOrm/MikroOrmUserRepository';
import { BCryptPasswordHasher } from './user/infrastructure/hashers/BCryptPasswordHasher';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SharedModule,
    MikroOrmModule.forRoot({
      contextName: 'auth',
      registerRequestContext: false,
      ...createMikroOrmCommandsDDBBBaseConfig(),
    }),
    MikroOrmModule.forFeature([UserEntity, ProcessedCommandEntity], 'auth'),
    MikroOrmModule.forMiddleware(),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_JWT_SECRET'),
      }),
    }),
  ],
  controllers: [RegisterUserController, LoginUserController],
  providers: [
    {
      provide: LOGGER,
      useFactory: (): ILogger => {
        return new WinstonLogger('AUTH-MODULE', colorette.blueBright);
      },
    },
    {
      provide: COMMAND_BUS,
      useFactory: (
        logger: ILogger,
        mikroOrm: MikroORM,
        processedCommandService: IProcessedCommandService,
      ): TransactionalCommandBus => {
        return new TransactionalCommandBus(
          logger,
          mikroOrm,
          processedCommandService,
        );
      },
      inject: [LOGGER, getMikroORMToken('auth'), PROCESSED_COMMAND_SERVICE],
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
        return new FromDomainToRabbitMQIntegrationEventMapper('auth');
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
          configService.get<string>('AUTH_RABBITMQ_EXCHANGE')!,
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
    {
      provide: USER_REPOSITORY,
      useClass: MikroOrmUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BCryptPasswordHasher,
    },
    {
      provide: ACCESS_TOKEN_MANAGER,
      useClass: JWTAccessTokenManager,
    },
    {
      provide: PROCESSED_COMMAND_SERVICE,
      useFactory: (em: EntityManager): MikroOrmProcessedCommandService => {
        return new MikroOrmProcessedCommandService(
          em.getRepository(ProcessedCommandEntity),
        );
      },
      inject: [getEntityManagerToken('auth')],
    },
    RegisterUserUseCase,
    MikroOrmUserMapper,
    LoginUserUseCase,
  ],
})
export class AuthModule
  implements OnModuleInit, OnApplicationShutdown, NestModule
{
  public constructor(
    @InjectMikroORM('auth') private readonly orm: MikroORM,
    @Inject(COMMAND_BUS) private readonly commandBus: TransactionalCommandBus,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    private readonly rabbitMQConnection: RabbitMQConnection,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequiredIdempotentKeyMiddleware)
      .forRoutes(
        { path: 'auth/users/register', method: RequestMethod.POST },
        { path: 'auth/users/login', method: RequestMethod.POST },
      );
  }

  public async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();

    this.commandBus.register(RegisterUserCommand, this.registerUserUseCase);
    this.commandBus.register(LoginUserCommand, this.loginUserUseCase);
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.orm.close(true);

    /* IMPORTANT: The order to close RabbitMQ stuff MATTERS!
     * 1. Close the RabbitMQ message handler/s first to stop receiving messages
     * 2. Close the RabbitMQ publisher to stop sending messages
     * 3. Close the RabbitMQ connection
     */
    await this.eventBus.close();
    await this.rabbitMQConnection.close();
  }
}
