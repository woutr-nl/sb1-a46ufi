import { getDatabase } from '../db';
import type { User } from '../types/database';

export const userService = {
  async validateCredentials(username: string, password: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.users.where('username').equals(username).first();
    if (user && user.password === password) {
      return user;
    }
    return null;
  },

  async getAll(): Promise<User[]> {
    const db = await getDatabase();
    return db.users.toArray();
  },

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const db = await getDatabase();
    const id = await db.users.add({
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const user = await db.users.get(id);
    if (!user) throw new Error('Failed to create user');
    return user;
  },

  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const db = await getDatabase();
    await db.users.update(id, {
      ...userData,
      updatedAt: new Date().toISOString()
    });
    const user = await db.users.get(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.users.delete(id);
  }
};