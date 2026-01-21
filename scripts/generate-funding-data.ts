/**
 * Generate startup-funding.db with realistic startup funding data
 *
 * Run: npx ts-node scripts/generate-funding-data.ts
 * Or: bun run scripts/generate-funding-data.ts
 */

import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

const DB_PATH = './data/startup-funding.db';

// Initialize database
const db = new Database(DB_PATH);

// Create tables
db.exec(`
  DROP TABLE IF EXISTS startup_metrics;
  DROP TABLE IF EXISTS funding_rounds;
  DROP TABLE IF EXISTS investors;
  DROP TABLE IF EXISTS startups;

  CREATE TABLE startups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    sub_industry TEXT,
    founded_date DATE,
    description TEXT,
    website TEXT,
    headquarters TEXT
  );

  CREATE TABLE investors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    focus_areas TEXT,
    notable_investments TEXT
  );

  CREATE TABLE funding_rounds (
    id TEXT PRIMARY KEY,
    startup_id TEXT REFERENCES startups(id),
    stage TEXT,
    amount_usd INTEGER,
    funding_date DATE,
    lead_investor_id TEXT REFERENCES investors(id),
    valuation_usd INTEGER,
    announced INTEGER DEFAULT 1
  );

  CREATE TABLE startup_metrics (
    id TEXT PRIMARY KEY,
    startup_id TEXT REFERENCES startups(id),
    metric_date DATE,
    arr_usd INTEGER,
    employee_count INTEGER,
    monthly_active_users INTEGER
  );

  CREATE INDEX idx_funding_rounds_startup ON funding_rounds(startup_id);
  CREATE INDEX idx_funding_rounds_date ON funding_rounds(funding_date);
  CREATE INDEX idx_funding_rounds_stage ON funding_rounds(stage);
  CREATE INDEX idx_startups_industry ON startups(industry);
  CREATE INDEX idx_startup_metrics_startup ON startup_metrics(startup_id);
`);

// Helper functions
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Data definitions
const INDUSTRIES = [
  { name: 'AI/ML', sub: ['Developer Tools', 'Enterprise AI', 'Computer Vision', 'NLP', 'MLOps', 'AI Infrastructure'] },
  { name: 'Fintech', sub: ['Payments', 'Banking', 'Insurance', 'Lending', 'Wealth Management', 'Crypto'] },
  { name: 'Healthcare', sub: ['Digital Health', 'Biotech', 'Medical Devices', 'Health Insurance', 'Telemedicine'] },
  { name: 'Developer Tools', sub: ['DevOps', 'Security', 'Databases', 'APIs', 'IDEs', 'Testing'] },
  { name: 'E-commerce', sub: ['Marketplaces', 'D2C', 'Logistics', 'Payments', 'Analytics'] },
  { name: 'Cybersecurity', sub: ['Identity', 'Cloud Security', 'Endpoint', 'Network', 'AppSec'] },
  { name: 'Enterprise SaaS', sub: ['HR Tech', 'Sales Tech', 'Marketing Tech', 'Productivity', 'Analytics'] },
  { name: 'Climate Tech', sub: ['Clean Energy', 'Carbon', 'EVs', 'Agriculture', 'Sustainability'] },
];

const CITIES = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
  'Los Angeles, CA', 'Denver, CO', 'Miami, FL', 'Chicago, IL', 'Atlanta, GA',
  'London, UK', 'Berlin, Germany', 'Tel Aviv, Israel', 'Toronto, Canada', 'Singapore'
];

// Real and realistic AI coding tools to include
const AI_CODING_TOOLS = [
  { name: 'Cursor', description: 'AI-first code editor built on VS Code', sub_industry: 'IDEs' },
  { name: 'Replit', description: 'Browser-based IDE with AI coding assistant', sub_industry: 'IDEs' },
  { name: 'Codeium', description: 'Free AI code completion and chat', sub_industry: 'Developer Tools' },
  { name: 'Tabnine', description: 'AI code completion for all IDEs', sub_industry: 'Developer Tools' },
  { name: 'Sourcegraph Cody', description: 'AI coding assistant with codebase context', sub_industry: 'Developer Tools' },
  { name: 'Codegen', description: 'AI-powered code generation platform', sub_industry: 'Developer Tools' },
  { name: 'Sweep AI', description: 'AI junior developer for GitHub issues', sub_industry: 'Developer Tools' },
  { name: 'Aider', description: 'AI pair programming in your terminal', sub_industry: 'Developer Tools' },
  { name: 'Continue', description: 'Open-source AI code assistant', sub_industry: 'IDEs' },
  { name: 'Cosine', description: 'AI software engineer for complex tasks', sub_industry: 'Developer Tools' },
];

