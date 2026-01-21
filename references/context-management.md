# Context Management for Data Analysis

When working with databases and large datasets, context management is critical. A single careless query can fill your entire context window, causing Claude to lose track of the conversation and waste tokens on data that doesn't fit.

---

## The Core Problem

**Files vs Databases:**

| Operation | Context Impact |
|-----------|----------------|
| Reading a 500-line file | Predictable, bounded |
| `SELECT * FROM users` | Could return 2 million rows |

Without careful management, one bad query can:
- Fill your entire context window
- Cause Claude to lose conversation history
- Waste tokens on truncated data
- Make follow-up analysis impossible

---

## The Four Rules

### 1. Always Use LIMIT

Default to LIMIT 100 for any exploration query:

```sql
-- Bad: unbounded query
SELECT * FROM funding_rounds;

-- Good: bounded exploration
SELECT * FROM funding_rounds
ORDER BY funding_date DESC
LIMIT 100;
```

### 2. Aggregate First, Then Drill Down

Start with GROUP BY queries to understand the data shape:

```sql
-- Step 1: Understand the distribution
SELECT stage, COUNT(*) as count
FROM funding_rounds
GROUP BY stage
ORDER BY count DESC;

-- Step 2: Drill into the interesting segment
SELECT * FROM funding_rounds
WHERE stage = 'Series A'
ORDER BY amount_usd DESC
LIMIT 50;
```

### 3. Be Specific About Columns

Only select the columns you need:

```sql
-- Bad: grab everything
SELECT * FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id;

-- Good: specific columns
SELECT
  s.name,
  fr.stage,
  fr.amount_usd,
  fr.funding_date
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
WHERE fr.stage = 'Series A'
ORDER BY fr.amount_usd DESC
LIMIT 20;
```

### 4. Track What You've Seen

Keep mental notes of:
- Total row counts in each table
- What subset you've explored
- What's left to investigate

---

## Safe Query Patterns

### Metadata Queries (Always Safe)

```sql
-- Row counts
SELECT COUNT(*) FROM funding_rounds;

-- Table structure
PRAGMA table_info(funding_rounds);

-- Distinct values in a column
SELECT DISTINCT stage FROM funding_rounds;

-- Value distribution
SELECT stage, COUNT(*) as count
FROM funding_rounds
GROUP BY stage;
```

### Bounded Exploration (Safe with LIMIT)

```sql
-- Top N by metric
SELECT * FROM funding_rounds
ORDER BY amount_usd DESC
LIMIT 10;

-- Recent records
SELECT * FROM funding_rounds
ORDER BY funding_date DESC
LIMIT 50;

-- Filtered subset
SELECT * FROM funding_rounds
WHERE stage = 'Series A'
AND funding_date >= '2024-01-01'
LIMIT 100;
```

### Dangerous Queries (Avoid)

```sql
-- Unbounded SELECT *
SELECT * FROM funding_rounds;  -- DON'T DO THIS

-- Large JOINs without LIMIT
SELECT *
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
JOIN investors i ON fr.lead_investor_id = i.id;  -- DON'T DO THIS

-- Cross joins or cartesian products
SELECT * FROM startups, investors;  -- NEVER DO THIS
```

---

## The Data Analysis Loop

Context management fits into each phase of analysis:

| Phase | Context Strategy |
|-------|-----------------|
| **Monitor** | Run aggregation queries (safe, bounded) |
| **Explore** | Drill down with LIMIT, one segment at a time |
| **Craft** | Work with summarized insights, not raw data |
| **Impact** | Present recommendations, not data dumps |

### Example Workflow

```sql
-- MONITOR: Check key metrics
SELECT
  strftime('%Y-%m', funding_date) as month,
  COUNT(*) as deals,
  SUM(amount_usd) / 1000000 as total_millions
FROM funding_rounds
WHERE funding_date >= date('now', '-6 months')
GROUP BY month
ORDER BY month;

-- EXPLORE: Investigate anomaly (March dip)
SELECT s.industry, COUNT(*) as deals
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
WHERE strftime('%Y-%m', fr.funding_date) = '2024-03'
GROUP BY s.industry
ORDER BY deals DESC;

-- CRAFT: Summarize findings
-- "March 2024 saw 40% fewer deals, concentrated in AI/ML sector,
--  likely due to market correction after February hype cycle."

-- IMPACT: Recommend action
-- "Consider diversifying pipeline beyond AI/ML for Q2."
```

---

## Token Budget Guidelines

Rough estimates for context usage:

| Query Result | Approximate Tokens |
|--------------|-------------------|
| 10 rows, 5 columns | ~200 tokens |
| 100 rows, 5 columns | ~2,000 tokens |
| 1,000 rows, 5 columns | ~20,000 tokens |

**Rule of thumb:** Keep individual query results under 2,000 tokens to leave room for conversation history and analysis.

---

## When Things Go Wrong

If context gets flooded:

1. **Stop** - Don't run more queries
2. **Summarize** - Ask Claude to summarize what it learned
3. **Reset** - Start a new conversation if needed
4. **Plan** - Write down what you want to explore next

---

## Skill Integration

When creating data analysis skills, include context management rules:

```markdown
## Context Management Rules (Critical)

1. **Always use LIMIT** - Default to 100 rows for exploration
2. **Track truncation** - Note when results are limited
3. **Aggregate first** - Start with GROUP BY, then drill down
4. **One question at a time** - Don't try to answer everything in one query
```

This ensures Claude follows safe patterns even when users don't explicitly ask for limits.
