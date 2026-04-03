import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleSearchSchemes } from '../../src/tools/search-schemes.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-search-schemes.db';

describe('search_schemes tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns results for soil query', () => {
    const result = handleSearchSchemes(db, { query: 'soil' });
    expect(result).toHaveProperty('results_count');
    expect((result as { results_count: number }).results_count).toBeGreaterThan(0);
  });

  test('respects scheme_type filter', () => {
    const result = handleSearchSchemes(db, { query: 'soil', scheme_type: 'agri-environment' });
    expect((result as { results: unknown[] }).results.length).toBeGreaterThan(0);
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleSearchSchemes(db, { query: 'soil', jurisdiction: 'FR' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });
});
