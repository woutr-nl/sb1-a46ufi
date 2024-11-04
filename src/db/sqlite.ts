import Database from 'better-sqlite3';
import type { SqliteConfig } from '../types/database';
import type { Database as IDatabase } from './index';
import type { User, Setting } from '../types/database';
import { join } from 'path';

let db: Database | null = null;

export const createSQLiteDatabase = async (config: SqliteConfig): Promise<IDatabase> => {
  try {
    if (!db) {
      db = new Database(config.path, { verbose: console.log });
      
      // Create tables
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          isAdmin BOOLEAN NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
      `);

      // Add default admin user if not exists
      const adminUser = db.prepare("SELECT * FROM users WHERE username = ?").get('admin');
      if (!adminUser) {
        db.prepare(`
          INSERT INTO users (username, password, isAdmin, createdAt, updatedAt)
          VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `).run('admin', 'padel123', 1);
      }
    }

    return {
      type: 'sqlite',
      users: {
        get: async (id) => {
          return db!.prepare('SELECT * FROM users WHERE id = ?').get(id);
        },
        where: (field) => ({
          equals: async (value) => {
            if (field === 'username') {
              return db!.prepare('SELECT * FROM users WHERE username = ?').all(value);
            }
            throw new Error(`Unsupported field for where clause: ${field}`);
          },
          first: async () => {
            return db!.prepare('SELECT * FROM users ORDER BY id LIMIT 1').get();
          },
        }),
        add: async (user) => {
          const result = db!.prepare(`
            INSERT INTO users (username, password, isAdmin, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?)
          `).run(user.username, user.password, user.isAdmin ? 1 : 0, user.createdAt, user.updatedAt);
          return result.lastInsertRowid as number;
        },
        update: async (id, data) => {
          const current = db!.prepare('SELECT * FROM users WHERE id = ?').get(id);
          if (!current) throw new Error('User not found');

          db!.prepare(`
            UPDATE users 
            SET username = ?, password = ?, isAdmin = ?, updatedAt = ?
            WHERE id = ?
          `).run(
            data.username ?? current.username,
            data.password ?? current.password,
            data.isAdmin ?? current.isAdmin ? 1 : 0,
            new Date().toISOString(),
            id
          );
        },
        delete: async (id) => {
          db!.prepare('DELETE FROM users WHERE id = ?').run(id);
        },
        toArray: async () => {
          return db!.prepare('SELECT * FROM users').all();
        },
      },
      settings: {
        get: async (key) => {
          return db!.prepare('SELECT * FROM settings WHERE key = ?').get(key);
        },
        put: async (setting) => {
          db!.prepare(`
            INSERT OR REPLACE INTO settings (key, value, updatedAt)
            VALUES (?, ?, ?)
          `).run(setting.key, setting.value, setting.updatedAt);
        },
        delete: async (key) => {
          db!.prepare('DELETE FROM settings WHERE key = ?').run(key);
        },
        toArray: async () => {
          return db!.prepare('SELECT * FROM settings').all();
        },
      },
      close: async () => {
        if (db) {
          db.close();
          db = null;
        }
      },
    };
  } catch (error) {
    console.error('Failed to create SQLite database:', error);
    throw new Error(`SQLite creation failed: ${error.message}`);
  }
};