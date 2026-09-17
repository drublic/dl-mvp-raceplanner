import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "startlist.sqlite");

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initializeSchema(db);
  dbInstance = db;
  return db;
}

/** Test helper: close and forget the singleton so a fresh file can be opened. */
export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export function getDbPath(): string {
  return DB_PATH;
}

function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS races (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id TEXT NOT NULL REFERENCES categories(id),
      name TEXT NOT NULL,
      weekday TEXT NOT NULL,
      race_date TEXT NOT NULL,
      meldeschluss TEXT,
      cancelled INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL,
      UNIQUE(category_id, name)
    );

    CREATE TABLE IF NOT EXISTS start_list_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      race_id INTEGER NOT NULL REFERENCES races(id) ON DELETE CASCADE,
      rider_name TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      UNIQUE(race_id, rider_name)
    );
  `);
}
