import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../data/app.db');

const db = new Database(dbPath);

const migrations = [
  // Initial migration
  `
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

  -- Create default admin user if not exists
  INSERT OR IGNORE INTO users (username, password, isAdmin, createdAt, updatedAt)
  VALUES ('admin', 'padel123', 1, datetime('now'), datetime('now'));
  `
];

async function migrate() {
  try {
    db.exec('BEGIN TRANSACTION');

    // Create migrations table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appliedAt TEXT NOT NULL
      )
    `);

    // Get count of applied migrations
    const appliedMigrations = db.prepare('SELECT COUNT(*) as count FROM migrations').get();

    // Apply new migrations
    for (let i = appliedMigrations.count; i < migrations.length; i++) {
      console.log(`Applying migration ${i + 1}`);
      db.exec(migrations[i]);
      db.prepare('INSERT INTO migrations (appliedAt) VALUES (datetime("now"))').run();
    }

    db.exec('COMMIT');
    console.log('Migrations completed successfully');
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error applying migrations:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrate();