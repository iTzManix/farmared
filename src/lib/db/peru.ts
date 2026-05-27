import { Kysely, MssqlDialect } from 'kysely';
import * as Tedious from 'tedious';
import * as Tarn from 'tarn';
import { FarmaredDB } from '@/types/database';

const config = {
  host: process.env.DB_PERU_HOST || 'localhost',
  port: parseInt(process.env.DB_PERU_PORT || '1433'),
  user: process.env.DB_PERU_USER || 'sa',
  password: process.env.DB_PERU_PASSWORD || '',
  database: process.env.DB_PERU_NAME || 'farmared',
};

export const peruDb = new Kysely<FarmaredDB>({
  dialect: new MssqlDialect({
    tarn: {
      ...Tarn,
      options: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
        propagateCreateError: false,
      },
    },
    tedious: {
      ...Tedious,
      connectionFactory: () =>
        new Tedious.Connection({
          server: config.host,
          authentication: {
            type: 'default',
            options: {
              userName: config.user,
              password: config.password,
            },
          },
          options: {
            database: config.database,
            port: config.port,
            trustServerCertificate: true,
            encrypt: false,
            requestTimeout: 30000,
            connectTimeout: 15000,
            rowCollectionOnRequestCompletion: true,
          },
        }),
    },
    validateConnections: true,
    resetConnectionsOnRelease: false,
  }),
});
