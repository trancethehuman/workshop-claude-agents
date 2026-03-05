# Data Catalog

Complete schema documentation for all 5 workshop data sources.

---

## 1. startup-funding.db (SQLite)

**Path:** `data/startup-funding.db`
**Description:** Startup ecosystem database with companies, funding rounds, investors, and performance metrics.

### Tables

#### `startups` — 200 rows

| Column | Type | Nullable | PK | Description |
|--------|------|----------|-----|-------------|
| id | TEXT | No | Yes | Unique startup ID |
| name | TEXT | No | | Company name |
| industry | TEXT | No | | Primary industry |
| sub_industry | TEXT | Yes | | Sub-industry classification |
| founded_date | DATE | Yes | | Date founded |
| description | TEXT | Yes | | Company description |
| website | TEXT | Yes | | Company website |
| headquarters | TEXT | Yes | | HQ location |

#### `funding_rounds` — 479 rows

| Column | Type | Nullable | PK | Description |
|--------|------|----------|-----|-------------|
| id | TEXT | No | Yes | Round ID |
| startup_id | TEXT | Yes | | FK → startups.id |
| stage | TEXT | Yes | | Pre-Seed, Seed, Series A/B/C |
| amount_usd | INTEGER | Yes | | Round amount in USD |
| funding_date | DATE | Yes | | Date of funding |
| lead_investor_id | TEXT | Yes | | FK → investors.id |
| valuation_usd | INTEGER | Yes | | Post-money valuation |
| announced | INTEGER | Yes | | 1 = public, 0 = stealth |

#### `investors` — 66 rows

| Column | Type | Nullable | PK | Description |
|--------|------|----------|-----|-------------|
| id | TEXT | No | Yes | Investor ID |
| name | TEXT | No | | Investor/firm name |
| type | TEXT | Yes | | VC, Angel, Corporate, etc. |
| focus_areas | TEXT | Yes | | Investment focus areas |
| notable_investments | TEXT | Yes | | Key portfolio companies |

#### `startup_metrics` — 500 rows

| Column | Type | Nullable | PK | Description |
|--------|------|----------|-----|-------------|
| id | TEXT | No | Yes | Metric record ID |
| startup_id | TEXT | Yes | | FK → startups.id |
| metric_date | DATE | Yes | | Observation date |
| arr_usd | INTEGER | Yes | | Annual recurring revenue |
| employee_count | INTEGER | Yes | | Headcount |
| monthly_active_users | INTEGER | Yes | | MAU count |

### Views

#### `funding_summary` — 187 rows

Pre-aggregated funding data by year, industry, and stage.

| Column | Description |
|--------|-------------|
| year | Funding year |
| industry | Startup industry |
| stage | Funding stage |
| deal_count | Number of deals |
| total_funding | Sum of amount_usd |
| avg_deal_size | Average round size |
| avg_valuation | Average valuation |

#### `investor_portfolio` — 66 rows

Pre-aggregated investor portfolio summaries.

| Column | Description |
|--------|-------------|
| investor_id | Investor ID |
| investor_name | Investor name |
| investor_type | Investor type |
| portfolio_companies | Number of portfolio companies |
| total_investments | Total investment count |
| total_invested | Sum invested |
| industries | Industries covered |

### Key Relationships

```
startups.id ← funding_rounds.startup_id
investors.id ← funding_rounds.lead_investor_id
startups.id ← startup_metrics.startup_id
```

---

## 2. sample-sales.db (SQLite)

**Path:** `data/sample-sales.db`
**Description:** B2B sales pipeline database with customers, deals, and activity history.

### Tables

#### `customers` — 50 rows

| Column | Type | Nullable | PK | Description |
|--------|------|----------|-----|-------------|
| id | INTEGER | No | Yes | Customer ID |
| name | TEXT | No | | Company name |
| industry | TEXT | No | | Industry vertical |
| company_size | TEXT | No | | Size category |
| annual_revenue | INTEGER | Yes | | Annual revenue USD |
| region | TEXT | No | | Geographic region |
| created_at | TEXT | No | | Account creation date |

#### `deals` — 100 rows