// Generate startup names
function generateStartupName(industry: string): string {
  const prefixes = ['Neo', 'Meta', 'Hyper', 'Super', 'Ultra', 'Omni', 'Quantum', 'Nova', 'Apex', 'Prime', 'Core', 'Next', 'Smart', 'Deep', 'Fast', 'Clear', 'Open', 'True', 'Pure', 'Real'];
  const suffixes = ['AI', 'Labs', 'Tech', 'Systems', 'Cloud', 'Data', 'Flow', 'Hub', 'Base', 'Stack', 'Wave', 'Shift', 'Scale', 'Mind', 'Logic', 'Forge', 'Works', 'Space', 'Pulse', 'Grid'];
  const middles = ['Flux', 'Sync', 'Link', 'Core', 'Net', 'Bit', 'Code', 'Node', 'Mesh', 'Edge'];

  const style = Math.random();
  if (style < 0.4) {
    return `${randomChoice(prefixes)}${randomChoice(suffixes)}`;
  } else if (style < 0.7) {
    return `${randomChoice(prefixes)}${randomChoice(middles)}`;
  } else {
    return `${randomChoice(middles)}${randomChoice(suffixes)}`;
  }
}

// Investors data - real and realistic
const INVESTORS_DATA = [
  // Top-tier VCs
  { name: 'Andreessen Horowitz', type: 'vc', focus: ['AI/ML', 'Fintech', 'Enterprise SaaS', 'Crypto'] },
  { name: 'Sequoia Capital', type: 'vc', focus: ['AI/ML', 'Enterprise SaaS', 'Fintech', 'Healthcare'] },
  { name: 'Accel', type: 'vc', focus: ['Enterprise SaaS', 'Fintech', 'Cybersecurity'] },
  { name: 'Lightspeed Venture Partners', type: 'vc', focus: ['Enterprise SaaS', 'Fintech', 'Healthcare'] },
  { name: 'Index Ventures', type: 'vc', focus: ['Fintech', 'E-commerce', 'Enterprise SaaS'] },
  { name: 'Benchmark', type: 'vc', focus: ['Enterprise SaaS', 'E-commerce', 'Developer Tools'] },
  { name: 'Greylock Partners', type: 'vc', focus: ['Enterprise SaaS', 'AI/ML', 'Developer Tools'] },
  { name: 'Bessemer Venture Partners', type: 'vc', focus: ['Enterprise SaaS', 'Healthcare', 'Developer Tools'] },
  { name: 'General Catalyst', type: 'vc', focus: ['Fintech', 'Healthcare', 'Enterprise SaaS'] },
  { name: 'NEA', type: 'vc', focus: ['Healthcare', 'Enterprise SaaS', 'Fintech'] },
  { name: 'Founders Fund', type: 'vc', focus: ['AI/ML', 'Climate Tech', 'Healthcare'] },
  { name: 'Khosla Ventures', type: 'vc', focus: ['AI/ML', 'Climate Tech', 'Healthcare'] },
  { name: 'Insight Partners', type: 'growth_equity', focus: ['Enterprise SaaS', 'Cybersecurity', 'Fintech'] },
  { name: 'Tiger Global', type: 'growth_equity', focus: ['Fintech', 'E-commerce', 'Enterprise SaaS'] },
  { name: 'Coatue Management', type: 'growth_equity', focus: ['AI/ML', 'Fintech', 'Enterprise SaaS'] },

  // Seed/Early stage
  { name: 'Y Combinator', type: 'seed_fund', focus: ['AI/ML', 'Developer Tools', 'Enterprise SaaS', 'Fintech'] },
  { name: 'First Round Capital', type: 'seed_fund', focus: ['Enterprise SaaS', 'Developer Tools', 'E-commerce'] },
  { name: 'Initialized Capital', type: 'seed_fund', focus: ['AI/ML', 'Developer Tools', 'Fintech'] },
  { name: 'Floodgate', type: 'seed_fund', focus: ['Enterprise SaaS', 'Developer Tools', 'AI/ML'] },
  { name: 'SV Angel', type: 'seed_fund', focus: ['AI/ML', 'Enterprise SaaS', 'Developer Tools'] },
  { name: 'Lowercase Capital', type: 'seed_fund', focus: ['Enterprise SaaS', 'E-commerce', 'Fintech'] },
  { name: 'BoxGroup', type: 'seed_fund', focus: ['Enterprise SaaS', 'Fintech', 'E-commerce'] },
  { name: 'Precursor Ventures', type: 'seed_fund', focus: ['Enterprise SaaS', 'Fintech', 'Healthcare'] },

  // AI-focused
  { name: 'AI Grant', type: 'seed_fund', focus: ['AI/ML'] },
  { name: 'Air Street Capital', type: 'seed_fund', focus: ['AI/ML', 'Developer Tools'] },
  { name: 'Conviction', type: 'vc', focus: ['AI/ML', 'Developer Tools'] },
  { name: 'Radical Ventures', type: 'vc', focus: ['AI/ML'] },

  // Corporate VCs
  { name: 'Google Ventures', type: 'corporate', focus: ['AI/ML', 'Healthcare', 'Enterprise SaaS'] },
  { name: 'Microsoft M12', type: 'corporate', focus: ['Enterprise SaaS', 'AI/ML', 'Cybersecurity'] },
  { name: 'Salesforce Ventures', type: 'corporate', focus: ['Enterprise SaaS', 'AI/ML'] },
  { name: 'Intel Capital', type: 'corporate', focus: ['AI/ML', 'Cybersecurity', 'Developer Tools'] },
  { name: 'Nvidia GPU Ventures', type: 'corporate', focus: ['AI/ML', 'Developer Tools'] },
  { name: 'Amazon Alexa Fund', type: 'corporate', focus: ['AI/ML', 'E-commerce'] },

  // Fintech specialists
  { name: 'Ribbit Capital', type: 'vc', focus: ['Fintech'] },
  { name: 'QED Investors', type: 'vc', focus: ['Fintech'] },
  { name: 'Nyca Partners', type: 'vc', focus: ['Fintech'] },

  // Healthcare specialists
  { name: 'Andreessen Horowitz Bio', type: 'vc', focus: ['Healthcare'] },
  { name: 'GV Life Sciences', type: 'corporate', focus: ['Healthcare'] },
  { name: 'ARCH Venture Partners', type: 'vc', focus: ['Healthcare'] },

  // Climate specialists
  { name: 'Breakthrough Energy Ventures', type: 'vc', focus: ['Climate Tech'] },
  { name: 'Lowercarbon Capital', type: 'vc', focus: ['Climate Tech'] },
  { name: 'Congruent Ventures', type: 'vc', focus: ['Climate Tech'] },

  // International
  { name: 'Balderton Capital', type: 'vc', focus: ['Enterprise SaaS', 'Fintech'] },
  { name: 'Atomico', type: 'vc', focus: ['Enterprise SaaS', 'Fintech', 'Climate Tech'] },
  { name: 'Northzone', type: 'vc', focus: ['Fintech', 'Enterprise SaaS'] },
  { name: 'Softbank Vision Fund', type: 'growth_equity', focus: ['AI/ML', 'E-commerce', 'Fintech'] },

  // More seed funds
  { name: 'Notation Capital', type: 'seed_fund', focus: ['Developer Tools', 'Enterprise SaaS'] },
  { name: 'Craft Ventures', type: 'vc', focus: ['Enterprise SaaS', 'Fintech', 'AI/ML'] },
  { name: 'Redpoint Ventures', type: 'vc', focus: ['Enterprise SaaS', 'Developer Tools', 'Fintech'] },
  { name: 'Scale Venture Partners', type: 'vc', focus: ['Enterprise SaaS', 'AI/ML'] },
  { name: 'Spark Capital', type: 'vc', focus: ['Enterprise SaaS', 'E-commerce', 'Fintech'] },
  { name: 'Union Square Ventures', type: 'vc', focus: ['Fintech', 'E-commerce', 'Climate Tech'] },
  { name: 'Battery Ventures', type: 'vc', focus: ['Enterprise SaaS', 'Developer Tools'] },
  { name: 'IVP', type: 'growth_equity', focus: ['Enterprise SaaS', 'Fintech', 'E-commerce'] },
  { name: 'Menlo Ventures', type: 'vc', focus: ['Enterprise SaaS', 'Cybersecurity', 'AI/ML'] },
  { name: 'Felicis Ventures', type: 'vc', focus: ['Enterprise SaaS', 'Fintech', 'Developer Tools'] },
  { name: 'CRV', type: 'vc', focus: ['Enterprise SaaS', 'Developer Tools', 'AI/ML'] },
  { name: 'Wing VC', type: 'vc', focus: ['Enterprise SaaS', 'AI/ML'] },
  { name: 'Sapphire Ventures', type: 'growth_equity', focus: ['Enterprise SaaS'] },
  { name: 'Obvious Ventures', type: 'vc', focus: ['Climate Tech', 'Healthcare'] },
  { name: 'Data Collective', type: 'vc', focus: ['AI/ML', 'Developer Tools'] },
  { name: 'Emergence Capital', type: 'vc', focus: ['Enterprise SaaS'] },
  { name: 'Costanoa Ventures', type: 'seed_fund', focus: ['Enterprise SaaS', 'Developer Tools'] },
  { name: 'Unusual Ventures', type: 'seed_fund', focus: ['Enterprise SaaS', 'Developer Tools'] },
  { name: 'Foundation Capital', type: 'vc', focus: ['Enterprise SaaS', 'AI/ML'] },
  { name: 'Eclipse Ventures', type: 'vc', focus: ['Developer Tools', 'Climate Tech'] },
];

