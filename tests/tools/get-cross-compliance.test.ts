import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleGetCrossCompliance } from '../../src/tools/get-cross-compliance.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-cross-compliance.db';

describe('get_cross_compliance tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns requirement by ID', () => {
    const result = handleGetCrossCompliance(db, { requirement_id: 'gaec-1' });
    expect(result).toHaveProperty('requirement', 'Establishment of buffer strips along water courses');
    expect(result).toHaveProperty('category', 'GAEC');
  });

  test('searches by topic', () => {
    const result = handleGetCrossCompliance(db, { topic: 'water' });
    expect(result).toHaveProperty('results_count');
    expect((result as { results_count: number }).results_count).toBeGreaterThan(0);
  });

  test('returns all requirements when no params given', () => {
    const result = handleGetCrossCompliance(db, {});
    expect((result as { results_count: number }).results_count).toBe(2);
  });

  test('returns not_found for unknown requirement', () => {
    const result = handleGetCrossCompliance(db, { requirement_id: 'gaec-99' });
    expect(result).toHaveProperty('error', 'not_found');
  });
});
