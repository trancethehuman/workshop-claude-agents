# SQL Patterns for Workshop Databases

Reusable SQL patterns for both SQLite databases. Extends the project-level `references/sql-patterns.md` with additional patterns for `sample-sales.db`.

---

## Schema Discovery

Run these first when profiling any database:

```bash
# List all tables
sqlite3 data/startup-funding.db ".tables"

# Get column info for a specific table
sqlite3 data/startup-funding.db "PRAGMA table_info(funding_rounds);"

# Quick row counts for all tables
sqlite3 -header -column data/startup-funding.db <<'SQL'
SELECT
  'startups' as tbl, COUNT(*) as rows FROM startups
UNION ALL SELECT
  'funding_rounds', COUNT(*) FROM funding_rounds
UNION ALL SELECT
  'investors', COUNT(*) FROM investors
UNION ALL SELECT
  'startup_metrics', COUNT(*) FROM startup_metrics;
SQL
```

---

## Quick Health Check

### startup-funding.db

```bash
sqlite3 -header -column data/startup-funding.db <<'SQL'
SELECT
  COUNT(DISTINCT startup_id) as startups_with_funding,
  COUNT(*) as total_rounds,
  MIN(funding_date) as earliest_round,
  MAX(funding_date) as latest_round,
  SUM(amount_usd) / 1000000.0 as total_funding_millions,
  AVG(amount_usd) / 1000000.0 as avg_round_millions
FROM funding_rounds;
SQL
```

### sample-sales.db

```bash
sqlite3 -header -column data/sample-sales.db <<'SQL'
SELECT
  (SELECT COUNT(*) FROM customers) as customers,
  (SELECT COUNT(*) FROM deals) as deals,
  (SELECT COUNT(*) FROM activities) as activities,
  (SELECT SUM(value) FROM deals) as total_pipeline_value,
  (SELECT COUNT(*) FROM deals WHERE closed_at IS NOT NULL) as closed_deals,
  (SELECT COUNT(*) FROM deals WHERE closed_at IS NULL) as open_deals;
SQL
```

---

## Time-Series Aggregation

### Monthly Funding Trends (startup-funding.db)

```sql
SELECT
  strftime('%Y-%m', funding_date) as month,
  COUNT(*) as deal_count,
  SUM(amount_usd) / 1000000.0 as total_millions,
  AVG(amount_usd) / 1000000.0 as avg_millions
FROM funding_rounds
WHERE funding_date >= date('now', '-12 months')
GROUP BY month
ORDER BY month DESC;
```

### Quarterly Funding by Stage (startup-funding.db)

```sql
SELECT
  strftime('%Y-Q', funding_date) ||
    CASE
      WHEN CAST(strftime('%m', funding_date) AS INTEGER) <= 3 THEN '1'
      WHEN CAST(strftime('%m', funding_date) AS INTEGER) <= 6 THEN '2'
      WHEN CAST(strftime('%m', funding_date) AS INTEGER) <= 9 THEN '3'
      ELSE '4'
    END as quarter,
  stage,
  COUNT(*) as deals,
  SUM(amount_usd) / 1000000.0 as total_millions
FROM funding_rounds
GROUP BY quarter, stage
ORDER BY quarter DESC, stage;
```

### Monthly Deal Activity (sample-sales.db)

```sql
SELECT
  strftime('%Y-%m', created_at) as month,
  COUNT(*) as new_deals,
  SUM(value) as pipeline_added,
  AVG(value) as avg_deal_value
FROM deals
GROUP BY month
ORDER BY month DESC;
```

---

## Window Functions

### Ranking Startups by Funding

```sql
SELECT
  s.name,
  s.industry,
  fr.amount_usd / 1000000.0 as amount_millions,
  fr.stage,
  RANK() OVER (
    PARTITION BY s.industry
    ORDER BY fr.amount_usd DESC
  ) as industry_rank
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
WHERE fr.stage = 'Series A';
```

### Running Totals

```sql
-- Cumulative funding by startup
SELECT
  s.name,
  fr.funding_date,
  fr.stage,
  fr.amount_usd / 1000000.0 as round_millions,
  SUM(fr.amount_usd) OVER (
    PARTITION BY fr.startup_id
    ORDER BY fr.funding_date
  ) / 1000000.0 as cumulative_millions
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
ORDER BY s.name, fr.funding_date;
```

