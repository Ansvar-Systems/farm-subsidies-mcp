import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import { ftsSearch, type Database } from '../db.js';

interface GuidanceSearchArgs {
  query: string;
  jurisdiction?: string;
  limit?: number;
}

export function handleSearchApplicationGuidance(db: Database, args: GuidanceSearchArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const limit = Math.min(args.limit ?? 20, 50);
  const results = ftsSearch(db, args.query, limit);

  return {
    query: args.query,
    jurisdiction: jv.jurisdiction,
    results_count: results.length,
    results: results.map(r => ({
      title: r.title,
      body: r.body,
      scheme_type: r.scheme_type,
      relevance_rank: r.rank,
    })),
    _meta: buildMeta(),
  };
}
