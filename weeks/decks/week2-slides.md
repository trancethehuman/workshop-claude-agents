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

**The most important tool?** Bash.

---

# The Tool Calling Loop

```
THINK → SELECT TOOL → EXECUTE → OBSERVE → THINK AGAIN
                                    ↑         │
                                    └─────────┘
                                 (repeat until done)
```

---

# Example: "Analyze top 10 customers by revenue"

1. **Think:** I need to read the CSV file first
2. **Select:** Use the `Read` tool
3. **Execute:** Read the file contents
4. **Observe:** I see 500 rows with columns...

---

# Example (Continued)

5. **Think:** Now I need to sort by revenue and take top 10
6. **Select:** Use `Bash` to sort and filter
7. **Execute:** Run the command
8. **Observe:** Here are the results...

---

# Why Bash Is the Most Important Tool

Vercel removed 80% of their agent's tools and got better results.

**What did they keep?** Bash.

---

# What Vercel Removed

- Schema lookup tool
- Query validation tool
- Error recovery tool
- Entity join finder
- Results formatter
- ...and 7 more specialized tools

---

# Why Bash Works

LLMs have seen grep, cat, find, and ls **billions of times** during training.

These are native operations, not bolted-on behaviors.

---

# How Agents Use Bash

| Command | Agent Use Case |
|---------|----------------|
| `ls` | "What data do I have to work with?" |
| `cat` | "Let me look at this file" |
| `grep` | "Find all mentions of 'pricing objection'" |

---

# How Agents Use Bash (Continued)

| Command | Agent Use Case |
|---------|----------------|
| `head/tail` | "Show me the first 10 rows" |
| `sort` | "Sort by revenue descending" |
| `wc` | "How many records are in this file?" |

---

# On-Demand Context Retrieval

```
Agent receives task
    → Explores filesystem (ls, find)
    → Searches for relevant content (grep)
    → Reads specific files (cat)
    → Sends only what's needed to the model
```

---

# The Philosophy

> "Every agent needs filesystem and bash. If you're building an agent, resist the urge to create custom tools. Instead, ask: can I represent this as files?"

---

# Built-in Tools

| Tool | What It Does |
|------|--------------|
| Read | Read files |
| Write | Create files |
| Edit | Modify files |
| Bash | Run commands |

---

# Built-in Tools (Continued)

| Tool | What It Does |
|------|--------------|
| Glob | Find files by pattern |
| Grep | Search content |
| WebSearch | Search the web |
| WebFetch | Fetch web pages |

---

# How Claude Decides Which Tool

| Your Request | Tool Selected |
|--------------|---------------|
| "What's in this CSV?" | Read |
| "Find all mentions of 'revenue'" | Grep |
| "Research Acme Corp" | WebSearch |

---

# AI-Assisted SQL Querying

| Business Question | Claude Generates |
|-------------------|------------------|
| "Top 10 customers by revenue" | `SELECT ... ORDER BY revenue DESC LIMIT 10` |
| "Month-over-month growth" | Window functions with LAG() |
| "Deals stuck > 30 days" | Date filtering with DATEDIFF() |

---

# Hands-On: SQLite Database

This repo includes `data/sample-sales.db`:
- `customers` - 50 companies
- `deals` - 100 deals with stages and values
- `activities` - 500+ records

Claude queries it directly via Bash + sqlite3.

---

# Bash vs. SQL vs. Other Approaches

| Approach | Best For |
|----------|----------|
| Prompt stuffing | Hits token limits fast |
| Vector search | Imprecise for structured data |
| SQL + AI | Data warehouses, precise queries |
| Bash + filesystem | Local files, debuggable |

---

# Lab 1: Exploring Built-in Tools

**Exercise 1: File Discovery**
```
> What data files are available in this repository?
```
Notice: Claude uses **Glob** to find files.

---

# Lab 1: Data Profiling

**Exercise 2:**
```
> Read the sample-leads.csv file and give me:
> - Total rows and columns
> - Column names and what they contain
> - Distribution of the 'status' field
```

---

# Lab 1: Data Analysis

**Exercise 3:**
```
> What percentage of leads are in Technology?
> What's the correlation between size and score?
> Which lead sources produce highest-scoring leads?
```

---

# Lab 1: Cross-file Analysis

**Exercise 4:**
```
> Compare sample-leads.csv with mock-crm.json.
> Which leads also appear in the CRM contacts?
```

---

# Discussion Questions

1. Which tools did Claude use for each task?
2. Did Claude ever use multiple tools in sequence?
3. How did Claude handle the analysis?

---

# Web Tools: Why They Matter

Your data lives in files. But context lives on the web:
- Company websites
- News articles
- Industry reports

---

# WebSearch: Finding Information

Good prompts for WebSearch:
```
> Search for recent news about Acme Corp funding
> Find information about CRM software market size 2024
> Look up reviews of competitor product X
```

---

# WebFetch: Getting Page Content

When to use WebFetch:
- You have a specific URL to read
- You need detailed content from a page
- You want to extract structured data

---

# Combining Tools for Research

**Company Research Workflow:**
1. WebSearch: "TechCorp company news 2024"
2. WebFetch: Company about page
3. WebSearch: "TechCorp leadership team"
4. Synthesize: Compile research brief

---

# Practical Research Patterns

| Research Goal | Tool Sequence |
|---------------|---------------|
| Company overview | WebSearch → WebFetch |
| Recent news | WebSearch with date filter |
| Competitive analysis | WebSearch → WebFetch each |

---

# External Web Services

| Service | When to Use |
|---------|-------------|
| Tavily | Structured search results for agents |
| Firecrawl | Extract data from complex sites |
| Bright Data | Sites that block automated access |

---

# Lab 2: Company Research Workflow

**Step 1: Single Company Research**
```
> Research Stripe for a sales call. I need:
> 1. What they do
> 2. Company size and headquarters
> 3. Recent news (last 3 months)
```

---

# Lab 2: Structured Output

**Step 2:**
```
> Format the research as a pre-call brief:
> - Company Snapshot
> - What They Do
> - Recent Developments
> - Talking Points
> Save it to output/stripe-research.md
```

---

# Lab 2: Batch Research

**Step 3:**
```
> Research these 3 companies from sample-leads.csv:
> 1. Acme Corp
> 2. GlobalTech Inc
> 3. HealthFirst Solutions
> Format as a markdown table.
```

---

# Key Takeaways

1. Claude is an agent, not a chatbot - It uses tools
2. The loop: Think → Select Tool → Execute → Observe
3. Built-in tools: Read, Write, Bash, Glob, Grep, WebSearch

---

# Homework

1. Pick 5 entities relevant to your project
2. Use Claude to research each one
3. Document which tools Claude used
4. Create a "Research Playbook" with your best prompts

---

# Next Week Preview

**Week 3: MCP Integration**
- Connect Claude to databases, APIs, and services
- Build persistent integrations
- Access private data sources
