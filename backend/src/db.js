import path from 'path'
import Database from 'better-sqlite3'

function getDbPath() {
  if (process.env.DB_PATH) return process.env.DB_PATH
  return path.join(process.cwd(), 'data', 'mindbalance.sqlite')
}

export const db = new Database(getDbPath())

db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    scale_id TEXT NOT NULL,
    scale_title TEXT NOT NULL,
    total INTEGER NOT NULL,
    max INTEGER NOT NULL,
    label TEXT NOT NULL,
    values_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_assessments_user_created
  ON assessments(user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS mood_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    mood INTEGER NOT NULL,
    note TEXT,
    date TEXT NOT NULL,
    UNIQUE(user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_mood_user_date
  ON mood_entries(user_id, date DESC);

  CREATE TABLE IF NOT EXISTS gratitude_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    mood INTEGER,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_gratitude_user_created
  ON gratitude_entries(user_id, created_at DESC);
`)
