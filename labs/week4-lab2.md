# Week 4 Lab 2: Build a Data Analysis Skill

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes  
**Focus:** Creating an advanced skill with reference files, tool restrictions, and methodology encoding

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This lab builds on Lab 1 to create a more sophisticated skill with reference files for progressive disclosure.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Advanced Skill Architecture                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    ┌─────────────────────┐                              │
│                    │  .claude/skills/    │                              │
│                    │  └── data-analyst/  │                              │
│                    │      ├── SKILL.md   │ ← Main instructions          │
│                    │      └── references/│                              │
│                    │          └── sql-   │ ← Loaded on-demand           │
│                    │             patterns│                              │
│                    │             .md     │                              │
│                    └─────────────────────┘                              │
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                    Data Analysis Loop                          │    │
│   │        MONITOR → EXPLORE → CRAFT STORY → IMPACT                │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A Data Analyst skill with methodology, SQL patterns reference, and tool restrictions.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 1 complete** - Database Profiler skill created and working
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **Understanding of SKILL.md structure** - Familiar with YAML frontmatter
- [ ] **Text editor ready** - For creating skill files

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Create a skill with a references/ directory
2. Encode the Data Analysis Loop as methodology
3. Use reference files for progressive disclosure
4. Apply tool restrictions for focused skills
5. Test complex analytical queries

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 2.1 | Create Skill with References | 10 min |
| 2.2 | Create SQL Patterns Reference | 15 min |
| 2.3 | Test the Data Analyst Skill | 15 min |
| 2.4 | Understand Tool Restrictions | 5 min |
| | **TOTAL** | **45 min** |

---

## Task 2.1: Create Skill with References (10 min)

For complex skills, use a `references/` directory for detailed documentation that loads on-demand.

1. **Create the skill structure:**
   ```bash
   mkdir -p .claude/skills/data-analyst/references
   ```

2. **Create `.claude/skills/data-analyst/SKILL.md`:**

   ```markdown
   ---
   name: data-analyst
   description: Systematic data analysis using the Data Analysis Loop (Monitor → Explore → Craft → Impact). Use when profiling datasets, investigating anomalies, finding trends, or building analytical reports from databases.
   allowed-tools: Read, Grep, Bash(sqlite3:*), WebSearch, WebFetch
   ---

   # Data Analyst

   You are a data analyst. Follow the Data Analysis Loop and context management rules below.

   ## The Data Analysis Loop

   Every analysis follows four phases:

   ### 1. Monitor
   - Run aggregation queries to check key metrics
   - Compare current values to historical baselines
   - Flag anomalies (significant deviations from average)

   ### 2. Explore
   - When you spot something interesting, dig deeper
   - Segment the data: by time, category, cohort
   - Look for external context: what else was happening?

   ### 3. Craft Story
   - Synthesize findings into 3-5 key insights
   - Support each insight with specific data
   - Note confidence level and caveats

   ### 4. Impact
   - Recommend concrete next actions
   - Size the opportunity if possible
   - Identify what additional data would help

   ## Context Management Rules (Critical)

   1. **Always use LIMIT** - Default to 100 rows for exploration
   2. **Track truncation** - Note when results are limited
   3. **Aggregate first** - Start with GROUP BY, then drill down
   4. **One question at a time** - Don't try to answer everything in one query

   ## SQL Patterns

   For common analysis patterns, see [sql-patterns.md](references/sql-patterns.md).

   ## Output Format

   Structure every analysis as:

   **Summary:** 2-3 sentences

   **Key Findings:**
   - Finding 1 (metric: X, change: Y%)
   - Finding 2 (metric: X, change: Y%)
   - Finding 3 (metric: X, change: Y%)

   **Context:** External factors that might explain trends

   **Recommendation:** Next action to take

   **Confidence:** High/Medium/Low with reasoning
   ```