| Column | Type | Nullable | PK | Description |
|--------|------|----------|-----|-------------|
| id | INTEGER | No | Yes | Deal ID |
| customer_id | INTEGER | No | | FK → customers.id |
| deal_name | TEXT | No | | Deal description |
| value | INTEGER | No | | Deal value USD |
| stage | TEXT | No | | Pipeline stage |
| probability | INTEGER | No | | Win probability % |
| owner | TEXT | No | | Sales rep name |
| created_at | TEXT | No | | Deal creation date |
| closed_at | TEXT | Yes | | Close date (null if open) |

#### `activities` — 525 rows

| Column | Type | Nullable | PK | Description |
|--------|------|----------|-----|-------------|
| id | INTEGER | No | Yes | Activity ID |
| deal_id | INTEGER | No | | FK → deals.id |
| activity_type | TEXT | No | | Type (email, call, meeting, etc.) |
| description | TEXT | Yes | | Activity details |
| created_at | TEXT | No | | Activity date |

### Key Relationships

```
customers.id ← deals.customer_id
deals.id ← activities.deal_id
```

---

## 3. customer-metrics.csv

**Path:** `data/customer-metrics.csv`
**Description:** Monthly SaaS customer health metrics — usage, revenue, and satisfaction indicators.
**Rows:** 682 (+ 1 header)

| Column | Type | Description |
|--------|------|-------------|
| month | date (YYYY-MM-DD) | Observation month |
| company | string | Customer company name |
| industry | string | Industry vertical |
| region | string | Geographic region |
| segment | string | Customer segment (Enterprise, Mid-Market, etc.) |
| product | string | Product line |
| account_owner | string | Account manager name |
| acquisition_channel | string | How customer was acquired |
| mrr_usd | numeric | Monthly recurring revenue |
| arr_usd | numeric | Annual recurring revenue |
| monthly_logins | integer | Login count for the month |
| features_used | integer | Number of features used |
| support_tickets | integer | Support tickets filed |
| nps_score | numeric | Net Promoter Score (may be empty) |
| months_as_customer | integer | Customer tenure in months |
| status | string | Active, Churned, etc. |

### Key Dimensions for Analysis

- **Segmentation:** segment, industry, region, product, acquisition_channel
- **Revenue:** mrr_usd, arr_usd
- **Engagement:** monthly_logins, features_used
- **Health signals:** support_tickets, nps_score, status

---

## 4. mock-crm.json

**Path:** `data/mock-crm.json`
**Description:** Simplified CRM data with contacts, companies, and activity history.

### Structure

```json
{
  "contacts": [...],    // 5 entries
  "companies": [...],   // 5 entries
  "activities": [...]   // 5 entries
}
```

#### contacts

| Field | Type | Example |
|-------|------|---------|
| id | string | "c001" |
| name | string | "Sarah Chen" |
| email | string | "sarah@techcorp.com" |
| company_id | string | "comp001" |
| title | string | "VP Engineering" |
| phone | string | "555-0101" |

#### companies

| Field | Type | Example |
|-------|------|---------|
| id | string | "comp001" |
| name | string | "TechCorp" |
| industry | string | "Technology" |
| size | integer | 500 |
| website | string | "https://techcorp.com" |

#### activities

| Field | Type | Example |
|-------|------|---------|
| id | string | "a001" |
| contact_id | string | "c001" |
| type | string | "email", "call", "meeting" |
| date | string | "2024-01-15" |
| subject | string | "Product demo follow-up" |
| outcome | string | "Scheduled next meeting" |

### Relationships

```
companies.id ← contacts.company_id
contacts.id ← activities.contact_id
```

---

## 5. sample-deals.json

**Path:** `data/sample-deals.json`
**Description:** Detailed deal pipeline with nested notes and competitive intelligence.
**Entries:** 5 deal objects

### Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Deal ID (e.g., "deal_001") |
| company | string | Company name |
| contact | string | Primary contact |
| value | integer | Deal value USD |
| stage | string | Discovery, Demo, Proposal, Negotiation |
| probability | integer | Win probability 0-100 |
| created_date | string | Deal creation date |
| expected_close | string | Expected close date |
| last_activity | string | Last activity date |
| days_in_stage | integer | Days in current stage |
| notes | array | Objects with `date` and `note` fields |
| competitors | array | Competitor company names |
| champion | string | Internal champion |
| decision_maker | string | Final decision maker |

### Nested: notes[]

| Field | Type |
|-------|------|
| date | string (YYYY-MM-DD) |
| note | string |

### Nested: competitors[]

Array of competitor name strings.
