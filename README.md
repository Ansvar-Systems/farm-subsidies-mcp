# Farm Subsidies MCP

[![CI](https://github.com/ansvar-systems/farm-subsidies-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/ansvar-systems/farm-subsidies-mcp/actions/workflows/ci.yml)
[![GHCR](https://github.com/ansvar-systems/farm-subsidies-mcp/actions/workflows/ghcr-build.yml/badge.svg)](https://github.com/ansvar-systems/farm-subsidies-mcp/actions/workflows/ghcr-build.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

UK farm subsidy schemes via the [Model Context Protocol](https://modelcontextprotocol.io). Query SFI options, eligibility criteria, payment rates, and cross-compliance requirements -- all from your AI assistant.

Part of [Ansvar Open Agriculture](https://ansvar.eu/open-agriculture).

## Why This Exists

Farmers and land managers need quick access to subsidy scheme details, payment rates, and eligibility criteria. This information is published by DEFRA and the RPA across dozens of GOV.UK pages, PDFs, and scheme manuals that AI assistants cannot query directly. This MCP server makes it all searchable.

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "farm-subsidies": {
      "command": "npx",
      "args": ["-y", "@ansvar/farm-subsidies-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add farm-subsidies npx @ansvar/farm-subsidies-mcp
```

### Streamable HTTP (remote)

```
https://mcp.ansvar.eu/farm-subsidies/mcp
```

### Docker (self-hosted)

```bash
docker run -p 3000:3000 ghcr.io/ansvar-systems/farm-subsidies-mcp:latest
```

### npm (stdio)

```bash
npx @ansvar/farm-subsidies-mcp
```

## Example Queries

Ask your AI assistant:

- "What SFI options are available for arable land?"
- "How much does SAM2 multi-species cover crop pay per hectare?"
- "Am I eligible for soil management payments if I have grassland?"
- "What are the GAEC cross-compliance rules for buffer strips?"
- "How do I apply for the Sustainable Farming Incentive?"

## Stats

| Metric | Value |
|--------|-------|
| Tools | 10 (3 meta + 7 domain) |
| Jurisdiction | GB |
| Data sources | DEFRA SFI Guidance, RPA Scheme Manuals, Cross-compliance GAEC/SMR |
| License (data) | Open Government Licence v3 |
| License (code) | Apache-2.0 |
| Transport | stdio + Streamable HTTP |

## Tools

| Tool | Description |
|------|-------------|
| `about` | Server metadata and links |
| `list_sources` | Data sources with freshness info |
| `check_data_freshness` | Staleness status and refresh command |
| `search_schemes` | FTS5 search across schemes and guidance |
| `get_scheme_details` | Full scheme profile with options |
| `get_payment_rates` | Payment rates by scheme and option |
| `check_eligibility` | Match land type/practice to scheme options |
| `list_scheme_options` | All options within a scheme |
| `get_cross_compliance` | GAEC/SMR requirements by ID or topic |
| `search_application_guidance` | How to apply, deadlines, forms |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Security Scanning

This repository runs 6 security checks on every push:

- **CodeQL** -- static analysis for JavaScript/TypeScript
- **Gitleaks** -- secret detection across full history
- **Dependency review** -- via Dependabot
- **Container scanning** -- via GHCR build pipeline

See [SECURITY.md](SECURITY.md) for reporting policy.

## Disclaimer

This tool provides reference data for informational purposes only. It is not professional agricultural or financial advice. See [DISCLAIMER.md](DISCLAIMER.md).

## Contributing

Issues and pull requests welcome. For security vulnerabilities, email security@ansvar.eu (do not open a public issue).

## License

Apache-2.0. Data sourced under Open Government Licence v3.