// Funding round amounts by stage (in USD)
const FUNDING_RANGES: Record<string, { min: number; max: number; valuation_multiple: number }> = {
  'Pre-Seed': { min: 500000, max: 3000000, valuation_multiple: 8 },
  'Seed': { min: 2000000, max: 10000000, valuation_multiple: 10 },
  'Series A': { min: 10000000, max: 40000000, valuation_multiple: 12 },
  'Series B': { min: 30000000, max: 100000000, valuation_multiple: 10 },
  'Series C': { min: 80000000, max: 300000000, valuation_multiple: 8 },
};

// Generate data
console.log('Generating startup funding database...');

// 1. Insert investors
const insertInvestor = db.prepare(`
  INSERT INTO investors (id, name, type, focus_areas, notable_investments)
  VALUES (?, ?, ?, ?, ?)
`);

const investors: { id: string; name: string; type: string; focus: string[] }[] = [];

for (const inv of INVESTORS_DATA) {
  const id = randomUUID();
  investors.push({ id, name: inv.name, type: inv.type, focus: inv.focus });
  insertInvestor.run(id, inv.name, inv.type, JSON.stringify(inv.focus), null);
}

console.log(`Created ${investors.length} investors`);

// 2. Insert startups
const insertStartup = db.prepare(`
  INSERT INTO startups (id, name, industry, sub_industry, founded_date, description, website, headquarters)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const startups: { id: string; name: string; industry: string; founded: string }[] = [];
const usedNames = new Set<string>();

// First, add AI coding tools
for (const tool of AI_CODING_TOOLS) {
  const id = randomUUID();
  const founded = randomDate(new Date('2019-01-01'), new Date('2023-06-01'));
  const website = `https://${tool.name.toLowerCase().replace(/\s+/g, '')}.ai`;

  startups.push({ id, name: tool.name, industry: 'AI/ML', founded });
  usedNames.add(tool.name);

  insertStartup.run(
    id,
    tool.name,
    'AI/ML',
    tool.sub_industry,
    founded,
    tool.description,
    website,
    randomChoice(CITIES)
  );
}