3. **Note the new elements:**

   | Element | Purpose |
   |---------|---------|
   | `allowed-tools` | Restricts Claude to specific tools |
   | `[sql-patterns.md](references/...)` | Links to reference file (loaded on-demand) |
   | Data Analysis Loop | Encodes methodology, not just tools |

---

## Task 2.2: Create the SQL Patterns Reference (15 min)

1. **Create `.claude/skills/data-analyst/references/sql-patterns.md`:**

   ```markdown
   # SQL Patterns for Data Analysis

   ## Time-Series Aggregation

   ```sql
   SELECT
     strftime('%Y-%m', date_column) as month,
     COUNT(*) as count,
     SUM(amount) as total,
     AVG(amount) as average
   FROM table
   WHERE date_column >= date('now', '-12 months')
   GROUP BY month
   ORDER BY month DESC;
   ```

   ## Window Functions for Rankings

   ```sql
   -- Rank within categories
   SELECT
     category,
     item,
     value,
     RANK() OVER (PARTITION BY category ORDER BY value DESC) as rank
   FROM table;

   -- Running totals
   SELECT
     date,
     amount,
     SUM(amount) OVER (ORDER BY date) as running_total
   FROM table;

   -- Compare to previous period
   SELECT
     month,
     revenue,
     LAG(revenue) OVER (ORDER BY month) as prev_month,
     revenue - LAG(revenue) OVER (ORDER BY month) as change
   FROM monthly_revenue;
   ```

   ## Cohort Analysis

   ```sql
   WITH cohorts AS (
     SELECT
       startup_id,
       MIN(funding_date) as first_funding_date
     FROM funding_rounds
     GROUP BY startup_id
   )
   SELECT
     strftime('%Y', c.first_funding_date) as cohort_year,
     COUNT(DISTINCT c.startup_id) as cohort_size,
     COUNT(DISTINCT CASE
       WHEN fr.stage = 'Series A' THEN c.startup_id
     END) as reached_series_a
   FROM cohorts c
   LEFT JOIN funding_rounds fr ON c.startup_id = fr.startup_id
   GROUP BY cohort_year
   ORDER BY cohort_year;
   ```

   ## Conversion Funnel

   ```sql
   WITH stages AS (
     SELECT
       startup_id,
       MAX(CASE WHEN stage = 'Seed' THEN 1 ELSE 0 END) as has_seed,
       MAX(CASE WHEN stage = 'Series A' THEN 1 ELSE 0 END) as has_series_a,
       MAX(CASE WHEN stage = 'Series B' THEN 1 ELSE 0 END) as has_series_b
     FROM funding_rounds
     GROUP BY startup_id
   )
   SELECT
     SUM(has_seed) as seed_companies,
     SUM(has_series_a) as series_a_companies,
     SUM(has_series_b) as series_b_companies,
     ROUND(SUM(has_series_a) * 100.0 / SUM(has_seed), 1) as seed_to_a_rate,
     ROUND(SUM(has_series_b) * 100.0 / SUM(has_series_a), 1) as a_to_b_rate
   FROM stages;
   ```

   ## Funding Velocity

   ```sql
   -- Days between funding rounds
   WITH round_sequence AS (
     SELECT
       startup_id,
       stage,
       funding_date,
       LAG(funding_date) OVER (PARTITION BY startup_id ORDER BY funding_date) as prev_round_date
     FROM funding_rounds
   )
   SELECT
     s.name,
     rs.stage,
     CAST(JULIANDAY(rs.funding_date) - JULIANDAY(rs.prev_round_date) AS INTEGER) as days_since_last_round
   FROM round_sequence rs
   JOIN startups s ON rs.startup_id = s.id
   WHERE rs.prev_round_date IS NOT NULL
   ORDER BY days_since_last_round ASC
   LIMIT 20;
   ```
   ```

2. **Verify the file structure:**
   ```bash
   ls -la .claude/skills/data-analyst/
   ls -la .claude/skills/data-analyst/references/
   ```

---

## Task 2.3: Test the Data Analyst Skill (15 min)

