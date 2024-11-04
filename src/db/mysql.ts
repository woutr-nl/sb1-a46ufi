import type { MysqlConfig } from '../types/database';
import type { Database } from './index';

export const createMySQLDatabase = async (config: MysqlConfig): Promise<Database> => {
  throw new Error('MySQL support not implemented in browser environment');
};