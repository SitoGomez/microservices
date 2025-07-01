import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { authMigrations } from './migrations';

export const createMikroOrmCommandsDDBBBaseConfig = (): Options => ({
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  forceUndefined: true,
  ignoreUndefinedInQuery: true,
  dbName: process.env.AUTH_COMMANDS_DB_NAME,
  user: process.env.AUTH_COMMANDS_DB_USER,
  password: process.env.AUTH_COMMANDS_DB_PASSWORD,
  host: process.env.AUTH_COMMANDS_DB_HOST,
  port: Number(process.env.AUTH_COMMANDS_DB_PORT),
  debug: process.env.NODE_ENV
    ? ['development'].includes(process.env.NODE_ENV)
    : false,
  colors: true,
  entities: [
    'dist/src/auth/**/infrastructure/databases/mikroOrm/entities/*.entity.js',
    'dist/src/shared/**/mikroOrm/entities/*.entity.js',
  ],
  entitiesTs: [
    'src/auth/**/infrastructure/databases/mikroOrm/entities/*.entity.ts',
    'src/shared/**/mikroOrm/entities/*.entity.ts',
  ],
  extensions: [Migrator],
  migrations: {
    path: 'dist/src/auth/**/infrastructure/databases/mikroOrm/migrations',
    pathTs: 'src/auth/**/infrastructure/databases/mikroOrm/migrations',
    transactional: true,
    allOrNothing: true,
    snapshot: true,
    migrationsList: authMigrations,
  },
  seeder: {
    path: 'dist/src/auth/**/infrastructure/databases/mikroOrm/seeders',
    pathTs: 'src/auth/**/infrastructure/databases/mikroOrm/seeders',
  },
});
