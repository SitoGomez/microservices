import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { InMemoryCommandBus } from '../shared/commandBus/CommandBus';
import { COMMAND_BUS } from '../shared/commandBus/ICommandBus';
import { ILogger, LOGGER } from '../shared/logger/ILogger';
import { WinstonLogger } from '../shared/logger/WinstonLogger';
import { SharedModule } from '../shared/shared.module';

import { RegisterUserUseCase } from './user/application/RegisterUser/RegisterUser.usecase';
import { PASSWORD_HASHER } from './user/domain/IPasswordHasher';
import { USER_REPOSITORY } from './user/domain/UserRepository';
import { RegisterUserController } from './user/infrastructure/controllers/RegisterUser/RegisterUser.controller';
import { UserEntity } from './user/infrastructure/databases/mikroOrm/entities/User.entity';
import { authMigrations } from './user/infrastructure/databases/mikroOrm/migrations';
import { MikroOrmUserMapper } from './user/infrastructure/databases/mikroOrm/MikroOrmUserMapper';
import { MikroOrmUserRepository } from './user/infrastructure/databases/mikroOrm/MikroOrmUserRepository';
import { BCryptPasswordHasher } from './user/infrastructure/hashers/BCryptPasswordHasher';
@Module({
  imports: [
    SharedModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => ({
        entities: ['dist/src/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        dbName: configService.get<string>('COMMAND_DB_NAME', 'postgres'),
        user: configService.get<string>('COMMAND_DB_USER', 'postgres'),
        password: configService.get<string>('COMMAND_DB_PASSWORD', 'postgres'),
        host: configService.get<string>('COMMAND_DB_HOST', 'localhost'),
        port: configService.get<number>('COMMAND_DB_PORT', 5430),
        driver: PostgreSqlDriver,
        debug: ['development', 'test'].includes(
          configService.get<string>('NODE_ENV', 'otherEnvironment'),
        ),
        colors: true,
        extensions: [Migrator],
        migrations: {
          path: 'dist/src/**/infrastructure/mikroOrm/migrations',
          pathTs: 'src/**/infrastructure/mikroOrm/migrations',
          transactional: true,
          allOrNothing: true,
          snapshot: true,
          migrationsList: authMigrations,
        },
      }),
    }),
    MikroOrmModule.forFeature([UserEntity]),
  ],
  controllers: [RegisterUserController],
  providers: [
    {
      provide: LOGGER,
      useFactory: (): ILogger => {
        return new WinstonLogger('AUTH-MODULE');
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
      provide: USER_REPOSITORY,
      useClass: MikroOrmUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BCryptPasswordHasher,
    },
    RegisterUserUseCase,
    MikroOrmUserMapper,
  ],
})
export class AuthModule {}
