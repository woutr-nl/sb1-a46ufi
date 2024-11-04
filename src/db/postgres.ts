import type { PostgresConfig } from '../types/database';
import type { Database } from './index';

export const createPostgresDatabase = async (config: PostgresConfig): Promise<Database> => {
  throw new Error('PostgreSQL support not implemented in browser environment');
};