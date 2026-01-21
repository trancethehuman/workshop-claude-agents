---
marp: true
theme: default
paginate: true
---

# Week 2: Tool Calling
## How Claude Takes Action

---

# Session Goals

- Understand how Claude uses tools to interact with the world
- Learn the tool calling loop: think, select, execute, observe
- Practice with built-in tools for data analysis and research

---

# The Key Insight

When you give Claude access to tools, it stops being a chatbot and becomes an agent.

The most important tool is one you might not expect: **bash**

---

# The Tool Calling Loop

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   THINK → SELECT TOOL → EXECUTE → OBSERVE → THINK AGAIN     │
│                                          ↑         │        │
│                                          └─────────┘        │
│                                       (repeat until done)   │
└─────────────────────────────────────────────────────────────┘
```

---

# Why Bash Is the Most Important Tool

**Vercel removed 80% of their agent's tools and got better results**

What replaced all of them? An agent that can execute bash commands and explore files.

LLMs have seen grep, cat, find, and ls **billions of times** during training

---

# How Agents Use Bash

| Command | Agent Use Case |
|---------|----------------|
| `ls` | "What data do I have to work with?" |
| `cat` | "Let me look at this file" |
| `grep` | "Find all mentions of 'Series A'" |
| `sqlite3` | "Run SQL on the funding database" |

---

# On-Demand Context Retrieval

Instead of stuffing everything into the prompt upfront:

```
Agent receives task
    → Explores filesystem (ls, find)
    → Searches for relevant content (grep)
    → Reads specific files (cat)
    → Queries databases (sqlite3)
    → Sends only what's needed to the model
```

This is why cost dropped from $1.00 to $0.25 per analysis

---

# Built-in Tools

| Tool | Business Use Cases |
|------|-------------------|
| **Read** | Analyze data, read reports, review documents |
| **Bash** | Execute scripts, run SQL, process data |
| **Grep** | Find mentions, search across files |
| **WebSearch** | Research companies, find market data |

---

# How Claude Decides Which Tool to Use

| Your Request | Tool Selected |
|--------------|---------------|
| "What's in this database?" | Bash (sqlite3) |
| "Find all AI startups" | Bash (sqlite3) |
| "Research Cursor AI funding" | WebSearch |
| "Create a summary report" | Write |

---

# The Data Analysis Loop

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   MONITOR → EXPLORE → CRAFT STORY → IMPACT                  │
│      ↑                                  │                   │
│      └──────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

1. **Monitor:** Run recurring queries to check key metrics
2. **Explore:** Dig deeper when you spot anomalies
3. **Craft Story:** Synthesize findings into 3-5 key insights
4. **Impact:** Recommend concrete next actions

---

# AI-Assisted SQL and Data Warehouse Querying

| Business Question | Claude Generates |
|-------------------|------------------|
| "Top 10 funded AI startups" | `SELECT` with `JOIN`, `GROUP BY`, `ORDER BY` |
| "Funding velocity by stage" | Window functions with `LAG()` |
| "Series A to B conversion rate" | CTEs with cohort analysis |

---

# About the Workshop Dataset

`data/startup-funding.db` - A SQLite database with:

- **200 startups** across industries
- **66 investors** (Y Combinator, Sequoia, a16z, Accel)
- **~480 funding rounds** from Pre-Seed through Series C
- **Growth metrics** for ~50 startups

Modeled on real VC data from 2018-2025

---

# Intermediate SQL Patterns

**Window functions:**
```sql
RANK() OVER (PARTITION BY industry ORDER BY amount DESC)
```

**CTEs:**
```sql
WITH round_sequence AS (
  SELECT startup_id, LAG(funding_date) ...
)
```

**Cohort analysis:**
```sql
WITH series_a AS (...), series_b AS (...)
SELECT conversion_rate...
```

---

# Bash vs. Other Approaches

| Approach | How It Works | Problem |
|----------|--------------|---------|
| **Prompt stuffing** | Load everything into context | Hits token limits fast |
| **Vector search** | Find semantically similar chunks | Imprecise for structured data |
| **SQL + AI** | Translate questions to queries | ✓ Precise, scalable, production-ready |

---

# Lab 1: Exploring the Startup Funding Database

**Duration:** 45 minutes

**What you'll do:**
- Schema discovery with Claude
- Basic aggregations (GROUP BY, COUNT, SUM)
- Trend analysis with time-series queries
- Investor analysis with JOINs

---

# **BREAK**
## 10 minutes

---

# Web Tools for Research

**WebSearch:** Finding information

```
> Search for recent news about Cursor AI funding
> Find information about the AI coding tools market size 2024
```

**WebFetch:** Getting page content

```
1. WebSearch → find relevant URLs
2. WebFetch → get detailed content from best result
3. Analyze → synthesize findings
```

---

# Combining Data and Web Research

**Example Workflow:**

1. Query database: "Show me AI coding startups that raised Series A in 2024"
2. For top results, WebSearch: "[startup name] latest news"
3. WebFetch: Get detailed info from relevant articles
4. Synthesize: "Cursor raised $60M Series B, growing 3x YoY"

---

# Practical Research Patterns

| Research Goal | Tool Sequence |
|---------------|---------------|
| Validate funding data | Query DB → WebSearch for announcements |
| Company deep dive | Query DB → WebFetch company site → WebSearch news |
| Market sizing | Query DB aggregates → WebSearch industry reports |

---

# Lab 2: Building a Research Workflow

**Duration:** 45 minutes

**What you'll do:**
- Build database foundation for AI coding tools
- Enrich with web research (news, employee counts)
- Apply Data Analysis Loop to synthesize findings
- Create investment brief with predictions

---

# Key Takeaways

1. **Claude is an agent, not a chatbot** - It uses tools to take action
2. **The loop:** Think → Select Tool → Execute → Observe → Repeat
3. **The Data Analysis Loop:** Monitor → Explore → Craft Story → Impact

---

# Homework

**Data Analysis Assignment:**

1. Pick a domain from the startup-funding.db to analyze
2. Apply the Data Analysis Loop:
   - Monitor: Run 3 baseline queries
   - Explore: Dig into one anomaly or trend
   - Craft: Write 3-5 insights with supporting data
   - Impact: Make one concrete prediction

Save to `output/week2-homework-[your-domain].md`

---

# Next Week Preview

**Week 3: MCP Integration**
- Connect Claude to external services
- Build a data MCP with context management
- Access private data sources
- Create connected workflows
