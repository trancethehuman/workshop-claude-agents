---
name: database-profiler
description: >
  Profiles SQLite databases and CSV files by discovering schemas, measuring data
  quality, and computing column-level statistics. Triggered when the user asks to
  profile a database, inspect a table, check data quality, describe a schema, or
  audit a dataset. Produces a structured profile report saved to the output/
  directory.
---

# Database Profiler

Automated profiling skill for SQLite databases and CSV files. Run this first on any new data source to understand its shape, quality, and key characteristics before deeper analysis.

## Profiling Steps

When asked to profile a data source, execute these steps in order:

### Step 1: Schema Discovery

For SQLite databases:

```bash
# List all tables and views
sqlite3 {db_path} ".tables"

# Get column details for each table
sqlite3 {db_path} "PRAGMA table_info({table_name});"

# Get row count per table
sqlite3 -header -column {db_path} "SELECT '{table_name}' as tbl, COUNT(*) as rows FROM {table_name};"
```

For CSV files:

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('{csv_path}')
print(f'Shape: {df.shape[0]} rows x {df.shape[1]} columns')
print()
print(df.dtypes)
"
```

### Step 2: Data Quality Check

For SQLite — check nulls, duplicates, and value ranges per table:

```bash
sqlite3 -header -column {db_path} <<'SQL'
SELECT
  COUNT(*) as total_rows,
  COUNT({col}) as non_null,
  COUNT(*) - COUNT({col}) as nulls,
  ROUND((COUNT(*) - COUNT({col})) * 100.0 / COUNT(*), 1) as null_pct
FROM {table_name};
SQL
```

For CSV — profile all columns at once:

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('{csv_path}')
profile = pd.DataFrame({
    'dtype': df.dtypes,
    'non_null': df.count(),
    'nulls': df.isna().sum(),
    'null_pct': (df.isna().sum() / len(df) * 100).round(1),
    'unique': df.nunique(),
    'duplicates': len(df) - df.nunique()
})
print(profile)
"
```

### Step 3: Column Statistics

For numeric columns — min, max, mean, median, stddev:

```bash
# SQLite
sqlite3 -header -column {db_path} <<'SQL'
SELECT
  MIN({col}) as min_val,
  MAX({col}) as max_val,
  ROUND(AVG({col}), 2) as mean_val,
  COUNT(*) as count
FROM {table_name}
WHERE {col} IS NOT NULL;
SQL
```

```bash
# CSV — full describe
python3 -c "
import pandas as pd
df = pd.read_csv('{csv_path}')
print(df.describe(include='all').round(2).to_string())
"
```

For categorical columns — value distribution:

```bash
# SQLite
sqlite3 -header -column {db_path} <<'SQL'
SELECT {col}, COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM {table_name}), 1) as pct
FROM {table_name}
GROUP BY {col}
ORDER BY count DESC
LIMIT 20;
SQL
```

```bash
# CSV
python3 -c "
import pandas as pd
df = pd.read_csv('{csv_path}')
for col in df.select_dtypes(include='object').columns:
    print(f'\n--- {col} ---')
    vc = df[col].value_counts()
    pct = (vc / len(df) * 100).round(1)
    print(pd.DataFrame({'count': vc, 'pct': pct}).head(15))
"
```

### Step 4: Relationship Detection (SQLite only)

Check foreign key relationships and join integrity:

```bash
sqlite3 {db_path} "PRAGMA foreign_key_list({table_name});"
```

When no explicit foreign keys exist, detect relationships by matching `*_id` columns:

```bash
sqlite3 -header -column {db_path} <<'SQL'
-- Check referential integrity
SELECT
  COUNT(*) as total_refs,
  SUM(CASE WHEN parent.id IS NULL THEN 1 ELSE 0 END) as orphans
FROM {child_table} c
LEFT JOIN {parent_table} parent ON c.{fk_col} = parent.id;
SQL
```

### Step 5: Date Range & Freshness (if date columns exist)

```bash
sqlite3 -header -column {db_path} <<'SQL'
SELECT
  MIN({date_col}) as earliest,
  MAX({date_col}) as latest,
  COUNT(DISTINCT {date_col}) as distinct_dates
FROM {table_name};
SQL
```

## Workshop Data Sources

This skill works with all structured data in the workshop:

| Source | Type | Tables/Columns | Rows |
|--------|------|---------------|------|
| `data/startup-funding.db` | SQLite | 4 tables + 2 views | ~1,500 |
| `data/sample-sales.db` | SQLite | 3 tables | ~675 |
| `data/customer-metrics.csv` | CSV | 16 columns | 682 |

For full schema details, see `.claude/skills/workshop-data-analyst/references/data-catalog.md`.

## Output Format

Present the profile as a structured report:

```markdown
# Database Profile: {source_name}
**Profiled:** {date}
**Path:** {file_path}

## Overview
| Metric | Value |
|--------|-------|
| Tables | {n} |
| Total rows | {n} |
| Date range | {start} to {end} |

## Table Profiles

### {table_name} ({n} rows, {n} columns)

| Column | Type | Non-Null | Null % | Unique | Min | Max | Top Values |
|--------|------|---------|--------|--------|-----|-----|-----------|
| ... | ... | ... | ... | ... | ... | ... | ... |

## Data Quality Summary

| Issue | Table | Column | Details |
|-------|-------|--------|---------|
| High nulls | ... | ... | {n}% null |
| Low cardinality | ... | ... | Only {n} distinct values |
| Possible duplicates | ... | ... | {n} duplicate rows |
| Orphan references | ... | ... | {n} orphan records |

## Recommendations
- [Any data quality issues to address before analysis]
```

## Saving Profiles

Save output to `output/` directory:

- **Naming:** `output/{source-name}-profile-{YYYY-MM-DD}.md`
- **Examples:** `output/startup-funding-profile-2025-01-15.md`, `output/customer-metrics-profile-2025-01-15.md`
