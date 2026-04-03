#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { createDatabase } from './db.js';
import { handleAbout } from './tools/about.js';
import { handleListSources } from './tools/list-sources.js';
import { handleCheckFreshness } from './tools/check-freshness.js';
import { handleSearchSchemes } from './tools/search-schemes.js';
import { handleGetSchemeDetails } from './tools/get-scheme-details.js';
import { handleGetPaymentRates } from './tools/get-payment-rates.js';
import { handleCheckEligibility } from './tools/check-eligibility.js';
import { handleListSchemeOptions } from './tools/list-scheme-options.js';
import { handleGetCrossCompliance } from './tools/get-cross-compliance.js';
import { handleSearchApplicationGuidance } from './tools/search-application-guidance.js';

const SERVER_NAME = 'farm-subsidies-mcp';
const SERVER_VERSION = '0.1.0';

const TOOLS = [
  {
    name: 'about',
    description: 'Get server metadata: name, version, coverage, data sources, and links.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'list_sources',
    description: 'List all data sources with authority, URL, license, and freshness info.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'check_data_freshness',
    description: 'Check when data was last ingested, staleness status, and how to trigger a refresh.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'search_schemes',
    description: 'Search farm subsidy schemes, SFI options, and application guidance. Use for broad queries about available schemes.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Free-text search query' },
        scheme_type: { type: 'string', description: 'Filter by scheme type (e.g. agri-environment, countryside-stewardship)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
        limit: { type: 'number', description: 'Max results (default: 20, max: 50)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_scheme_details',
    description: 'Get full details for a subsidy scheme including all available options.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        scheme_id: { type: 'string', description: 'Scheme ID (e.g. sustainable-farming-incentive)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['scheme_id'],
    },
  },
  {
    name: 'get_payment_rates',
    description: 'Get payment rates for a scheme, optionally filtered to a specific option.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        scheme_id: { type: 'string', description: 'Scheme ID' },
        option_id: { type: 'string', description: 'Specific option ID to filter to' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['scheme_id'],
    },
  },
  {
    name: 'check_eligibility',
    description: 'Find scheme options matching land type, current practice, or farm type.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        land_type: { type: 'string', description: 'Land type (e.g. arable, grassland, moorland)' },
        current_practice: { type: 'string', description: 'Current farming practice (e.g. cover cropping, soil testing)' },
        farm_type: { type: 'string', description: 'Farm type (e.g. mixed, arable, livestock)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
    },
  },
  {
    name: 'list_scheme_options',
    description: 'List all options within a scheme with codes, names, and payment rates.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        scheme_id: { type: 'string', description: 'Scheme ID' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['scheme_id'],
    },
  },
  {
    name: 'get_cross_compliance',
    description: 'Get cross-compliance requirements (GAEC/SMR) by ID or topic.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        requirement_id: { type: 'string', description: 'Requirement ID (e.g. gaec-1, smr-1)' },
        topic: { type: 'string', description: 'Search topic (e.g. buffer strips, water pollution)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
    },
  },
  {
    name: 'search_application_guidance',
    description: 'Search for application guidance: deadlines, forms, how to apply, and scheme rules.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Free-text search query' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
        limit: { type: 'number', description: 'Max results (default: 20, max: 50)' },
      },
      required: ['query'],
    },
  },
];

const SearchSchemesArgsSchema = z.object({
  query: z.string(),
  scheme_type: z.string().optional(),
  jurisdiction: z.string().optional(),
  limit: z.number().optional(),
});

const SchemeDetailsArgsSchema = z.object({
  scheme_id: z.string(),
  jurisdiction: z.string().optional(),
});

const PaymentRatesArgsSchema = z.object({
  scheme_id: z.string(),
  option_id: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const EligibilityArgsSchema = z.object({
  land_type: z.string().optional(),
  current_practice: z.string().optional(),
  farm_type: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const ListOptionsArgsSchema = z.object({
  scheme_id: z.string(),
  jurisdiction: z.string().optional(),
});

const CrossComplianceArgsSchema = z.object({
  requirement_id: z.string().optional(),
  topic: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const GuidanceSearchArgsSchema = z.object({
  query: z.string(),
  jurisdiction: z.string().optional(),
  limit: z.number().optional(),
});

function textResult(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(message: string) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }], isError: true };
}

const db = createDatabase();

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case 'about':
        return textResult(handleAbout());
      case 'list_sources':
        return textResult(handleListSources(db));
      case 'check_data_freshness':
        return textResult(handleCheckFreshness(db));
      case 'search_schemes':
        return textResult(handleSearchSchemes(db, SearchSchemesArgsSchema.parse(args)));
      case 'get_scheme_details':
        return textResult(handleGetSchemeDetails(db, SchemeDetailsArgsSchema.parse(args)));
      case 'get_payment_rates':
        return textResult(handleGetPaymentRates(db, PaymentRatesArgsSchema.parse(args)));
      case 'check_eligibility':
        return textResult(handleCheckEligibility(db, EligibilityArgsSchema.parse(args)));
      case 'list_scheme_options':
        return textResult(handleListSchemeOptions(db, ListOptionsArgsSchema.parse(args)));
      case 'get_cross_compliance':
        return textResult(handleGetCrossCompliance(db, CrossComplianceArgsSchema.parse(args)));
      case 'search_application_guidance':
        return textResult(handleSearchApplicationGuidance(db, GuidanceSearchArgsSchema.parse(args)));
      default:
        return errorResult(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return errorResult(err instanceof Error ? err.message : String(err));
  }
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err.message}\n`);
  process.exit(1);
});
