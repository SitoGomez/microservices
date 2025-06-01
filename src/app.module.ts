import { Module } from '@nestjs/common';
import { RegisterUserController } from './user/infrastructure/controllers/RegisterUser/RegisterUser.controller';
import { USER_REPOSITORY } from './user/domain/UserRepository';
import { InMemoryUserRepository } from './user/infrastructure/InMemoryUserRepository';
import { InMemoryEventBus } from './shared/eventBus/InMemoryEventBus';
import { EVENT_BUS } from './shared/eventBus/IEventBus';
import { DOMAIN_EVENT_MANAGER } from './shared/domainEvent/IDomainEventManager';
import { DomainEventManager } from './shared/domainEvent/DomainEventHandler';

@Module({
  imports: [],
  controllers: [RegisterUserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
    {
      provide: DOMAIN_EVENT_MANAGER,
      useClass: DomainEventManager,
    },
  ],
})
export class AppModule {}
