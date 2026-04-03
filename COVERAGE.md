# Coverage

## What Is Included

- **Sustainable Farming Incentive (SFI)** options: codes, descriptions, payment rates, eligibility criteria, stacking rules
- **Countryside Stewardship** scheme options with payment rates and land type requirements
- **Cross-compliance requirements**: GAEC (Good Agricultural and Environmental Conditions) and SMR (Statutory Management Requirements)
- **Application guidance**: how to apply, deadlines, required documentation

## Jurisdictions

| Code | Country | Status |
|------|---------|--------|
| GB | Great Britain | Supported |

## What Is NOT Included

- **Basic Payment Scheme (BPS)** -- being phased out, not tracked
- **Environmental Land Management (ELM)** pilot details -- only published scheme data
- **Scotland-specific schemes** -- Scottish Rural Development Programme (SRDP) follows separate rules
- **Wales-specific schemes** -- Sustainable Farming Scheme (SFS) is separate
- **Northern Ireland** -- DAERA schemes follow separate guidance
- **Historical scheme data** -- only current/active schemes
- **Individual farm assessments** -- this is reference data, not an eligibility calculator
- **Actual application forms** -- links to GOV.UK forms provided in guidance

## Known Gaps

1. Payment rates may change between annual scheme updates -- check `check_data_freshness`
2. Stacking rules between SFI and CS options are complex and not fully modelled
3. Higher Tier Countryside Stewardship requires Natural England agreement -- eligibility tool covers Mid Tier only
4. FTS5 search quality varies with query phrasing -- use scheme codes (e.g. SAM1) for precise results

## Data Freshness

Run `check_data_freshness` to see when data was last updated. The ingestion pipeline runs on a schedule; manual triggers available via `gh workflow run ingest.yml`.
