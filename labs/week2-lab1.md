# Week 2 Lab 1: Exploring the Startup Funding Database

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes  
**Focus:** Schema discovery, SQL queries, and trend analysis with Claude's tool calling

---

## Lab Architecture

This lab demonstrates Claude's tool calling loop with database queries.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Tool Calling Loop                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│     ┌──────────┐     ┌──────────────┐     ┌──────────────┐             │
│     │  THINK   │────▶│ SELECT TOOL  │────▶│   EXECUTE    │             │
│     └──────────┘     └──────────────┘     └──────────────┘             │
│           ▲                                      │                      │
│           │                                      ▼                      │
│           │                              ┌──────────────┐               │
│           └──────────────────────────────│   OBSERVE    │               │
│                     (repeat)             └──────────────┘               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                       Data Source                               │   │
│   │        startup-funding.db (200 startups, 480 rounds)           │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** Mastery of natural language to SQL queries using Claude's Bash tool.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Week 1 complete** - Claude Code installed and authenticated
- [ ] **Workshop repo cloned** - Access to `data/startup-funding.db`
- [ ] **Claude Code running** - Start with `claude` in the repo directory

**Familiarity helpful but not required:**
- Basic SQL (SELECT, WHERE, GROUP BY)
- Understanding of startup funding stages (Seed, Series A, B, C)

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Understand the startup funding database schema
2. Translate business questions into SQL queries
3. Analyze funding trends over time
4. Identify top investors and their patterns
5. Make data-backed predictions about companies

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Schema Discovery | 5 min |
| 1.2 | Basic Aggregations | 10 min |
| 1.3 | Trend Analysis | 15 min |
| 1.4 | Investor Analysis | 10 min |
| 1.5 | Analytical Question | 5 min |
| | **TOTAL** | **45 min** |

---

## About the Dataset

The workshop includes `data/startup-funding.db`, a SQLite database with:
- **200 startups** across AI/ML, Fintech, Healthcare, Developer Tools, and more
- **66 investors** including Y Combinator, Sequoia, a16z
- **~480 funding rounds** from Pre-Seed through Series C (2018-2025)
- **Growth metrics** for ~50 startups

---

## Task 1.1: Schema Discovery (5 min)

Start by understanding what data is available.

1. **Ask Claude to explore the database structure:**
   ```
   > What tables are in the startup-funding.db database? Show me the schema for each.
   ```

2. **Expected behavior:**
   - Claude uses **Bash** with sqlite3
   - Runs `.tables` and `.schema` commands
   - Lists all tables and their columns

3. **Record what you find:**

| Table | Key Columns | Row Count |
|-------|-------------|-----------|
| startups | | |
| funding_rounds | | |
| investors | | |

---

## Task 1.2: Basic Aggregations (10 min)

Practice translating business questions into SQL queries.

1. **Ask Claude to answer these questions:**
   ```
   > From startup-funding.db, answer these questions:
   > 1. How many funding rounds happened each year? Break down by stage.
   > 2. What's the total funding amount by industry?
   > 3. Which stage has the highest average deal size?
   ```

2. **Watch how Claude:**
   - Thinks about which query to write
   - Uses GROUP BY and aggregation functions
   - Formats output for readability

3. **Example SQL patterns Claude might use:**
   ```sql
   -- Rounds by year and stage
   SELECT strftime('%Y', funding_date) as year, stage, COUNT(*)
   FROM funding_rounds
   GROUP BY year, stage
   ORDER BY year, stage;

   -- Total funding by industry
   SELECT s.industry, printf('$%.1fM', SUM(fr.amount_usd)/1000000.0)
   FROM funding_rounds fr
   JOIN startups s ON fr.startup_id = s.id
   GROUP BY s.industry
   ORDER BY SUM(fr.amount_usd) DESC;
   ```

4. **Record your findings:**

| Question | Key Finding |
|----------|-------------|
| Rounds by year/stage | |
| Total by industry | |
| Highest avg deal size | |

---

## Task 1.3: Trend Analysis (15 min)

Dive deeper with time-series analysis.

1. **Run this analysis prompt:**
   ```
   > Analyze monthly funding trends for AI/ML companies from 2023 onwards.
   > Show me:
   > - Deal count per month
   > - Total funding per month
   > - Average deal size per month
   > Format as a table sorted by month.
   ```

