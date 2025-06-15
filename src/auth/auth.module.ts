import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { InMemoryCommandBus } from '../shared/commandBus/CommandBus';
import { COMMAND_BUS } from '../shared/commandBus/ICommandBus';
import { ILogger, LOGGER } from '../shared/logger/ILogger';
import { WinstonLogger } from '../shared/logger/WinstonLogger';
import { SharedModule } from '../shared/shared.module';

import { RegisterUserUseCase } from './user/application/RegisterUser/RegisterUser.usecase';
import { USER_REPOSITORY } from './user/domain/UserRepository';
import { RegisterUserController } from './user/infrastructure/controllers/RegisterUser/RegisterUser.controller';
import { UserEntity } from './user/infrastructure/mikroOrm/entities/User.entity';
import { MikroOrmUserMapper } from './user/infrastructure/mikroOrm/MikroOrmUserMapper';
import { MikroOrmUserRepository } from './user/infrastructure/mikroOrm/MikroOrmUserRepository';

@Module({
  imports: [SharedModule, MikroOrmModule.forFeature([UserEntity])],
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
    RegisterUserUseCase,
    MikroOrmUserMapper,
  ],
})
export class AuthModule {}