// Generate remaining startups
while (startups.length < 200) {
  const industry = randomChoice(INDUSTRIES);
  let name = generateStartupName(industry.name);

  // Ensure unique names
  while (usedNames.has(name)) {
    name = generateStartupName(industry.name);
  }
  usedNames.add(name);

  const id = randomUUID();
  const founded = randomDate(new Date('2018-01-01'), new Date('2024-06-01'));
  const subIndustry = randomChoice(industry.sub);
  const website = `https://${name.toLowerCase()}.com`;
  const description = `${subIndustry} platform for enterprise customers`;

  startups.push({ id, name, industry: industry.name, founded });

  insertStartup.run(
    id,
    name,
    industry.name,
    subIndustry,
    founded,
    description,
    website,
    randomChoice(CITIES)
  );
}

console.log(`Created ${startups.length} startups`);

// 3. Insert funding rounds
const insertRound = db.prepare(`
  INSERT INTO funding_rounds (id, startup_id, stage, amount_usd, funding_date, lead_investor_id, valuation_usd, announced)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let roundCount = 0;
const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C'];

for (const startup of startups) {
  const foundedDate = new Date(startup.founded);
  const maxStageIndex = Math.min(
    stages.length - 1,
    Math.floor((new Date().getTime() - foundedDate.getTime()) / (365 * 24 * 60 * 60 * 1000) * 0.8)
  );

  // Determine how many rounds this startup has (some drop out at each stage)
  const numRounds = Math.min(maxStageIndex + 1, randomInt(1, Math.max(1, maxStageIndex + 1)));

  let lastRoundDate = foundedDate;

  for (let i = 0; i < numRounds; i++) {
    const stage = stages[i];
    const range = FUNDING_RANGES[stage];

    // Calculate funding date (6-18 months after previous round or founding)
    const monthsAfter = randomInt(6, 18);
    const roundDate = new Date(lastRoundDate.getTime() + monthsAfter * 30 * 24 * 60 * 60 * 1000);

    // Don't create rounds in the future
    if (roundDate > new Date()) break;

    const amount = randomInt(range.min, range.max);
    const valuation = amount * range.valuation_multiple;

    // Pick an investor that focuses on this industry
    const relevantInvestors = investors.filter(inv =>
      inv.focus.includes(startup.industry) || Math.random() < 0.1
    );
    const leadInvestor = randomChoice(relevantInvestors);

    insertRound.run(
      randomUUID(),
      startup.id,
      stage,
      amount,
      roundDate.toISOString().split('T')[0],
      leadInvestor.id,
      valuation,
      Math.random() > 0.05 ? 1 : 0 // 95% announced
    );

    roundCount++;
    lastRoundDate = roundDate;
  }
}

console.log(`Created ${roundCount} funding rounds`);

// 4. Insert metrics for ~50 startups
const insertMetric = db.prepare(`
  INSERT INTO startup_metrics (id, startup_id, metric_date, arr_usd, employee_count, monthly_active_users)
  VALUES (?, ?, ?, ?, ?, ?)
`);

let metricsCount = 0;
const startupsWithMetrics = startups
  .filter(() => Math.random() < 0.25) // ~50 startups
  .slice(0, 50);

for (const startup of startupsWithMetrics) {
  const foundedDate = new Date(startup.founded);
  let currentDate = new Date(foundedDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000); // Start 6 months after founding

  let arr = randomInt(50000, 200000);
  let employees = randomInt(3, 10);
  let mau = randomInt(100, 5000);

  // Generate quarterly metrics
  while (currentDate < new Date() && metricsCount < 500) {
    insertMetric.run(
      randomUUID(),
      startup.id,
      currentDate.toISOString().split('T')[0],
      arr,
      employees,
      mau
    );

    metricsCount++;

    // Growth (variable by startup)
    const growthRate = 1 + (Math.random() * 0.3 + 0.05); // 5-35% quarterly growth
    arr = Math.round(arr * growthRate);
    employees = Math.round(employees * (1 + Math.random() * 0.2));
    mau = Math.round(mau * growthRate);

    // Move to next quarter
    currentDate = new Date(currentDate.getTime() + 3 * 30 * 24 * 60 * 60 * 1000);
  }
}

console.log(`Created ${metricsCount} metric records for ${startupsWithMetrics.length} startups`);

// Create summary views
db.exec(`
  CREATE VIEW IF NOT EXISTS funding_summary AS
  SELECT
    strftime('%Y', fr.funding_date) as year,
    s.industry,
    fr.stage,
    COUNT(*) as deal_count,
    SUM(fr.amount_usd) as total_funding,
    AVG(fr.amount_usd) as avg_deal_size,
    AVG(fr.valuation_usd) as avg_valuation
  FROM funding_rounds fr
  JOIN startups s ON fr.startup_id = s.id
  WHERE fr.announced = 1
  GROUP BY year, s.industry, fr.stage;

  CREATE VIEW IF NOT EXISTS investor_portfolio AS
  SELECT
    i.id as investor_id,
    i.name as investor_name,
    i.type as investor_type,
    COUNT(DISTINCT fr.startup_id) as portfolio_companies,
    COUNT(*) as total_investments,
    SUM(fr.amount_usd) as total_invested,
    GROUP_CONCAT(DISTINCT s.industry) as industries
  FROM investors i
  JOIN funding_rounds fr ON fr.lead_investor_id = i.id
  JOIN startups s ON fr.startup_id = s.id
  GROUP BY i.id;
`);

console.log('Created summary views');

// Verify data
const stats = {
  startups: db.prepare('SELECT COUNT(*) as count FROM startups').get() as { count: number },
  investors: db.prepare('SELECT COUNT(*) as count FROM investors').get() as { count: number },
  rounds: db.prepare('SELECT COUNT(*) as count FROM funding_rounds').get() as { count: number },
  metrics: db.prepare('SELECT COUNT(*) as count FROM startup_metrics').get() as { count: number },
};

console.log('\n=== Database Summary ===');
console.log(`Startups: ${stats.startups.count}`);
console.log(`Investors: ${stats.investors.count}`);
console.log(`Funding Rounds: ${stats.rounds.count}`);
console.log(`Metric Records: ${stats.metrics.count}`);
console.log(`\nDatabase saved to: ${DB_PATH}`);

db.close();
