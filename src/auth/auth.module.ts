import { Module } from '@nestjs/common';
import { RegisterUserController } from './user/infrastructure/controllers/RegisterUser/RegisterUser.controller';
import { USER_REPOSITORY } from './user/domain/UserRepository';
import { InMemoryEventBus } from '../shared/eventBus/InMemoryEventBus';
import { EVENT_BUS } from '../shared/eventBus/IEventBus';
import { DOMAIN_EVENT_MANAGER } from '../shared/domainEvent/domain/IDomainEventManager';
import { InMemoryDomainEventManager } from '../shared/domainEvent/infrastructure/InMemoryDomainEventHandler';
import { SharedModule } from '../shared/shared.module';
import { RegisterUserUseCase } from './user/application/RegisterUser/RegisterUser.usecase';
import { MikroOrmUserRepository } from './user/infrastructure/mikroOrm/MikroOrmUserRepository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './user/infrastructure/mikroOrm/entities/User.entity';
import { MikroOrmUserMapper } from './user/infrastructure/mikroOrm/MikroOrmUserMapper';

@Module({
  imports: [SharedModule, MikroOrmModule.forFeature([UserEntity])],
  controllers: [RegisterUserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MikroOrmUserRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
    {
      provide: DOMAIN_EVENT_MANAGER,
      useClass: InMemoryDomainEventManager,
    },
    RegisterUserUseCase,
    MikroOrmUserMapper,
  ],
})
export class AuthModule {}
