import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // Schemes
  db.run(
    `INSERT INTO schemes (id, name, scheme_type, authority, status, start_date, description, eligibility_summary, application_window, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['sustainable-farming-incentive', 'Sustainable Farming Incentive', 'agri-environment', 'DEFRA', 'open',
     '2023-01-01', 'Pays farmers for actions that support food production and improve the environment.',
     'Must have at least 1 hectare of eligible land registered on the Rural Payments service.',
     'Rolling application -- apply any time', 'GB']
  );
  db.run(
    `INSERT INTO schemes (id, name, scheme_type, authority, status, start_date, description, eligibility_summary, application_window, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['countryside-stewardship', 'Countryside Stewardship', 'agri-environment', 'DEFRA', 'open',
     '2015-01-01', 'Provides financial incentives for land managers to look after their environment.',
     'Must be the land manager of eligible land. Higher Tier requires Natural England agreement.',
     'Annual application window -- typically February to July', 'GB']
  );

  // Scheme options
  db.run(
    `INSERT INTO scheme_options (id, scheme_id, code, name, description, payment_rate, payment_unit, eligible_land_types, requirements, duration_years, stacking_rules, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['sam1', 'sustainable-farming-incentive', 'SAM1', 'Assess soil, test soil organic matter and produce a plan',
     'Assessment of soil health including organic matter testing and a soil management plan.',
     5.80, 'GBP/ha', 'arable, temporary grassland, permanent grassland',
     'Complete soil assessment, test soil organic matter, produce soil management plan',
     3, 'Can be stacked with SAM2 and SAM3', 'GB']
  );
  db.run(
    `INSERT INTO scheme_options (id, scheme_id, code, name, description, payment_rate, payment_unit, eligible_land_types, requirements, duration_years, stacking_rules, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['sam2', 'sustainable-farming-incentive', 'SAM2', 'Multi-species winter cover crop',
     'Establish a winter cover crop of at least two species to protect and improve soil.',
     129.00, 'GBP/ha', 'arable',
     'Establish cover crop by specified date, maintain until spring, minimum two species',
     3, 'Can be stacked with SAM1', 'GB']
  );
  db.run(
    `INSERT INTO scheme_options (id, scheme_id, code, name, description, payment_rate, payment_unit, eligible_land_types, requirements, duration_years, stacking_rules, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['csam3', 'countryside-stewardship', 'CSAM3', 'Herbal leys',
     'Establish and maintain herbal leys with a mix of grasses, legumes, and herbs.',
     382.00, 'GBP/ha', 'arable, temporary grassland',
     'Establish herbal ley with specified seed mix, maintain for agreement duration',
     5, 'Cannot be stacked with SAM2 on the same parcel', 'GB']
  );

  // Cross-compliance
  db.run(
    `INSERT INTO cross_compliance (id, requirement, category, reference, description, applies_to, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['gaec-1', 'Establishment of buffer strips along water courses', 'GAEC',
     'GAEC 1', 'Maintain a buffer strip of at least 2 metres along watercourses. No cultivation, fertiliser, or pesticide application within the buffer strip.',
     'All land within 2m of a watercourse', 'GB']
  );
  db.run(
    `INSERT INTO cross_compliance (id, requirement, category, reference, description, applies_to, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['smr-1', 'Protection of waters against pollution', 'SMR',
     'SMR 1', 'Comply with the Nitrate Pollution Prevention Regulations. Restrictions on timing, quantity, and storage of organic manure and nitrogen fertiliser in Nitrate Vulnerable Zones.',
     'All farmland, with additional rules in Nitrate Vulnerable Zones', 'GB']
  );

  // FTS5 search index
  db.run(
    `INSERT INTO search_index (title, body, scheme_type, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['SFI Soil Management Options', 'Sustainable Farming Incentive soil management actions SAM1 SAM2 SAM3. Soil health assessment, cover crops, no-till farming. Payment rates from 5.80 to 129.00 GBP per hectare.', 'agri-environment', 'GB']
  );
  db.run(
    `INSERT INTO search_index (title, body, scheme_type, jurisdiction) VALUES (?, ?, ?, ?)`,
    ['How to Apply for SFI', 'Apply for the Sustainable Farming Incentive through the Rural Payments service. Rolling applications accepted year-round. You need a Customer Reference Number (CRN) and at least 1 hectare of eligible land.', 'agri-environment', 'GB']
  );

  return db;
}
