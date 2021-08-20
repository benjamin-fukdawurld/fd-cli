import knex from 'knex';
import logger from './common/logger';

const knexDb = knex({
  client: 'pg',
  connection: {
    user: process.env.POSTGRES_CLIENTUSER,
    password: process.env.POSTGRES_CLIENTPASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseFloat(process.env.POSTGRES_PORT ?? '5432'),
    database: process.env.POSTGRES_DB,
  },
  log: {
    warn(message) {
      logger.warn(JSON.stringify(message));
    },
    error(message) {
      logger.error(JSON.stringify(message));
    },
    deprecate(message) {
      logger.warn(JSON.stringify(message));
    },
    debug(message) {
      logger.debug(JSON.stringify(message));
    },
  },
  debug: process.env.NODE_ENV !== 'production',
});

export default knexDb;
