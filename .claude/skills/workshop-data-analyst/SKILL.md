---
name: workshop-data-analyst
description: >
  Analyzes the workshop's 5 data sources (startup funding DB, sales DB,
  customer metrics CSV, CRM JSON, deals JSON) using the Data Analysis Loop
  methodology. Triggered when the user asks to analyze data, profile databases,
  investigate trends, identify churn risk, explore funding patterns, or generate
  pipeline intelligence. Produces structured findings and actionable
  recommendations saved to the output/ directory.
---

# Workshop Data Analyst

Systematic data analysis skill for the workshop's 5 data sources using the **Data Analysis Loop** methodology taught throughout this course.

## Data Analysis Loop

Every analysis follows four phases:

### Phase 1: MONITOR — Establish Baseline

- Check row counts and table shapes before querying
- Profile data quality (nulls, outliers, date ranges)
- Confirm available columns and data types
- Set context limits (LIMIT 100 for exploration)

### Phase 2: EXPLORE — Investigate Patterns

- Aggregate first, then drill down into segments
- Compare across dimensions (time, industry, region, stage)
- Use window functions for ranking and period-over-period changes
- Identify outliers and anomalies worth investigating

### Phase 3: CRAFT STORY — Synthesize Findings

- Lead with the most impactful insight
- Support claims with specific numbers
- Compare to baselines or benchmarks when available
- Highlight what's surprising or actionable

### Phase 4: IMPACT — Deliver Recommendations

- Tie each recommendation to a specific finding
- Prioritize by effort vs. impact
- Include concrete next steps
- Save the report for future reference

## Available Data Sources

| Source | Type | Key Contents | Rows | Details |
|--------|------|-------------|------|---------|
| `data/startup-funding.db` | SQLite | Startups, funding rounds, investors, metrics | ~1,500 | 4 tables + 2 views |
| `data/sample-sales.db` | SQLite | Customers, deals, activities | ~675 | 3 tables |
| `data/customer-metrics.csv` | CSV | Monthly SaaS metrics per company | 682 | 16 columns |
| `data/mock-crm.json` | JSON | Contacts, companies, activities | 15 | 3 arrays |
| `data/sample-deals.json` | JSON | Deal pipeline with notes & competitors | 5 | Nested objects |

Full schemas: see `references/data-catalog.md`

## Context Management Rules

These rules prevent overwhelming context with large query results:

1. **Always LIMIT exploration queries** — default to `LIMIT 100`; use `LIMIT 20` for wide tables
2. **Aggregate first** — run `COUNT(*) ... GROUP BY` before selecting individual rows
3. **Check row counts** before any `SELECT *` query
4. **Never SELECT \*** on tables with 100+ rows — always specify columns
5. **Use views when available** — `funding_summary` and `investor_portfolio` are pre-aggregated

## Analysis Patterns by Data Source

### SQLite Databases (`startup-funding.db`, `sample-sales.db`)

Query using Bash with `sqlite3`:

```bash
sqlite3 data/startup-funding.db "SELECT stage, COUNT(*) FROM funding_rounds GROUP BY stage;"
```

For multi-line queries, use heredoc:

```bash
sqlite3 -header -column data/sample-sales.db <<'SQL'
SELECT stage, COUNT(*) as deals, SUM(value) as total_value
FROM deals
GROUP BY stage
ORDER BY total_value DESC;
SQL
```

Reusable patterns: see `references/sql-patterns.md`

### CSV Files (`customer-metrics.csv`)

Analyze using `python3` with pandas:

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
print(df.groupby('segment')['mrr_usd'].agg(['count','mean','sum']).round(0))
"
```

Reusable patterns: see `references/csv-analysis-patterns.md`

### JSON Files (`mock-crm.json`, `sample-deals.json`)

Read directly with the Read tool — both files are small enough to load fully. Parse structure first, then extract specific fields as needed.

## Output Format

### Findings Table

Present discoveries in a structured table:

```markdown
| # | Finding | Evidence | Significance |
|---|---------|----------|-------------|
| 1 | [What you found] | [Specific numbers] | [Why it matters] |
| 2 | ... | ... | ... |
```

### Recommendations Table

Tie actions to findings:

```markdown
| Priority | Recommendation | Based On | Expected Impact |
|----------|---------------|----------|----------------|
| HIGH | [Action] | Finding #N | [Outcome] |
| MEDIUM | [Action] | Finding #N | [Outcome] |
```

Report templates: see `references/analysis-templates.md`

## Saving Reports

Save all analysis output to the `output/` directory:

- **Naming**: `output/{topic}-analysis-{YYYY-MM-DD}.md`
- **Examples**: `output/funding-landscape-2025-01-15.md`, `output/churn-risk-2025-01-15.md`
- **Format**: Markdown with tables, suitable for sharing or presentation
- **Include**: Date, data sources used, methodology notes, findings, and recommendations
