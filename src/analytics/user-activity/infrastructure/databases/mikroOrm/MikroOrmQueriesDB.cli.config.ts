import * as path from 'path';

import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { config as loadEnv } from 'dotenv';

(loadEnv as unknown as (options: { path: string }) => void)({
  path: path.resolve(process.cwd(), `.env.development`),
});

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: process.env.ANALYTICS_QUERIES_DB_NAME || 'postgres',
  host: process.env.ANALYTICS_QUERIES_DB_HOST || 'localhost',
  port: +(process.env.ANALYTICS_QUERIES_DB_PORT || 5430),
  user: process.env.ANALYTICS_QUERIES_DB_USER || 'postgres',
  password: process.env.ANALYTICS_QUERIES_DB_PASSWORD || 'postgres',
  entities: [
    'dist/src/analytics/**/infrastructure/databases/mikroOrm/entities/*.entity.js',
  ],
  entitiesTs: [
    'src/analytics/**/infrastructure/databases/mikroOrm/entities/*.entity.ts',
  ],
  metadataProvider: TsMorphMetadataProvider,
  debug: ['development', 'test'].includes(process.env.NODE_ENV || ''),
  migrations: {
    path: 'dist/src/analytics/**/infrastructure/databases/mikroOrm/migrations',
    pathTs: 'src/analytics/**/infrastructure/databases/mikroOrm/migrations',
    transactional: true,
    allOrNothing: true,
    snapshot: true,
  },
  seeder: {
    path: 'dist/src/analytics/**/infrastructure/databases/mikroOrm/seeders',
    pathTs: 'src/analytics/**/infrastructure/databases/mikroOrm/seeders',
  },
};

export default config;
