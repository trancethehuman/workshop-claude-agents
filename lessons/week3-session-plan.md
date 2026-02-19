# Week 3: MCP Integration - Connecting to External Services

## Session Goals
- Understand MCP (Model Context Protocol) architecture
- Configure MCP servers for various services
- Learn context management for data-heavy applications
- Connect Claude to external tools and data sources

---

## Block 1: Theory - What is MCP? (30 min)

### The Problem MCP Solves

Before MCP, connecting AI agents to external services required:
- Custom API integrations for each service
- OAuth flows and token management
- Tool definitions for every endpoint
- Maintenance as APIs change

**MCP provides a universal protocol** - one standard way to connect Claude to any external service.

### The Story Behind MCP

MCP started as an internal project at Anthropic. Engineers were building the same integration patterns over and over, connecting Claude to different tools and data sources. Every team reinvented the wheel.

At an internal hackathon, every single entry was built on an early version of MCP. It went viral inside the company. That's when Anthropic knew they had something worth sharing.

**November 2024:** Anthropic open-sourced MCP with SDKs for Python and TypeScript.

**March 2025:** OpenAI adopted MCP across their Agents SDK, Responses API, and ChatGPT desktop. Sam Altman posted: "People love MCP and we are excited to add support across our products."

**April 2025:** Google DeepMind confirmed MCP support in upcoming Gemini models.

**December 2025:** Anthropic donated MCP to the Linux Foundation, establishing the Agentic AI Foundation. Co-founders: Anthropic, Block, and OpenAI. Supporters: Google, Microsoft, AWS, Cloudflare, Bloomberg.

**Why this matters:**

MCP went from internal experiment to industry standard in one year. All major AI labs now back it. When you learn MCP, you're learning infrastructure that works across Claude, ChatGPT, Gemini, and Microsoft Copilot.

The protocol re-uses ideas from the Language Server Protocol (LSP) that powers code editors. If you've used VS Code's autocomplete for multiple languages, you've benefited from a similar standardization effort. MCP does the same for AI tool integrations.

**Current scale:** Over 10,000 public MCP servers. 97 million monthly SDK downloads. Enterprise deployment support from AWS, Google Cloud, and Azure.

