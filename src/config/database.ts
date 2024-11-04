import { DatabaseConfig } from '../types/database';

const defaultConfig: DatabaseConfig = {
  type: 'sqlite',
  sqlite: {
    path: './data/weather.db'
  },
  mysql: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'weather'
  },
  postgres: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    database: 'weather'
  }
};

let currentConfig: DatabaseConfig = { ...defaultConfig };

export const getDatabaseConfig = (): DatabaseConfig => {
  return currentConfig;
};

export const setDatabaseConfig = (config: Partial<DatabaseConfig>) => {
  currentConfig = {
    ...currentConfig,
    ...config,
  };
};

export const resetDatabaseConfig = () => {
  currentConfig = { ...defaultConfig };
};