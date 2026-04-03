import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface ListOptionsArgs {
  scheme_id: string;
  jurisdiction?: string;
}

export function handleListSchemeOptions(db: Database, args: ListOptionsArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  // Verify scheme exists
  const scheme = db.get<{ id: string; name: string }>(
    'SELECT id, name FROM schemes WHERE id = ? AND jurisdiction = ?',
    [args.scheme_id, jv.jurisdiction]
  );

  if (!scheme) {
    return { error: 'not_found', message: `Scheme '${args.scheme_id}' not found. Use search_schemes to find available schemes.` };
  }

  const options = db.all<{
    id: string; code: string; name: string; description: string;
    payment_rate: number; payment_unit: string; duration_years: number;
  }>(
    'SELECT id, code, name, description, payment_rate, payment_unit, duration_years FROM scheme_options WHERE scheme_id = ? AND jurisdiction = ? ORDER BY code',
    [args.scheme_id, jv.jurisdiction]
  );

  return {
    scheme: scheme.name,
    scheme_id: scheme.id,
    jurisdiction: jv.jurisdiction,
    options_count: options.length,
    options,
    _meta: buildMeta(),
  };
}
