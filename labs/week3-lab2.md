# Week 3 Lab 2: Combined Multi-Source Workflow

**Course:** Claude Agents Workshop  
**Duration:** 30 minutes  
**Focus:** Combining the startup funding database with external MCP services

---

## Lab Architecture

This lab combines multiple data sources for comprehensive analysis.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Multi-Source Analysis                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│   │  Local DB    │     │  MCP Server  │     │  Web Search  │            │
│   │ (funding.db) │     │ (GitHub/etc) │     │  (WebFetch)  │            │
│   └──────┬───────┘     └──────┬───────┘     └──────┬───────┘            │
│          │                    │                    │                    │
│          └────────────────────┼────────────────────┘                    │
│                               │                                         │
│                               ▼                                         │
│                    ┌──────────────────┐                                 │
│                    │   Claude Code    │                                 │
│                    │   (Synthesis)    │                                 │
│                    └──────────────────┘                                 │
│                               │                                         │
│                               ▼                                         │
│                    ┌──────────────────┐                                 │
│                    │   Combined       │                                 │
│                    │   Analysis       │                                 │
│                    └──────────────────┘                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A multi-source research workflow that combines structured data with external context.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 1 complete** - At least 1 MCP server connected
- [ ] **Access to startup-funding.db** - Local database available
- [ ] **MCP connection verified** - `/mcp` shows connected servers

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Combine database queries with web research
2. Enrich funding data with GitHub insights (if connected)
3. Apply the Data Analysis Loop with multiple sources
4. Create a comparison table from multiple data sources

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 2.1 | Funding + Web Research | 10 min |
| 2.2 | Funding + GitHub (optional) | 10 min |
| 2.3 | Data-Driven Research | 10 min |
| | **TOTAL** | **30 min** |

---

## Task 2.1: Funding + Web Research (10 min)

Using both the local database and web search:

1. **Run this combined analysis:**
   ```
   > Find AI coding tool companies in the funding database.
   > Then research each company's current product and recent news.
   > Create a comparison table with: Company, Total Funding, Latest Stage, Product Focus, Recent News
   ```

2. **Observe how Claude:**
   - Queries the local SQLite database
   - Uses WebSearch for each company
   - Synthesizes information from multiple sources

3. **Record your comparison table:**

| Company | Total Funding | Latest Stage | Product Focus | Recent News |
|---------|---------------|--------------|---------------|-------------|
| | | | | |
| | | | | |
| | | | | |

---

## Task 2.2: Funding + GitHub (if connected) (10 min)

If you connected GitHub MCP in Lab 1:

1. **Run this analysis:**
   ```
   > Which AI coding tools in our database have public GitHub repos?
   > Compare their GitHub stars to their funding amounts.
   > Is there a correlation between community popularity and funding?
   ```

2. **Record findings:**

| Company | GitHub Stars | Total Funding | Ratio |
|---------|--------------|---------------|-------|
| | | | |
| | | | |

**If you didn't connect GitHub:** Skip to Task 2.3, or use web search to find GitHub stats manually.

---

## Task 2.3: Data-Driven Research (10 min)

Apply the full Data Analysis Loop with multiple sources:

1. **Run this comprehensive analysis:**
   ```
   > I want to understand the Series A landscape for AI startups.
   > 1. Query the database for all AI/ML Series A rounds in 2024
   > 2. Calculate the median round size and time from founding to Series A
   > 3. Research 2-3 of these companies online to understand what made them fundable
   > 4. Summarize patterns you see
   ```

2. **Record the patterns:**

| Pattern | Evidence | Source |
|---------|----------|--------|
| | | Database |
| | | Web research |
| | | |

---

## Troubleshooting

### Multi-Source Query Issues

| Problem | Solution |
|---------|----------|
| Queries take too long | Break into smaller steps, query one source at a time |
| MCP disconnected mid-query | Reconnect with `claude mcp add`, then retry |
| Web search returns old info | Add year to search query (e.g., "Cursor funding 2024") |

### Data Synthesis Issues

| Problem | Solution |
|---------|----------|
| Conflicting information | Note the source, ask Claude to reconcile |
| Missing data | Try alternative sources or note as "N/A" |
| Too much data | Use LIMIT, focus on top results |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Combined multiple sources** - Used database + web or database + MCP
- [ ] **Created comparison table** - Multi-source data synthesized
- [ ] **Documented findings** - Recorded patterns with evidence
- [ ] **Applied Data Analysis Loop** - Monitor, Explore, Craft, Impact

**Record your key insight:**

What's the most interesting finding from combining multiple data sources?

```
_______________________________________________________________

_______________________________________________________________
```

---

## Reference: Context Management for Data

When working with databases or large datasets through MCP:

### Query Strategically

1. **Always use LIMIT for exploration:**
   ```sql
   SELECT * FROM funding_rounds LIMIT 100;
   ```

2. **Aggregate first, then drill down:**
   ```sql
   -- Start with aggregates
   SELECT industry, COUNT(*) FROM startups GROUP BY industry;

   -- Then drill into specifics
   SELECT * FROM startups WHERE industry = 'AI/ML' LIMIT 50;
   ```

3. **Be specific about what you need:**
   ```sql
   -- Bad: grab everything
   SELECT * FROM funding_rounds;

   -- Good: specific columns, filtered, limited
   SELECT name, stage, amount_usd
   FROM funding_rounds fr
   JOIN startups s ON fr.startup_id = s.id
   WHERE fr.stage = 'Series A'
   ORDER BY fr.amount_usd DESC
   LIMIT 20;
   ```

### Context Management by Phase

| Phase | Strategy |
|-------|----------|
| **Monitor** | Run aggregation queries first (safe, bounded) |
| **Explore** | Drill down with LIMIT, explore segments one at a time |
| **Craft** | Work with summarized insights, not raw data |
| **Impact** | Present recommendations, not data dumps |

---

**End of Lab 2**
