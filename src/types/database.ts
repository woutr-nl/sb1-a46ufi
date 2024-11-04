export interface SqliteConfig {
  path: string;
}

export interface MysqlConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface DatabaseConfig {
  type: 'sqlite' | 'mysql' | 'postgres';
  sqlite: SqliteConfig;
  mysql: MysqlConfig;
  postgres: PostgresConfig;
}