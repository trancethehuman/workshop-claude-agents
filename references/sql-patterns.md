# SQL Patterns for Data Analysis

Reusable SQL patterns for analyzing the startup funding database.

---

## Time-Series Aggregation

```sql
-- Monthly funding trends
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

```sql
-- Quarterly breakdown by stage
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

---

## Window Functions

### Ranking Within Categories

```sql
-- Rank startups by funding within their industry
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

### Compare to Previous Period

```sql
-- Month-over-month funding change
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

### Funding Cohorts by Year

```sql
-- Track Series A cohorts through to Series B
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

### Time to Next Round

```sql
-- Average days between funding rounds
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

```sql
-- Funding stage conversion funnel
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

---

## Investor Analysis

### Top Investors by Activity

```sql
-- Most active investors
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
-- Which stages each investor focuses on
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

## Industry Analysis

### Industry Breakdown

```sql
-- Funding by industry
SELECT
  s.industry,
  COUNT(DISTINCT s.id) as startup_count,
  COUNT(fr.id) as total_rounds,
  SUM(fr.amount_usd) / 1000000.0 as total_funding_millions,
  AVG(fr.amount_usd) / 1000000.0 as avg_round_millions
FROM startups s
LEFT JOIN funding_rounds fr ON s.id = fr.startup_id
GROUP BY s.industry
ORDER BY total_funding_millions DESC;
```

### Industry Trends Over Time

```sql
-- Quarterly funding by industry
SELECT
  strftime('%Y', fr.funding_date) as year,
  s.industry,
  COUNT(*) as deals,
  SUM(fr.amount_usd) / 1000000.0 as total_millions
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
WHERE fr.funding_date >= date('now', '-3 years')
GROUP BY year, s.industry
ORDER BY year DESC, total_millions DESC;
```

---

## Context Management Patterns

Always apply these patterns when querying large datasets:

### Always Use LIMIT for Exploration

```sql
-- Safe exploration query
SELECT * FROM funding_rounds
ORDER BY funding_date DESC
LIMIT 100;
```

### Aggregate Before Drilling Down

```sql
-- Step 1: Get overview
SELECT stage, COUNT(*) as count
FROM funding_rounds
GROUP BY stage;

-- Step 2: Drill into specific stage
SELECT * FROM funding_rounds
WHERE stage = 'Series A'
ORDER BY amount_usd DESC
LIMIT 50;
```

### Check Row Counts First

```sql
-- Know what you're working with
SELECT
  (SELECT COUNT(*) FROM startups) as startup_count,
  (SELECT COUNT(*) FROM funding_rounds) as round_count,
  (SELECT COUNT(*) FROM investors) as investor_count;
```