### Month-over-Month Change (LAG)

```sql
WITH monthly AS (
  SELECT
    strftime('%Y-%m', funding_date) as month,
    SUM(amount_usd) as total
  FROM funding_rounds
  GROUP BY month
)
SELECT
  month,
  total / 1000000.0 as total_millions,
  LAG(total) OVER (ORDER BY month) / 1000000.0 as prev_month_millions,
  ROUND((total - LAG(total) OVER (ORDER BY month)) * 100.0 /
    LAG(total) OVER (ORDER BY month), 1) as pct_change
FROM monthly
ORDER BY month DESC
LIMIT 12;
```

---

## Cohort Analysis

### Series A → B Conversion by Year

```sql
WITH series_a AS (
  SELECT
    startup_id,
    funding_date as series_a_date,
    strftime('%Y', funding_date) as cohort_year
  FROM funding_rounds
  WHERE stage = 'Series A'
),
series_b AS (
  SELECT startup_id, funding_date as series_b_date
  FROM funding_rounds
  WHERE stage = 'Series B'
)
SELECT
  a.cohort_year,
  COUNT(DISTINCT a.startup_id) as series_a_count,
  COUNT(DISTINCT b.startup_id) as converted_to_b,
  ROUND(COUNT(DISTINCT b.startup_id) * 100.0 /
    COUNT(DISTINCT a.startup_id), 1) as conversion_rate_pct
FROM series_a a
LEFT JOIN series_b b ON a.startup_id = b.startup_id
  AND b.series_b_date > a.series_a_date
GROUP BY a.cohort_year
ORDER BY a.cohort_year;
```

### Average Days Between Rounds

```sql
WITH round_sequence AS (
  SELECT
    startup_id,
    stage,
    funding_date,
    LAG(funding_date) OVER (
      PARTITION BY startup_id
      ORDER BY funding_date
    ) as prev_round_date,
    LAG(stage) OVER (
      PARTITION BY startup_id
      ORDER BY funding_date
    ) as prev_stage
  FROM funding_rounds
)
SELECT
  prev_stage || ' → ' || stage as transition,
  COUNT(*) as count,
  ROUND(AVG(JULIANDAY(funding_date) - JULIANDAY(prev_round_date)), 0) as avg_days,
  MIN(JULIANDAY(funding_date) - JULIANDAY(prev_round_date)) as min_days,
  MAX(JULIANDAY(funding_date) - JULIANDAY(prev_round_date)) as max_days
FROM round_sequence
WHERE prev_round_date IS NOT NULL
GROUP BY transition
ORDER BY avg_days;
```

---

## Conversion Funnels

### Funding Stage Funnel (startup-funding.db)

```sql
WITH stages AS (
  SELECT
    startup_id,
    MAX(CASE WHEN stage = 'Pre-Seed' THEN 1 ELSE 0 END) as has_preseed,
    MAX(CASE WHEN stage = 'Seed' THEN 1 ELSE 0 END) as has_seed,
    MAX(CASE WHEN stage = 'Series A' THEN 1 ELSE 0 END) as has_series_a,
    MAX(CASE WHEN stage = 'Series B' THEN 1 ELSE 0 END) as has_series_b,
    MAX(CASE WHEN stage = 'Series C' THEN 1 ELSE 0 END) as has_series_c
  FROM funding_rounds
  GROUP BY startup_id
)
SELECT
  SUM(has_preseed) as preseed_companies,
  SUM(has_seed) as seed_companies,
  SUM(has_series_a) as series_a_companies,
  SUM(has_series_b) as series_b_companies,
  SUM(has_series_c) as series_c_companies,
  ROUND(SUM(has_series_a) * 100.0 / NULLIF(SUM(has_seed), 0), 1) as seed_to_a_rate,
  ROUND(SUM(has_series_b) * 100.0 / NULLIF(SUM(has_series_a), 0), 1) as a_to_b_rate,
  ROUND(SUM(has_series_c) * 100.0 / NULLIF(SUM(has_series_b), 0), 1) as b_to_c_rate
FROM stages;
```

### Sales Pipeline Funnel (sample-sales.db)

```sql
SELECT
  stage,
  COUNT(*) as deal_count,
  SUM(value) as total_value,
  AVG(value) as avg_value,
  AVG(probability) as avg_probability,
  SUM(value * probability / 100.0) as weighted_value
FROM deals
GROUP BY stage
ORDER BY avg_probability DESC;
```

