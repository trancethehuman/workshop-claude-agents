# Week 2 Lab 2: Building a Research Workflow

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes  
**Focus:** Combining database queries with web research for investment analysis

---

## Lab Architecture

This lab combines structured database queries with web research tools.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Research Workflow                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                       Available Tools                          │    │
│   ├────────────────────────────────────────────────────────────────┤    │
│   │  Bash (sqlite3)  │  WebSearch  │  WebFetch  │  Read  │  Write  │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                         Data Sources                           │    │
│   ├────────────────────────────────────────────────────────────────┤    │
│   │     startup-funding.db      │        Web (news, sites)         │    │
│   │   (200 startups, 480 rounds) │   (company info, market data)   │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │                    Data Analysis Loop                          │    │
│   │        MONITOR → EXPLORE → CRAFT STORY → IMPACT                │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** An investment analysis brief that combines structured data with web research.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 1 complete** - Database exploration done
- [ ] **Know the schema** - Familiar with startups, funding_rounds, investors tables
- [ ] **Claude Code running** - Start with `claude` in the repo directory

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Query database for AI coding tool startups
2. Use WebSearch and WebFetch to enrich company data
3. Apply the Data Analysis Loop (Monitor, Explore, Craft, Impact)
4. Create an investment analysis brief combining multiple sources
5. Compare sector performance to broader market

---

## Time Breakdown

| Task | Topic                     | Time       |
| ---- | ------------------------- | ---------- |
| 2.1  | Database Foundation       | 10 min     |
| 2.2  | Web Enrichment            | 15 min     |
| 2.3  | Synthesize Analysis       | 15 min     |
| 2.4  | Connect to Broader Market | 5 min      |
|      | **TOTAL**                 | **45 min** |

---

## Scenario

You're analyzing AI coding tools for an investment memo. You'll combine database queries with web research to create a comprehensive analysis.

---

## Task 2.1: Database Foundation (10 min)

Start with structured data.

1. **Query the database for AI coding startups:**

   ```
   > From startup-funding.db, find all AI/ML startups in the Developer Tools or IDEs sub-industry.
   > Show me their funding history, investors, and latest valuation.
   > Focus on companies that have raised Series A or later.
   ```

2. **Record the companies found:**

| Company | Stage | Total Raised | Lead Investor |
| ------- | ----- | ------------ | ------------- |
|         |       |              |               |
|         |       |              |               |
|         |       |              |               |

---

## Task 2.2: Web Enrichment (15 min)

Add context from the web.

1. **Research 3 companies from your results:**

   ```
   > For Cursor, Replit, and Codeium:
   > 1. Search for their latest funding news
   > 2. Find their current employee count (if available)
   > 3. Look for any product announcements in the last 6 months
   > Compile findings into a comparison table.
   ```

2. **Watch how Claude:**
   - Uses **WebSearch** to find relevant articles
   - Uses **WebFetch** to get detailed content
   - Synthesizes information from multiple sources

3. **Record your comparison:**

| Company | Latest News | Employees | Recent Product |
| ------- | ----------- | --------- | -------------- |
| Cursor  |             |           |                |
| Replit  |             |           |                |
| Codeium |             |           |                |

---

## Task 2.3: Synthesize Analysis (15 min)

Apply the Data Analysis Loop to create a brief.

1. **Ask Claude to create an investment brief:**

   ```
   > Based on the database data and web research, create an investment brief:
   >
   > **Monitor:** Current state of AI coding tool funding
   > **Explore:** Key differentiators between top players
   > **Craft:** 3-5 key insights with supporting evidence
   > **Impact:** Which company is best positioned for Series B/C success and why?
   >
   > Save the brief to output/ai-coding-tools-analysis.md
   ```

2. **Verify the output:**
   - Check that the file was created
   - Review the structure follows the Data Analysis Loop
   - Confirm insights are supported by data

---

## Task 2.4: Connect to Broader Market (5 min)

Put findings in context.

1. **Ask Claude to compare:**

   ```
   > Compare the AI coding tools funding to the broader Developer Tools category.
   > - How does their average deal size compare?
   > - Are they raising at higher or lower valuations?
   > - What does this suggest about market sentiment?
   ```

2. **Key insight questions:**
   - Is AI coding a hot subsector or cooling off?
   - How do investor patterns differ from the broader category?

---

## Troubleshooting

### Web Tool Issues

| Problem                      | Solution                                               |
| ---------------------------- | ------------------------------------------------------ |
| WebSearch returns no results | Try different search terms, be more specific           |
| WebFetch fails               | Site may block bots, try a different source            |
| Outdated information         | Add year to search query (e.g., "Cursor funding 2024") |
| Rate limiting                | Wait a moment between web requests                     |

### File Output Issues

| Problem            | Solution                             |
| ------------------ | ------------------------------------ |
| File not created   | Check the output/ directory exists   |
| Permission denied  | Verify write access to the directory |
| Content incomplete | Ask Claude to continue or regenerate |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Database query complete** - AI coding startups identified with funding history
- [ ] **Web research complete** - 3 companies enriched with web data
- [ ] **Analysis brief created** - File saved to output/ai-coding-tools-analysis.md
- [ ] **Data Analysis Loop applied** - Monitor, Explore, Craft, Impact sections present
- [ ] **Market context added** - Compared to broader Developer Tools category

---

## Reference: Data Analysis Loop

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   MONITOR → EXPLORE → CRAFT STORY → IMPACT                  │
│      ↑                                  │                   │
│      └──────────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Phase       | What To Do                            | Example                                     |
| ----------- | ------------------------------------- | ------------------------------------------- |
| **Monitor** | Run recurring queries, check metrics  | "Deal count by month for AI/ML"             |
| **Explore** | Dig into anomalies, segment data      | "Why did Q3 spike? Check by sub-industry"   |
| **Craft**   | Synthesize 3-5 insights with evidence | "Series A sizes growing 20% YoY because..." |
| **Impact**  | Recommend actions, size opportunities | "Invest in X because of factors A, B, C"    |

---

**End of Lab 2**
