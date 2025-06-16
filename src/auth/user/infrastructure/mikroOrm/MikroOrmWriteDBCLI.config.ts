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
  dbName: process.env.COMMAND_DB_NAME || 'postgres',
  host: process.env.COMMAND_DB_HOST || 'localhost',
  port: +(process.env.COMMAND_DB_PORT || 5430),
  user: process.env.COMMAND_DB_USER || 'postgres',
  password: process.env.COMMAND_DB_PASSWORD || 'postgres',
  entities: ['dist/src/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: ['development', 'test'].includes(process.env.NODE_ENV || ''),
  migrations: {
    path: 'dist/src/**/infrastructure/mikroOrm/migrations',
    pathTs: 'src/**/infrastructure/mikroOrm/migrations',
    transactional: true,
    allOrNothing: true,
    snapshot: true,
  },
  seeder: {
    path: 'dist/src/**/infrastructure/mikroOrm/seeders',
    pathTs: 'src/**/infrastructure/mikroOrm/seeders',
  },
};

export default config;