1. **Restart Claude Code:**
   ```bash
   claude
   ```

2. **Test with analytical questions:**

   ```
   > Analyze the AI/ML funding landscape in the database. What trends do you see?
   ```

3. **Verify the output structure:**
   - Includes Summary, Key Findings, Context, Recommendation, Confidence
   - Uses the Data Analysis Loop phases
   - Queries follow context management rules

4. **Test cohort analysis:**
   ```
   > Build a cohort analysis: of companies that raised Seed in 2022, how many reached Series A?
   ```

5. **Test funding velocity:**
   ```
   > Which startups have the fastest funding velocity (shortest time between rounds)?
   ```

6. **Check that references load on-demand:**
   - Claude should use SQL patterns from the reference file
   - You may see Claude read the reference when it needs specific patterns

7. **Record your analysis results:**

| Query | Data Analysis Phase Used | Key Finding |
|-------|--------------------------|-------------|
| AI/ML trends | | |
| Cohort analysis | | |
| Funding velocity | | |

---

## Task 2.4: Understand Tool Restrictions (5 min)

The `allowed-tools` field restricts what Claude can use with this skill.

1. **Review the restriction:**
   ```yaml
   allowed-tools: Read, Grep, Bash(sqlite3:*), WebSearch, WebFetch
   ```

2. **What this means:**
   - `Read` - Can read files
   - `Grep` - Can search file contents
   - `Bash(sqlite3:*)` - Can only run Bash commands starting with `sqlite3`
   - `WebSearch`, `WebFetch` - Can research online

3. **What's excluded:**
   - `Write` - Cannot create or modify files
   - `Edit` - Cannot edit existing files
   - General Bash commands

4. **Why restrict tools?**
   - Focus the skill on analysis, not changes
   - Prevent accidental modifications
   - Create read-only workflows

---

## Troubleshooting

### Reference Files Not Loading

| Problem | Solution |
|---------|----------|
| File not found | Check relative path from SKILL.md |
| Syntax in markdown link | Use `[text](references/file.md)` |
| File not in references/ | Move file to correct location |

### Tool Restrictions Issues

| Problem | Solution |
|---------|----------|
| Tool not allowed error | Check `allowed-tools` list |
| Bash command blocked | Add specific pattern: `Bash(command:*)` |
| Need additional tool | Add to allowed-tools list |

### Output Not Following Structure

| Problem | Solution |
|---------|----------|
| Missing sections | Add clearer section headers in SKILL.md |
| Wrong format | Include explicit examples in the skill |
| Too verbose | Add "Be concise" instruction |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Data Analyst skill created** - Located at `.claude/skills/data-analyst/SKILL.md`
- [ ] **Reference file exists** - SQL patterns at `references/sql-patterns.md`
- [ ] **Tool restrictions work** - Only allowed tools are available
- [ ] **Data Analysis Loop applied** - Output includes all four phases
- [ ] **References load on-demand** - Claude reads sql-patterns.md when needed
- [ ] **Output structure correct** - Summary, Key Findings, Context, Recommendation, Confidence

**Document your skill:**

| Element | Your Implementation |
|---------|---------------------|
| Skill name | |
| Allowed tools | |
| Reference files | |
| Output sections | |

---

## Reference: Description Best Practices

**Bad:**
```yaml
description: Helps with data.
```

**Good:**
```yaml
description: Analyze datasets using the Data Analysis Loop (Monitor → Explore → Craft → Impact). Use when profiling data, investigating anomalies, or building analytical reports.
```

Include:
- What it does (capabilities)
- When to use it (trigger scenarios)
- Keywords users might say

---

## Reference: SKILL.md Structure

```markdown
---
name: skill-name
description: What it does and when to use it. Include trigger keywords.
allowed-tools: Read, Grep, Bash(specific:*)
---

# Skill Title

## Instructions
Step-by-step guidance for Claude.

## Examples
Concrete input/output examples.

## Output Format
Expected structure of results.
```

---

**End of Lab 2**
