# Tools Reference

## Meta Tools

### `about`

Get server metadata: name, version, coverage, data sources, and links.

**Parameters:** None

**Returns:** Server name, version, jurisdiction list, data source names, tool count, homepage/repository links.

---

### `list_sources`

List all data sources with authority, URL, license, and freshness info.

**Parameters:** None

**Returns:** Array of data sources, each with `name`, `authority`, `official_url`, `retrieval_method`, `update_frequency`, `license`, `coverage`, `last_retrieved`.

---

### `check_data_freshness`

Check when data was last ingested, staleness status, and how to trigger a refresh.

**Parameters:** None

**Returns:** `status` (fresh/stale/unknown), `last_ingest`, `days_since_ingest`, `staleness_threshold_days`, `refresh_command`.

---

## Domain Tools

### `search_schemes`

Search farm subsidy schemes, SFI options, and application guidance. Use for broad queries about available schemes.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Free-text search query |
| `scheme_type` | string | No | Filter by scheme type (e.g. agri-environment, countryside-stewardship) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |
| `limit` | number | No | Max results (default: 20, max: 50) |

**Example:** `{ "query": "soil management SFI" }`

---

### `get_scheme_details`

Get full details for a subsidy scheme including all available options.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scheme_id` | string | Yes | Scheme ID (e.g. sustainable-farming-incentive) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** Scheme name, type, authority, status, description, eligibility summary, application window, and all options with payment rates.

**Example:** `{ "scheme_id": "sustainable-farming-incentive" }`

---

### `get_payment_rates`

Get payment rates for a scheme, optionally filtered to a specific option.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scheme_id` | string | Yes | Scheme ID |
| `option_id` | string | No | Specific option ID to filter to |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** Scheme name, list of options with payment rate (GBP), payment unit, duration, eligible land types, stacking rules.

**Example:** `{ "scheme_id": "sustainable-farming-incentive", "option_id": "sam1" }`

---

### `check_eligibility`

Find scheme options matching land type, current practice, or farm type.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `land_type` | string | No | Land type (e.g. arable, grassland, moorland) |
| `current_practice` | string | No | Current farming practice (e.g. cover cropping, soil testing) |
| `farm_type` | string | No | Farm type (e.g. mixed, arable, livestock) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** Matching scheme options with payment rates and requirements. Eligibility is indicative -- check scheme manuals for definitive criteria.

**Example:** `{ "land_type": "arable", "current_practice": "cover crop" }`

---

### `list_scheme_options`

List all options within a scheme with codes, names, and payment rates.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scheme_id` | string | Yes | Scheme ID |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** Scheme name, list of options with code, name, description, payment rate, payment unit, duration.

---

### `get_cross_compliance`

Get cross-compliance requirements (GAEC/SMR) by ID or topic.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requirement_id` | string | No | Requirement ID (e.g. gaec-1, smr-1) |
| `topic` | string | No | Search topic (e.g. buffer strips, water pollution) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** If `requirement_id`: full requirement detail. If `topic`: matching requirements. If neither: all requirements.

**Example:** `{ "topic": "water" }`

---

### `search_application_guidance`

Search for application guidance: deadlines, forms, how to apply, and scheme rules.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Free-text search query |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |
| `limit` | number | No | Max results (default: 20, max: 50) |

**Returns:** Matching guidance entries with title, body, scheme type, relevance rank.

**Example:** `{ "query": "how to apply SFI" }`
