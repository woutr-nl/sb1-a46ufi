import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  isAdmin: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createUserSchema = userSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const updateUserSchema = createUserSchema.partial();

export const settingsSchema = z.object({
  key: z.string(),
  value: z.string(),
  updatedAt: z.string(),
});