---

## Investor Analysis (startup-funding.db)

### Top Investors by Activity

```sql
SELECT
  i.name as investor,
  i.type,
  COUNT(DISTINCT fr.startup_id) as portfolio_companies,
  COUNT(*) as total_investments,
  ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT fr.startup_id), 2) as avg_rounds_per_company,
  SUM(fr.amount_usd) / 1000000.0 as total_invested_millions
FROM investors i
JOIN funding_rounds fr ON fr.lead_investor_id = i.id
GROUP BY i.id
HAVING portfolio_companies >= 3
ORDER BY portfolio_companies DESC
LIMIT 20;
```

### Investor Stage Preferences

```sql
SELECT
  i.name as investor,
  fr.stage,
  COUNT(*) as deal_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY i.id), 1) as pct_of_deals
FROM investors i
JOIN funding_rounds fr ON fr.lead_investor_id = i.id
GROUP BY i.id, fr.stage
ORDER BY i.name, deal_count DESC;
```

---

## Sales Pipeline Patterns (sample-sales.db)

### Win Rate by Owner

```sql
SELECT
  owner,
  COUNT(*) as total_deals,
  SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) as won,
  SUM(CASE WHEN stage = 'Closed Lost' THEN 1 ELSE 0 END) as lost,
  ROUND(SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) * 100.0 /
    NULLIF(SUM(CASE WHEN stage IN ('Closed Won', 'Closed Lost') THEN 1 ELSE 0 END), 0), 1) as win_rate_pct,
  SUM(CASE WHEN stage = 'Closed Won' THEN value ELSE 0 END) as revenue_won
FROM deals
GROUP BY owner
ORDER BY win_rate_pct DESC;
```

### Weighted Pipeline Value

```sql
SELECT
  owner,
  COUNT(*) as open_deals,
  SUM(value) as total_pipeline,
  SUM(value * probability / 100.0) as weighted_pipeline,
  AVG(probability) as avg_probability
FROM deals
WHERE closed_at IS NULL
GROUP BY owner
ORDER BY weighted_pipeline DESC;
```

### Deal Velocity (Days to Close)

```sql
SELECT
  stage,
  owner,
  COUNT(*) as deals,
  ROUND(AVG(JULIANDAY(closed_at) - JULIANDAY(created_at)), 1) as avg_days_to_close,
  MIN(JULIANDAY(closed_at) - JULIANDAY(created_at)) as fastest_days,
  MAX(JULIANDAY(closed_at) - JULIANDAY(created_at)) as slowest_days
FROM deals
WHERE closed_at IS NOT NULL
GROUP BY stage, owner
ORDER BY stage, avg_days_to_close;
```

### Activity Engagement per Deal

```sql
SELECT
  d.deal_name,
  d.stage,
  d.value,
  COUNT(a.id) as activity_count,
  COUNT(DISTINCT a.activity_type) as activity_types,
  MIN(a.created_at) as first_activity,
  MAX(a.created_at) as last_activity
FROM deals d
LEFT JOIN activities a ON d.id = a.deal_id
GROUP BY d.id
ORDER BY activity_count DESC
LIMIT 20;
```

### Deals by Customer Industry

```sql
SELECT
  c.industry,
  COUNT(d.id) as deal_count,
  SUM(d.value) as total_value,
  AVG(d.value) as avg_deal_value,
  SUM(CASE WHEN d.stage = 'Closed Won' THEN d.value ELSE 0 END) as won_value
FROM customers c
JOIN deals d ON c.id = d.customer_id
GROUP BY c.industry
ORDER BY total_value DESC;
```

---

## Context Management Patterns

Always apply these when querying:

```sql
-- Safe exploration: always use LIMIT
SELECT * FROM funding_rounds ORDER BY funding_date DESC LIMIT 100;

-- Aggregate first, drill down second
SELECT stage, COUNT(*) as count FROM funding_rounds GROUP BY stage;
-- Then: SELECT * FROM funding_rounds WHERE stage = 'Series A' ORDER BY amount_usd DESC LIMIT 50;

-- Check row counts before any broad query
SELECT
  (SELECT COUNT(*) FROM startups) as startup_count,
  (SELECT COUNT(*) FROM funding_rounds) as round_count,
  (SELECT COUNT(*) FROM investors) as investor_count;
```
