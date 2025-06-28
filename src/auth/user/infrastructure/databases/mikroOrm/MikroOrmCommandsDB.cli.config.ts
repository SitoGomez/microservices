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
  dbName: process.env.AUTH_COMMANDS_DB_NAME,
  host: process.env.AUTH_COMMANDS_DB_HOST,
  port: +process.env.AUTH_COMMANDS_DB_PORT!,
  user: process.env.AUTH_COMMANDS_DB_USER,
  password: process.env.AUTH_COMMANDS_DB_PASSWORD,
  entities: [
    'dist/src/auth/**/infrastructure/databases/mikroOrm/entities/*.entity.js',
  ],
  entitiesTs: [
    'src/auth/**/infrastructure/databases/mikroOrm/entities/*.entity.ts',
  ],
  metadataProvider: TsMorphMetadataProvider,
  debug: ['development'].includes(process.env.NODE_ENV!),
  migrations: {
    path: 'dist/src/auth/**/infrastructure/databases/mikroOrm/migrations',
    pathTs: 'src/auth/**/infrastructure/databases/mikroOrm/migrations',
    transactional: true,
    allOrNothing: true,
    snapshot: true,
  },
  seeder: {
    path: 'dist/src/auth/**/infrastructure/databases/mikroOrm/seeders',
    pathTs: 'src/auth/**/infrastructure/databases/mikroOrm/seeders',
  },
};

export default config;
