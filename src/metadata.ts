export interface Meta {
  disclaimer: string;
  data_age: string;
  source_url: string;
  copyright: string;
  server: string;
  version: string;
}

const DISCLAIMER =
  'This data is provided for informational purposes only. It does not constitute professional ' +
  'agricultural or financial advice. Subsidy schemes, payment rates, and eligibility criteria ' +
  'change -- always check the latest DEFRA SFI guidance and RPA scheme manuals before making ' +
  'applications or land management decisions. Data sourced from UK government publications ' +
  'under Open Government Licence.';

export function buildMeta(overrides?: Partial<Meta>): Meta {
  return {
    disclaimer: DISCLAIMER,
    data_age: overrides?.data_age ?? 'unknown',
    source_url: overrides?.source_url ?? 'https://www.gov.uk/government/collections/sustainable-farming-incentive-guidance',
    copyright: 'Data: Crown Copyright. Server: Apache-2.0 Ansvar Systems.',
    server: 'farm-subsidies-mcp',
    version: '0.1.0',
    ...overrides,
  };
}
