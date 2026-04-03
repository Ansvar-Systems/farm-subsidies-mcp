import BetterSqlite3 from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface Database {
  get<T>(sql: string, params?: unknown[]): T | undefined;
  all<T>(sql: string, params?: unknown[]): T[];
  run(sql: string, params?: unknown[]): void;
  close(): void;
  readonly instance: BetterSqlite3.Database;
}

export function createDatabase(dbPath?: string): Database {
  const resolvedPath =
    dbPath ??
    join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'database.db');
  const db = new BetterSqlite3(resolvedPath);

  db.pragma('journal_mode = DELETE');
  db.pragma('foreign_keys = ON');

  initSchema(db);

  return {
    get<T>(sql: string, params: unknown[] = []): T | undefined {
      return db.prepare(sql).get(...params) as T | undefined;
    },
    all<T>(sql: string, params: unknown[] = []): T[] {
      return db.prepare(sql).all(...params) as T[];
    },
    run(sql: string, params: unknown[] = []): void {
      db.prepare(sql).run(...params);
    },
    close(): void {
      db.close();
    },
    get instance() {
      return db;
    },
  };
}

function initSchema(db: BetterSqlite3.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schemes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      scheme_type TEXT,
      authority TEXT,
      status TEXT,
      start_date TEXT,
      description TEXT,
      eligibility_summary TEXT,
      application_window TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE TABLE IF NOT EXISTS scheme_options (
      id TEXT PRIMARY KEY,
      scheme_id TEXT REFERENCES schemes(id),
      code TEXT,
      name TEXT NOT NULL,
      description TEXT,
      payment_rate REAL,
      payment_unit TEXT,
      eligible_land_types TEXT,
      requirements TEXT,
      duration_years INTEGER,
      stacking_rules TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE TABLE IF NOT EXISTS cross_compliance (
      id TEXT PRIMARY KEY,
      requirement TEXT NOT NULL,
      category TEXT,
      reference TEXT,
      description TEXT,
      applies_to TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
      title, body, scheme_type, jurisdiction
    );

    CREATE TABLE IF NOT EXISTS db_metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    INSERT OR IGNORE INTO db_metadata (key, value) VALUES ('schema_version', '1.0');
    INSERT OR IGNORE INTO db_metadata (key, value) VALUES ('mcp_name', 'UK Farm Subsidies MCP');
    INSERT OR IGNORE INTO db_metadata (key, value) VALUES ('jurisdiction', 'GB');
  `);
}

export function ftsSearch(
  db: Database,
  query: string,
  limit: number = 20
): { title: string; body: string; scheme_type: string; jurisdiction: string; rank: number }[] {
  return db.all(
    `SELECT title, body, scheme_type, jurisdiction, rank
     FROM search_index
     WHERE search_index MATCH ?
     ORDER BY rank
     LIMIT ?`,
    [query, limit]
  );
}
