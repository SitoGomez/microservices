import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { InMemoryCommandBus } from '../shared/commandBus/CommandBus';
import { COMMAND_BUS } from '../shared/commandBus/ICommandBus';
import { ILogger, LOGGER } from '../shared/logger/ILogger';
import { WinstonLogger } from '../shared/logger/WinstonLogger';
import { SharedModule } from '../shared/shared.module';

import { LoginUserUseCase } from './user/application/LoginUser/LoginUser.usecase';
import { RegisterUserUseCase } from './user/application/RegisterUser/RegisterUser.usecase';
import { ACCESS_TOKEN_MANAGER } from './user/domain/IAccessTokenManager';
import { PASSWORD_HASHER } from './user/domain/IPasswordHasher';
import { USER_REPOSITORY } from './user/domain/UserRepository';
import { JWTAccessTokenManager } from './user/infrastructure/accessTokenManager/JWTAccessTokenManager';
import { LoginUserController } from './user/infrastructure/controllers/LoginUser/LoginUser.controller';
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
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [RegisterUserController, LoginUserController],
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
    {
      provide: ACCESS_TOKEN_MANAGER,
      useClass: JWTAccessTokenManager,
    },
    RegisterUserUseCase,
    MikroOrmUserMapper,
    LoginUserUseCase,
  ],
})
export class AuthModule {}