**References:**
- [Anthropic: Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Anthropic: Donating MCP to the Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)
- [GitHub Blog: MCP Joins the Linux Foundation](https://github.blog/open-source/maintainers/mcp-joins-the-linux-foundation-what-this-means-for-developers-building-the-next-era-of-ai-tools-and-agents/)

### MCP Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Claude Code   │────▶│   MCP Server    │────▶│ External Service│
│                 │◀────│   (adapter)     │◀────│ (GitHub, DB,    │
│                 │     │                 │     │  Notion, etc.)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**MCP Server:** A lightweight adapter that:
- Exposes tools Claude can use
- Handles authentication
- Translates requests to service-specific APIs

### Transport Types

| Transport | Use Case | Command |
|-----------|----------|---------|
| **HTTP** | Cloud-hosted services | `claude mcp add --transport http` |
| **SSE** | Real-time services (deprecated) | `claude mcp add --transport sse` |
| **stdio** | Local tools, CLI wrappers | `claude mcp add --transport stdio` |

### Scopes

| Scope | Location | Shared? | Use Case |
|-------|----------|---------|----------|
| **local** | `~/.claude.json` (project path) | No | Personal, sensitive credentials |
| **project** | `.mcp.json` in repo | Yes (git) | Team-shared services |
| **user** | `~/.claude.json` (global) | No | Personal tools across projects |

### Demo

Live demo: Add a GitHub MCP server and query issues.

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

### Popular MCP Servers Worth Exploring

Beyond GitHub and Notion, there are MCP servers for major data platforms. These are great options depending on your stack:

#### Data & Infrastructure

| MCP Server | Transport | Setup Command | Use Case |
|------------|-----------|---------------|----------|
| **GitHub** | HTTP | `claude mcp add --transport http github https://api.githubcopilot.com/mcp/` | Code repos, issues, PRs |
| **Notion** | HTTP | `claude mcp add --transport http notion https://mcp.notion.com/mcp` | Docs, wikis, databases |
| **Supabase** | HTTP | `claude mcp add --transport http supabase https://mcp.supabase.com/mcp` | Postgres DB, auth, storage, edge functions |
| **Google BigQuery** | HTTP | `claude mcp add --transport http bigquery https://bigquery.googleapis.com/mcp` | Large-scale data warehouse queries |
| **Vercel** | HTTP | `claude mcp add --transport http vercel https://mcp.vercel.com` | Deployments, logs, project management |
| **Sentry** | HTTP | `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp` | Error tracking, issue triage, debugging |
| **Databricks** | stdio | See config below | Unity Catalog, SQL warehouses, notebooks |

#### Web Search & Scraping

| MCP Server | Transport | Setup Command | Use Case |
|------------|-----------|---------------|----------|
| **Tavily** | HTTP | `claude mcp add --transport http tavily https://mcp.tavily.com/mcp/?tavilyApiKey=<KEY>` | AI-optimized web search |
| **Firecrawl** | stdio | `claude mcp add firecrawl -e FIRECRAWL_API_KEY=<KEY> -- npx -y firecrawl-mcp` | Web scraping, crawling, structured extraction |

**Supabase MCP** — Connects Claude to your Supabase project: query Postgres, manage tables, run migrations, deploy edge functions. Great for full-stack app development.
- Docs: [supabase.com/docs/guides/getting-started/mcp](https://supabase.com/docs/guides/getting-started/mcp)

**Google BigQuery MCP** — Query BigQuery datasets directly from Claude. Requires Google Cloud project with BigQuery MCP enabled.
- Enable first: `gcloud beta services mcp enable bigquery.googleapis.com --project=PROJECT_ID`
- Required IAM roles: MCP Tool User, BigQuery Job User, BigQuery Data Viewer
- Docs: [docs.cloud.google.com/bigquery/docs/use-bigquery-mcp](https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp)

**Vercel MCP** — View deployments, pull logs, and manage projects. OAuth-based. For project-specific access, use `https://mcp.vercel.com/<team-slug>/<project-slug>`.
- Docs: [vercel.com/docs/mcp/vercel-mcp](https://vercel.com/docs/mcp/vercel-mcp)

**Sentry MCP** — Query errors, issues, and stack traces from your Sentry projects. OAuth-based, nothing to install.
- Docs: [docs.sentry.io/product/sentry-mcp](https://docs.sentry.io/product/sentry-mcp/)

**Databricks MCP** — Access Unity Catalog functions and SQL warehouses. Uses `mcp-remote` as a bridge:
```json
// Add to .mcp.json or claude_desktop_config.json
{
  "mcpServers": {
    "databricks": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://<workspace-hostname>/api/2.0/mcp/functions/{catalog}/{schema}",
        "--header",
        "Authorization: Bearer <YOUR_PAT>"
      ]
    }
  }
}
```
- Docs: [docs.databricks.com/aws/en/generative-ai/mcp/connect-external-services](https://docs.databricks.com/aws/en/generative-ai/mcp/connect-external-services)

**Tavily MCP** — AI-optimized web search with search, extract, map, and crawl tools. Get an API key at [tavily.com](https://tavily.com).
- Add globally: `claude mcp add --transport http --scope user tavily https://mcp.tavily.com/mcp/?tavilyApiKey=<KEY>`
- Docs: [docs.tavily.com/documentation/mcp](https://docs.tavily.com/documentation/mcp)

**Firecrawl MCP** — Scrape, crawl, and extract structured data from any website. Get an API key at [firecrawl.dev](https://www.firecrawl.dev/app/api-keys).
- Docs: [docs.firecrawl.dev/mcp-server](https://docs.firecrawl.dev/mcp-server)

**Tip:** Browse the full MCP ecosystem at [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — there are 10,000+ public servers covering CRMs, analytics, cloud infra, and more.

**Finding trusted MCPs:** The [github.com/mcp](https://github.com/mcp) organization is the official home for MCP on GitHub. Use it to find verified servers, SDKs, and community-maintained registries.

---

## Block 2: Theory - Context Management for Data (30 min)

### The Problem

When working with data, context management becomes critical. A single query can return massive amounts of data, instantly filling your context window.

**The difference:**
- Reading a 500-line file? Predictable, bounded.
- `SELECT * FROM users`? Could return 2 million rows.

Without careful management, one careless query can:
- Fill your entire context window
- Cause Claude to lose track of the conversation
- Waste tokens on data that doesn't fit

### The Solution: Query Strategically

When working with databases or large datasets, follow these rules:

**1. Always use LIMIT for exploration**
```sql
-- Always add a limit for exploration queries
SELECT * FROM funding_rounds LIMIT 100;
```

**2. Aggregate first, then drill down**
```sql
-- Start with aggregates to understand the data
SELECT industry, COUNT(*) as count
FROM startups
GROUP BY industry
ORDER BY count DESC;

-- Then drill into specifics
SELECT * FROM startups WHERE industry = 'AI/ML' LIMIT 50;
```

**3. Be specific about what you need**
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

**4. Track what you've seen**

When analyzing large datasets, keep mental notes:
- How many total rows exist
- What subset you've explored
- What's left to investigate

### The Data Analysis Loop + Context Management

Remember the Data Analysis Loop from Week 2? Context management fits into each phase:

| Phase | Context Management Strategy |
|-------|---------------------------|
| **Monitor** | Run aggregation queries first (safe, bounded) |
| **Explore** | Drill down with LIMIT, explore segments one at a time |
| **Craft** | Work with summarized insights, not raw data |
| **Impact** | Present recommendations, not data dumps |

### Demo

Show what happens with good vs. careless queries:

```
> How many funding rounds are in the database?
(Safe - returns a single number)

> Show me all funding rounds
(Dangerous - could return thousands of rows!)

> Show me the top 20 largest Series A rounds
(Good - specific, limited, useful)
```

---

## BREAK (10 min)

---

## Block 3: Lab (Part 1) - Connect External Services (45 min)

### Instructor Live Demo: Querying a Live Supabase Database (10 min)

Before students start the lab, do a live demo querying the Oatmeal staging database via the Supabase MCP. This shows the power of MCP + context management in a real production-like environment.

**Setup:** Supabase MCP should already be connected. If not:
```bash
claude mcp add --transport http supabase https://mcp.supabase.com/mcp
```

**Finding the database:** Ask Claude to list your Supabase projects and pick the Oatmeal staging project:
```
> List my Supabase projects. Which one is the Oatmeal staging database?
```
Claude will use the Supabase MCP to list all projects and identify the right one. Then all subsequent queries will target that project.

**Demo Script — run these prompts live, one at a time:**

**1. Platform Overview** (warm-up, basic aggregation)
```
> How many hackathons are in our staging Supabase oatmeal DB? Break them down by status.
```
*Expected: 17 hackathons — 15 published, 2 in judging. Point out how Claude picks the right table and writes a GROUP BY.*

**2. Event Calendar** (date analysis, planning)
```
> Show me the hackathon calendar — what's coming up next, what's currently in judging,
> and are there any scheduling conflicts where events overlap?
```
*Expected: Timeline from Feb through June 2026. Two hackathons share Apr 8-10 dates (Climate Tech + Education AI). Good teaching moment — Claude spots the conflict.*

**3. Sponsor Analysis** (joins, business insight)
```
> Which sponsors are supporting multiple hackathons?
> Show me the sponsor tier breakdown across all events.
```
*Expected: Tavily sponsors 3 hackathons (gold + 2 none), Anthropic is gold for AI Agents, OpenAI is silver for Climate Tech, Goldman Sachs sponsors FinTech. Demonstrates JOINs across tables.*

**4. Engagement Funnel** (multi-table join, product analytics)
```
> What's our participant-to-submission rate? Which hackathons have
> registrations but no submissions yet?
```
*Expected: 7 participants across 4 hackathons, only 1 submission total (FinTech AI Buildathon). Most hackathons have zero engagement — real staging data looks like this. Good context management lesson: Claude should aggregate, not dump all rows.*

**5. Full Platform Health** (synthesis, multiple queries)
```
> Give me a full platform health report: total tenants, hackathons by status,
> participant counts, submission rates, and which tables are still empty.
```
*Expected: Claude runs multiple queries, synthesizes into a report. 11 tenants, 17 hackathons, 7 participants, 1 submission. Empty tables: prizes, judging_criteria, scores, judge_assignments, hackathon_results. Shows how Claude manages context across many queries.*

**Key points to highlight during demo:**
- Claude writes SQL you never had to think about
- Each query is bounded and specific (good context management)
- JOINs across tables happen naturally from plain English
- Real staging data is messy and sparse — that's normal
- The Supabase MCP handles auth, connection, and query execution

---

**Lab Document:** `labs/week3-lab1.md` or `admin/docx/labs/week3-lab1.docx`

Complete **Part 1** of the Week 3 Lab.

**Overview:**
- Connect GitHub MCP (Option A)
- Connect Notion MCP (Option B)
- Connect a database MCP (Option C)
- Verify connections with `/mcp`

**Success criteria:**
- At least 1 MCP server connected
- Successfully queried the external service
- Listed tools with `/mcp`

---

## Block 4: Lab (Part 2) - Multi-Source Workflow with Vercel + Supabase (30 min)

**Lab Document:** `labs/week3-lab2.md` or `admin/docx/labs/week3-lab2.docx`

Complete **Part 2** of the Week 3 Lab.

**Overview:**
- Connect Vercel MCP (5 min)
- Explore Vercel deployment data — logs, status, history (10 min)
- Multi-source analysis combining Vercel + Supabase (15 min)

**Success criteria:**
- Vercel MCP connected alongside Supabase
- Queried deployment logs and project status from Vercel
- Combined Vercel + Supabase data in a single analysis
- Produced a multi-source staging health report

---

## Wrap-Up (15 min)

### Key Takeaways

1. **MCP = Universal Protocol** - One way to connect to any service
2. **Three transports** - HTTP (cloud), stdio (local), SSE (deprecated)
3. **Three scopes** - local, project, user (precedence matters)
4. **Context management is critical** - Aggregate first, limit always, drill down carefully
5. **Combine sources** - Real analysis often needs data + context from multiple places

### Homework

**Part 1: Expand Your MCP Stack**

Add at least 1 more MCP server relevant to your project:

| Project Domain | Useful MCP Servers |
|----------------|-------------------|
| GTM/Sales | CRM (HubSpot, Salesforce), Email (Gmail), Notion |
| Developer Tools | GitHub, PostgreSQL, Sentry, Linear |
| Content/Marketing | Notion, Google Docs, social APIs |
| Customer Support | Zendesk, Intercom, Slack |
| Operations | Google Sheets, Airtable, databases |

**Part 2: Document Your Stack**

Create a brief doc with:
- Which servers you added and why
- How you configured them (transport, scope)
- 3 useful queries you can now run

**Part 3: Multi-Source Analysis**

Do one analysis that combines:
- The startup funding database (local queries)
- At least one external MCP (GitHub, Notion, web research, etc.)

Document your findings and the workflow you used.

### Next Week Preview

Week 4: Agent Skills - Teaching Claude new capabilities with SKILL.md files
- Encode domain expertise as reusable skills
- Create a data analysis skill with guardrails
- Progressive disclosure and skill organization

---

## Facilitator Notes

### Common Issues

1. **OAuth failures:** Ensure browser allows popups, try incognito
2. **Connection timeouts:** Increase with `MCP_TIMEOUT=10000 claude`
3. **"No such tool" errors:** MCP server may have disconnected, re-add it
4. **Database connection issues:** Check DSN format, firewall rules

### API Key Options for Participants

For live services, participants can:
- Use free tiers (Notion, GitHub have free plans)
- Work with the local funding database (no accounts needed)
- Pair up if some have accounts

### Timing Adjustments

- If OAuth issues: Focus on GitHub (most reliable) or skip to database queries
- If ahead: Have participants try multiple MCPs
- Lab 2 can extend into homework if needed

### Discussion Prompts

- "What external data would make your project more powerful?"
- "How do you think about combining structured data with unstructured context?"
- "What context management mistakes have you made in the past?"

### Key Concepts to Emphasize

1. **MCP unlocks external context** - But the pattern is the same: query, limit, iterate
2. **Local data + external context = insight** - Numbers alone don't tell the story
3. **Context management applies everywhere** - Not just databases, any large data source
