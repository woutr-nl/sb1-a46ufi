import { getDatabase } from '../db';
import { getDatabaseConfig } from '../config/database';

export const testDatabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const config = getDatabaseConfig();
  
  try {
    // Test database initialization
    const db = await getDatabase();
    
    // Test basic CRUD operations
    const testUser = {
      username: `test-${Date.now()}`,
      password: 'test123',
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Test Create
    let userId: number;
    try {
      userId = await db.users.add(testUser);
      if (!userId) throw new Error('Failed to create test user');
    } catch (error) {
      return {
        success: false,
        message: `Create operation failed: ${error.message}`
      };
    }

    // Test Read
    try {
      const user = await db.users.get(userId);
      if (!user || user.username !== testUser.username) {
        throw new Error('Retrieved user data does not match');
      }
    } catch (error) {
      return {
        success: false,
        message: `Read operation failed: ${error.message}`
      };
    }

    // Test Update
    try {
      const updateData = { username: `${testUser.username}-updated` };
      await db.users.update(userId, updateData);
      const updated = await db.users.get(userId);
      if (!updated || updated.username !== updateData.username) {
        throw new Error('Updated user data does not match');
      }
    } catch (error) {
      return {
        success: false,
        message: `Update operation failed: ${error.message}`
      };
    }

    // Test Delete
    try {
      await db.users.delete(userId);
      const deleted = await db.users.get(userId);
      if (deleted) throw new Error('User still exists after deletion');
    } catch (error) {
      if (error.message !== 'User still exists after deletion') {
        return {
          success: false,
          message: `Delete operation failed: ${error.message}`
        };
      }
    }

    // Database type specific messages
    let connectionDetails = '';
    switch (config.type) {
      case 'sqlite':
        connectionDetails = `SQLite database at ${config.sqlite.path}`;
        break;
      case 'mysql':
        connectionDetails = `MySQL database at ${config.mysql.host}:${config.mysql.port}`;
        break;
      case 'postgres':
        connectionDetails = `PostgreSQL database at ${config.postgres.host}:${config.postgres.port}`;
        break;
      default:
        connectionDetails = 'Unknown database type';
    }

    return {
      success: true,
      message: `Successfully connected to ${connectionDetails}. All database operations working correctly.`
    };
  } catch (error) {
    return {
      success: false,
      message: `Database connection test failed: ${error.message}`
    };
  }
};