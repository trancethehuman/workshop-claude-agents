#!/usr/bin/env npx tsx
/**
 * build-funding-dashboard.ts
 * Extracts data from startup-funding.db and generates a self-contained HTML dashboard.
 */

import Database from 'better-sqlite3';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'data', 'startup-funding.db');
const TEMPLATE_PATH = join(ROOT, 'scripts', 'funding-dashboard-template.html');
const OUTPUT_PATH = join(ROOT, 'output', 'startup-funding-dashboard.html');

const db = new Database(DB_PATH, { readonly: true });

// --- Queries ---

const overview = db.prepare(`
  SELECT
    (SELECT COUNT(*) FROM startups) as totalStartups,
    (SELECT COUNT(*) FROM funding_rounds) as totalRounds,
    (SELECT COUNT(*) FROM investors) as totalInvestors,
    (SELECT SUM(amount_usd) FROM funding_rounds) as totalFunding,
    (SELECT ROUND(AVG(amount_usd)) FROM funding_rounds) as avgDealSize,
    (SELECT ROUND(AVG(valuation_usd)) FROM funding_rounds WHERE valuation_usd > 0) as avgValuation,
    (SELECT MIN(funding_date) FROM funding_rounds) as minDate,
    (SELECT MAX(funding_date) FROM funding_rounds) as maxDate
`).get() as any;

const topIndustry = db.prepare(`
  SELECT industry, SUM(amount_usd) as total
  FROM funding_rounds fr JOIN startups s ON fr.startup_id = s.id
  GROUP BY industry ORDER BY total DESC LIMIT 1
`).get() as any;

const fundingByYearStage = db.prepare(`
  SELECT strftime('%Y', funding_date) as year, stage, SUM(amount_usd) as total, COUNT(*) as deals
  FROM funding_rounds
  GROUP BY year, stage
  ORDER BY year, stage
`).all();

const stageDistribution = db.prepare(`
  SELECT stage, COUNT(*) as count, SUM(amount_usd) as total, ROUND(AVG(amount_usd)) as avg
  FROM funding_rounds GROUP BY stage
  ORDER BY CASE stage
    WHEN 'Pre-Seed' THEN 1 WHEN 'Seed' THEN 2 WHEN 'Series A' THEN 3
    WHEN 'Series B' THEN 4 WHEN 'Series C' THEN 5 END
`).all();

const industryBreakdown = db.prepare(`
  SELECT s.industry, COUNT(*) as deals, SUM(fr.amount_usd) as total
  FROM funding_rounds fr JOIN startups s ON fr.startup_id = s.id
  GROUP BY s.industry ORDER BY total DESC
`).all();

const topInvestors = db.prepare(`
  SELECT i.name, i.type, COUNT(DISTINCT fr.startup_id) as companies, COUNT(*) as deals,
         SUM(fr.amount_usd) as totalInvested
  FROM investors i
  JOIN funding_rounds fr ON fr.lead_investor_id = i.id
  GROUP BY i.id ORDER BY totalInvested DESC LIMIT 20
`).all();

const companies = db.prepare(`
  SELECT s.name, s.industry, s.headquarters, s.founded_date,
         COUNT(fr.id) as rounds, SUM(fr.amount_usd) as totalFunding,
         MAX(fr.stage) as latestStage, MAX(fr.valuation_usd) as latestValuation
  FROM startups s
  LEFT JOIN funding_rounds fr ON fr.startup_id = s.id
  GROUP BY s.id
  ORDER BY totalFunding DESC
`).all();

db.close();

// --- Build data object ---
const data = {
  overview: { ...overview, topIndustry: topIndustry?.industry || 'N/A' },
  fundingByYearStage,
  stageDistribution,
  industryBreakdown,
  topInvestors,
  companies,
};

// --- Output ---
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
const template = readFileSync(TEMPLATE_PATH, 'utf-8');
const html = template.replace(
  '/*__DASHBOARD_DATA__*/',
  `window.DASHBOARD_DATA = ${JSON.stringify(data)};`
);
writeFileSync(OUTPUT_PATH, html, 'utf-8');

console.log(`Dashboard written to ${OUTPUT_PATH}`);
console.log(`  ${data.overview.totalStartups} startups, ${data.overview.totalRounds} rounds, ${data.overview.totalInvestors} investors`);
console.log(`  Total funding: $${(data.overview.totalFunding / 1e9).toFixed(2)}B`);
