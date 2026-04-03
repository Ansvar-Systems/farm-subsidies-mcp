import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleGetSchemeDetails } from '../../src/tools/get-scheme-details.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-scheme-details.db';

describe('get_scheme_details tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns SFI scheme with options', () => {
    const result = handleGetSchemeDetails(db, { scheme_id: 'sustainable-farming-incentive' });
    expect(result).toHaveProperty('name', 'Sustainable Farming Incentive');
    expect(result).toHaveProperty('scheme_type', 'agri-environment');
    expect((result as { options_count: number }).options_count).toBe(2);
    expect(result).toHaveProperty('_meta');
  });

  test('returns not_found for unknown scheme', () => {
    const result = handleGetSchemeDetails(db, { scheme_id: 'nonexistent-scheme' });
    expect(result).toHaveProperty('error', 'not_found');
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleGetSchemeDetails(db, { scheme_id: 'sustainable-farming-incentive', jurisdiction: 'FR' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });

  test('returns countryside stewardship scheme', () => {
    const result = handleGetSchemeDetails(db, { scheme_id: 'countryside-stewardship' });
    expect(result).toHaveProperty('name', 'Countryside Stewardship');
    expect((result as { options_count: number }).options_count).toBe(1);
  });
});
