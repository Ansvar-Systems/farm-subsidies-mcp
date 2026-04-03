import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleCheckEligibility } from '../../src/tools/check-eligibility.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-eligibility.db';

describe('check_eligibility tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('finds options for arable land', () => {
    const result = handleCheckEligibility(db, { land_type: 'arable' });
    expect(result).toHaveProperty('matches_count');
    expect((result as { matches_count: number }).matches_count).toBeGreaterThan(0);
  });

  test('finds options matching cover crop practice', () => {
    const result = handleCheckEligibility(db, { current_practice: 'cover crop' });
    expect((result as { matches_count: number }).matches_count).toBeGreaterThan(0);
    const matches = (result as { matches: { option_code: string }[] }).matches;
    expect(matches.some(m => m.option_code === 'SAM2')).toBe(true);
  });

  test('returns empty for non-matching criteria', () => {
    const result = handleCheckEligibility(db, { land_type: 'desert' });
    expect((result as { matches_count: number }).matches_count).toBe(0);
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleCheckEligibility(db, { land_type: 'arable', jurisdiction: 'DE' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });

  test('returns all options when no filters given', () => {
    const result = handleCheckEligibility(db, {});
    expect((result as { matches_count: number }).matches_count).toBe(3);
  });
});
