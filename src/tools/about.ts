import { buildMeta } from '../metadata.js';
import { SUPPORTED_JURISDICTIONS } from '../jurisdiction.js';

export function handleAbout() {
  return {
    name: 'Farm Subsidies MCP',
    description:
      'UK farm subsidy schemes -- Sustainable Farming Incentive (SFI) options, eligibility criteria, ' +
      'payment rates, and cross-compliance requirements (GAEC/SMR). Based on DEFRA and RPA publications.',
    version: '0.1.0',
    jurisdiction: [...SUPPORTED_JURISDICTIONS],
    data_sources: ['DEFRA SFI Guidance', 'RPA Scheme Manuals', 'Cross-compliance GAEC/SMR'],
    tools_count: 10,
    links: {
      homepage: 'https://ansvar.eu/open-agriculture',
      repository: 'https://github.com/ansvar-systems/farm-subsidies-mcp',
      mcp_network: 'https://ansvar.ai/mcp',
    },
    _meta: buildMeta(),
  };
}