2. **The SQL pattern for this:**
   ```sql
   SELECT
     strftime('%Y-%m', funding_date) as month,
     COUNT(*) as deal_count,
     printf('$%.1fM', SUM(amount_usd)/1000000.0) as total_funding,
     printf('$%.1fM', AVG(amount_usd)/1000000.0) as avg_deal_size
   FROM funding_rounds fr
   JOIN startups s ON fr.startup_id = s.id
   WHERE s.industry = 'AI/ML'
     AND funding_date >= '2023-01-01'
   GROUP BY month
   ORDER BY month DESC;
   ```

3. **Analysis questions to consider:**
   - Is funding increasing or decreasing over time?
   - Are deal sizes getting larger or smaller?
   - Are there seasonal patterns?

---

## Task 1.4: Investor Analysis (10 min)

Understand who the key players are.

1. **Ask Claude:**
   ```
   > Who are the top 15 investors by portfolio size?
   > For each, show:
   > - Number of portfolio companies
   > - Total investments (count of rounds)
   > - Follow-on rate (avg rounds per company)
   > Only include investors with at least 3 portfolio companies.
   ```

2. **The SQL pattern:**
   ```sql
   SELECT
     i.name as investor,
     i.type,
     COUNT(DISTINCT fr.startup_id) as portfolio_companies,
     COUNT(*) as total_investments,
     ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT fr.startup_id), 2) as follow_on_rate
   FROM investors i
   JOIN funding_rounds fr ON fr.lead_investor_id = i.id
   GROUP BY i.id
   HAVING portfolio_companies >= 3
   ORDER BY portfolio_companies DESC
   LIMIT 15;
   ```

3. **Key insight:** Follow-on rate indicates investor conviction. Higher = more committed to portfolio companies.

---

## Task 1.5: Analytical Question (5 min)

Apply the full Data Analysis Loop.

1. **Ask Claude this prediction question:**
   ```
   > Which AI coding tools raised Series A in 2024-2025?
   > Rank them by likelihood of getting Series B based on:
   > - Funding amount vs. industry median
   > - Time since founding to Series A
   > - Investor track record (has the lead investor backed other Series B+ companies?)
   > Give me your prediction with supporting evidence.
   ```

2. **This combines all four phases:**
   - **Monitor:** Query current state of AI coding tool funding
   - **Explore:** Dig into factors that predict Series B success
   - **Craft:** Build a thesis with supporting data
   - **Impact:** Make a concrete prediction

3. **Record Claude's prediction:**

| Company | Series A Amount | Lead Investor | Prediction | Confidence |
|---------|-----------------|---------------|------------|------------|
| | | | | |

---

## Troubleshooting

### SQL Query Issues

| Problem | Solution |
|---------|----------|
| Syntax error | Check quote escaping, SQLite uses single quotes for strings |
| No results | Verify table and column names match schema |
| Date filtering issues | Use format `'YYYY-MM-DD'` for dates |
| NULL handling | Use `COALESCE(column, 0)` or `IFNULL(column, 0)` |

### Common SQL Patterns

```sql
-- Format currency
printf('$%.1fM', amount/1000000.0)

-- Extract year from date
strftime('%Y', funding_date)

-- Count distinct
COUNT(DISTINCT startup_id)

-- Conditional aggregation
SUM(CASE WHEN stage = 'Series A' THEN 1 ELSE 0 END)

-- Window function for ranking
RANK() OVER (PARTITION BY industry ORDER BY amount DESC)
```

---

## Final Checklist

Before proceeding to Lab 2, verify:

- [ ] **Schema explored** - Know the tables and relationships in startup-funding.db
- [ ] **Basic queries run** - Aggregations by year, industry, stage
- [ ] **Trend analysis complete** - Monthly funding patterns analyzed
- [ ] **Investor analysis done** - Top investors identified with follow-on rates
- [ ] **Prediction made** - Ranked AI coding tools by Series B likelihood

**Record your key findings:**

| Metric | Your Finding |
|--------|--------------|
| Most active funding year | |
| Top industry by total funding | |
| Top investor by portfolio size | |
| AI coding tool most likely to raise Series B | |

---

**End of Lab 1**
