import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { FarmaredDB } from '@/types/database';

const config = {
  host: process.env.DB_CHILE_HOST || 'localhost',
  port: parseInt(process.env.DB_CHILE_PORT || '5432'),
  user: process.env.DB_CHILE_USER || 'postgres',
  password: process.env.DB_CHILE_PASSWORD || '',
  database: process.env.DB_CHILE_NAME || 'farmared',
};

export const chileDb = new Kysely<FarmaredDB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }),
  }),
});
