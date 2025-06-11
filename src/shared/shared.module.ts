import { Module } from '@nestjs/common';
import { InMemoryEventBus } from './eventBus/InMemoryEventBus';
import { EVENT_BUS } from './eventBus/IEventBus';
import { DOMAIN_EVENT_MANAGER } from './domainEvent/domain/IDomainEventManager';
import { InMemoryDomainEventManager } from './domainEvent/infrastructure/InMemoryDomainEventHandler';
import { SystemDateTimeService } from './dateTimeService/infrastructure/SystemDateTimeService';
import { DATE_TIME_SERVICE } from './dateTimeService/domain/IDateTimeService';
import { COMMAND_BUS } from './commandBus/ICommandBus';
import { InMemoryCommandBus } from './commandBus/CommandBus';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Migrator } from '@mikro-orm/migrations';
import { migrations } from './mikroOrm/migrations';

@Module({
  imports: [
    PrometheusModule.register(),
    MikroOrmModule.forRoot({
      entities: ['dist/src/shared/mikroOrm/entities'],
      entitiesTs: ['src/shared/mikroOrm/entities'],
      dbName: 'personal_db',
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5433,
      driver: PostgreSqlDriver,
      debug: true,
      colors: true,
      extensions: [Migrator],
      migrations: {
        path: 'dist/src/shared/mikroOrm/migrations',
        pathTs: 'src/shared/mikroOrm/migrations',
        transactional: true,
        allOrNothing: true,
        snapshot: true,
        migrationsList: migrations,
      },
    }),
  ],
  providers: [
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
    {
      provide: DOMAIN_EVENT_MANAGER,
      useClass: InMemoryDomainEventManager,
    },
    {
      provide: DATE_TIME_SERVICE,
      useClass: SystemDateTimeService,
    },
    {
      provide: COMMAND_BUS,
      useClass: InMemoryCommandBus,
    },
  ],
  exports: [
    EVENT_BUS,
    DOMAIN_EVENT_MANAGER,
    DATE_TIME_SERVICE,
    COMMAND_BUS,
    PrometheusModule,
  ],
})
export class SharedModule {}
