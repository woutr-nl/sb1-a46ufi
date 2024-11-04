import { getDatabase } from '../db';
import type { Setting } from '../types/database';

export const settingsService = {
  async getSetting(key: string): Promise<string | null> {
    const db = await getDatabase();
    const setting = await db.settings.get(key);
    return setting?.value ?? null;
  },

  async setSetting(key: string, value: string): Promise<void> {
    const db = await getDatabase();
    await db.settings.put({
      key,
      value,
      updatedAt: new Date().toISOString()
    });
  },

  async getAllSettings(): Promise<Setting[]> {
    const db = await getDatabase();
    return db.settings.toArray();
  }
};