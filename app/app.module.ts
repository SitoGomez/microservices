import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Migrator } from '@mikro-orm/migrations';
import { migrations } from '../src/auth/user/infrastructure/mikroOrm/migrations';
import { SharedModule } from '../src/shared/shared.module';
import { AuthModule } from '../src/auth/auth.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    PrometheusModule.register(),
    MikroOrmModule.forRoot({
      entities: ['dist/src/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
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
        path: 'dist/src/**/infrastructure/mikroOrm/migrations',
        pathTs: 'src/**/infrastructure/mikroOrm/migrations',
        transactional: true,
        allOrNothing: true,
        snapshot: true,
        migrationsList: migrations,
      },
    }),
  ],
  exports: [PrometheusModule],
})
export class AppModule {}
