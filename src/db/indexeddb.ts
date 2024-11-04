import Dexie from 'dexie';
import type { User, Setting } from '../types/database';

class AppDatabase extends Dexie {
  users!: Dexie.Table<User, number>;
  settings!: Dexie.Table<Setting, string>;

  constructor() {
    super('PadelWeatherDB');
    
    try {
      this.version(1).stores({
        users: '++id, username',
        settings: 'key'
      });

      // Add default admin user if not exists
      this.on('ready', async () => {
        try {
          const adminUser = await this.users.where('username').equals('admin').first();
          if (!adminUser) {
            await this.users.add({
              username: 'admin',
              password: 'padel123',
              isAdmin: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Failed to initialize admin user:', error);
        }
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      throw new Error(`IndexedDB initialization failed: ${error.message}`);
    }
  }
}

export const createIndexedDBDatabase = async () => {
  try {
    const db = new AppDatabase();
    await db.open();
    return db;
  } catch (error) {
    console.error('Failed to create IndexedDB database:', error);
    throw new Error(`IndexedDB creation failed: ${error.message}`);
  }
};