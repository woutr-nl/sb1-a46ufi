import { getDatabaseConfig } from '../config/database';
import type { User, Setting } from '../types/database';
import { createSQLiteDatabase } from './sqlite';
import { createMySQLDatabase } from './mysql';
import { createPostgresDatabase } from './postgres';

let db: Database | null = null;

export interface Database {
  users: {
    get: (id: number) => Promise<User | undefined>;
    where: (field: keyof User) => {
      equals: (value: any) => Promise<User[]>;
      first: () => Promise<User | undefined>;
    };
    add: (user: Omit<User, 'id'>) => Promise<number>;
    update: (id: number, data: Partial<User>) => Promise<void>;
    delete: (id: number) => Promise<void>;
    toArray: () => Promise<User[]>;
  };
  settings: {
    get: (key: string) => Promise<Setting | undefined>;
    put: (setting: Setting) => Promise<void>;
    delete: (key: string) => Promise<void>;
    toArray: () => Promise<Setting[]>;
  };
  type: 'sqlite' | 'mysql' | 'postgres';
  close: () => Promise<void>;
}

const initializeDatabase = async (): Promise<Database> => {
  const config = getDatabaseConfig();

  try {
    switch (config.type) {
      case 'sqlite':
        return await createSQLiteDatabase(config.sqlite);
      case 'mysql':
        return await createMySQLDatabase(config.mysql);
      case 'postgres':
        return await createPostgresDatabase(config.postgres);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error(`Database initialization failed: ${error.message}`);
  }
};

export const getDatabase = async (): Promise<Database> => {
  if (!db) {
    db = await initializeDatabase();
  }
  return db;
};