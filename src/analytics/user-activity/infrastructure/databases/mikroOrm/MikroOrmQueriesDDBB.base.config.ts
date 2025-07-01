import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { analyticsMigrations } from './migrations';

export const createMikroOrmQueriesDDBBBaseConfig = (): Options => ({
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  forceUndefined: true,
  ignoreUndefinedInQuery: true,
  entities: [
    'dist/src/analytics/**/infrastructure/databases/mikroOrm/entities/*.entity.js',
    'dist/src/shared/**/mikroOrm/entities/*.entity.js',
  ],
  entitiesTs: [
    'src/analytics/**/infrastructure/databases/mikroOrm/entities/*.entity.ts',
    'src/shared/**/mikroOrm/entities/*.entity.ts',
  ],
  dbName: process.env.ANALYTICS_QUERIES_DB_NAME,
  user: process.env.ANALYTICS_QUERIES_DB_USER,
  password: process.env.ANALYTICS_QUERIES_DB_PASSWORD,
  host: process.env.ANALYTICS_QUERIES_DB_HOST,
  port: Number(process.env.ANALYTICS_QUERIES_DB_PORT),
  debug: ['development'].includes(process.env.NODE_ENV!),
  colors: true,
  extensions: [Migrator],
  migrations: {
    path: 'dist/src/analytics/**/infrastructure/databases/mikroOrm/migrations',
    pathTs: 'src/analytics/**/infrastructure/databases/mikroOrm/migrations',
    transactional: true,
    allOrNothing: true,
    snapshot: true,
    migrationsList: analyticsMigrations,
  },
  seeder: {
    path: 'dist/src/analytics/**/infrastructure/databases/mikroOrm/seeders',
    pathTs: 'src/analytics/**/infrastructure/databases/mikroOrm/seeders',
  },
});

export default createMikroOrmQueriesDDBBBaseConfig;
