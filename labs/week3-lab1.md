# Week 3 Lab 1: Connect External Services via MCP

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes  
**Focus:** Adding and configuring MCP servers for GitHub, Notion, or databases

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This lab demonstrates how MCP servers extend Claude's capabilities by connecting to external services.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MCP Architecture                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐                                                      │
│   │  Claude Code │                                                      │
│   │    (Host)    │                                                      │
│   └──────┬───────┘                                                      │
│          │                                                              │
│          │ MCP Protocol                                                 │
│          │                                                              │
│   ┌──────┴──────────────────────────────────────────────────────┐       │
│   │                    MCP Servers                              │       │
│   ├──────────────┬──────────────┬──────────────┬────────────────┤       │
│   │   GitHub     │    Notion    │   Database   │   Your MCP     │       │
│   │   Server     │    Server    │   Server     │   Server       │       │
│   └──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘       │
│          │              │              │                │               │
│          ▼              ▼              ▼                ▼               │
│   ┌──────────────┬──────────────┬──────────────┬────────────────┐       │
│   │   GitHub     │    Notion    │  PostgreSQL  │   External     │       │
│   │   API        │    API       │  / MySQL     │   Service      │       │
│   └──────────────┴──────────────┴──────────────┴────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A connected environment where Claude can access external services through MCP.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Week 2 complete** - Comfortable with tool calling and SQL queries
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **Internet connection** - Required for OAuth flows and external APIs

**Optional (for specific exercises):**
- GitHub account (for GitHub MCP)
- Notion account (for Notion MCP)
- PostgreSQL/MySQL database (for database MCP)

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Add and configure at least one MCP server
2. Understand transport types (HTTP, stdio) and scopes (local, project, user)
3. Connect to an external service (GitHub, Notion, or database)
4. Verify the connection and test queries

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| Demo | Instructor live demo: Querying a live database | 10 min |
| Option A | Connect GitHub | 15 min |
| Option B | Connect Notion | 15 min |
| Option C | Connect Database | 15 min |
| Verify | Check connections | 5 min |
| | **TOTAL (demo + 1 option + verify)** | **~30 min** |

Complete at least one option. Choose based on what tools you use in your work.

---

## Instructor Demo: Querying a Live Supabase Database

Watch as the instructor queries a live hackathon platform (Oatmeal) staging database via the Supabase MCP. This shows what's possible when Claude is connected to a real production-like data source.

The instructor starts by asking Claude to discover the right database:
```
> List my Supabase projects. Which one is the Oatmeal staging database?
```

**What to observe:**
- How Claude writes SQL from plain English
- How each query is bounded and specific (context management in action)
- How JOINs across tables happen naturally
- How Claude synthesizes multi-query results into insights

### Demo Queries

**1. Platform Overview**
```
> How many hackathons are in our staging Supabase oatmeal DB? Break them down by status.
```

**2. Event Calendar**
```
> Show me the hackathon calendar — what's coming up next, what's currently in judging,
> and are there any scheduling conflicts where events overlap?
```

**3. Sponsor Analysis**
```
> Which sponsors are supporting multiple hackathons?
> Show me the sponsor tier breakdown across all events.
```

**4. Engagement Funnel**
```
> What's our participant-to-submission rate? Which hackathons have
> registrations but no submissions yet?
```

**5. Full Platform Health**
```
> Give me a full platform health report: total tenants, hackathons by status,
> participant counts, submission rates, and which tables are still empty.
```

**Key takeaways from the demo:**
- Claude manages context by running aggregations first, not `SELECT *`
- Real staging data is sparse — that's normal and still useful for analysis
- MCP handles auth, connection pooling, and query execution behind the scenes
- Plain English prompts produce complex multi-table SQL with JOINs, GROUP BY, and filters

---

## Option A: Connect GitHub (15 min)

GitHub MCP enables Claude to query issues, PRs, and repository content.

### Step 1: Add the GitHub MCP Server

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

### Step 2: Complete OAuth

1. A browser window will open
2. Authorize the GitHub app
3. Return to terminal when complete

### Step 3: Verify the Connection

```
> /mcp
```

You should see `github` listed in the connected servers.

### Step 4: Test Queries

Try these commands to verify GitHub access:

```
> List my open pull requests

> Show me issues labeled "bug" in this repo

> What commits happened in the last week?
```

**Record your results:**

| Query | Result |
|-------|--------|
| Open PRs | |
| Bug issues | |
| Recent commits | |

**Useful for:** Code review workflows, issue triage, PR summaries, repository exploration

---

## Option B: Connect Notion (15 min)

Notion MCP enables Claude to search and read your Notion workspace.

### Step 1: Add the Notion MCP Server

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

### Step 2: Complete OAuth

1. A browser window will open
2. Select which pages/databases to share with Claude
3. Authorize the integration
4. Return to terminal when complete

### Step 3: Verify the Connection

```
> /mcp
```

You should see `notion` listed in the connected servers.

### Step 4: Test Queries

Try these commands:

```
> Search for databases in my workspace

> Find pages mentioning "project plan"

> Show me the structure of my team wiki
```

**Record your results:**

| Query | Result |
|-------|--------|
| Databases found | |
| Pages mentioning "project plan" | |
| Wiki structure | |

**Useful for:** Document research, knowledge base queries, task management, meeting notes search

---

## Option C: Connect a Database (15 min)

Database MCP enables Claude to query your PostgreSQL or MySQL databases directly.

### Step 1: Prepare Your Connection String

**PostgreSQL format:**
```
postgresql://user:password@host:5432/database
```

**MySQL format:**
```
mysql://user:password@host:3306/database
```

### Step 2: Add the Database MCP Server

```bash
# PostgreSQL
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@host:5432/database"

# MySQL
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "mysql://user:pass@host:3306/database"
```

### Step 3: Verify the Connection

```
> /mcp
```

You should see `db` listed in the connected servers.

### Step 4: Test Queries

Try these commands:

```
> What tables are in the database?

> Show me the schema for the users table

> How many records are in each table?
```

**Record your results:**

| Query | Result |
|-------|--------|
| Tables found | |
| Users schema | |
| Record counts | |

**Useful for:** Production data analysis, real-time metrics, customer data research, business intelligence queries

---

## Verify Your Connections

After completing at least one option:

1. **Check MCP status:**
   ```
   > /mcp
   ```

2. **List all available tools:**
   ```
   > What MCP tools are available to me?
   ```

3. **Record what's connected:**

| MCP Server | Status | Available Tools |
|------------|--------|-----------------|
| github | | |
| notion | | |
| db | | |

---

## Troubleshooting

### OAuth & Connection Issues

| Problem | Solution |
|---------|----------|
| Browser doesn't open | Copy URL from terminal, open manually |
| OAuth fails | Try incognito browser, clear cookies |
| Connection timeout | Increase timeout: `MCP_TIMEOUT=10000 claude` |
| "No such tool" errors | MCP may have disconnected, run `claude mcp add` again |

### GitHub MCP Issues

| Problem | Solution |
|---------|----------|
| "Not authorized" | Re-run OAuth flow |
| Can't see private repos | Check GitHub app permissions |
| Rate limited | Wait 1 hour or use a different account |

### Notion MCP Issues

| Problem | Solution |
|---------|----------|
| No pages found | Check which pages you shared during OAuth |
| Search returns nothing | Try different search terms |
| Database not accessible | Ensure database was selected during OAuth |

### Database MCP Issues

| Problem | Solution |
|---------|----------|
| Connection refused | Check host, port, firewall rules |
| Authentication failed | Verify username/password |
| SSL required | Add `?sslmode=require` to connection string |
| Timeout | Check network connectivity to database server |

---

## Final Checklist

Before proceeding to Lab 2, verify:

- [ ] **At least 1 MCP server connected** - Shown in `/mcp` output
- [ ] **Successfully queried external service** - Got real data back
- [ ] **Understand transport used** - HTTP or stdio
- [ ] **Know the scope** - Local, project, or user

**Document your MCP setup:**

| Server | Transport | Scope | Use Case |
|--------|-----------|-------|----------|
| | | | |

---

## Reference: MCP Concepts

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

### More MCP Servers to Explore

If you finished early or want to try additional MCPs beyond GitHub/Notion/databases:

**Supabase** — Full Supabase project access (Postgres, migrations, edge functions, storage)
```bash
claude mcp add --transport http supabase https://mcp.supabase.com/mcp
```
Complete OAuth in the browser, then try: `What tables are in my project?`
- [Supabase MCP docs](https://supabase.com/docs/guides/getting-started/mcp)

**Google BigQuery** — Query your data warehouse directly from Claude
```bash
claude mcp add --transport http bigquery https://bigquery.googleapis.com/mcp
```
Prerequisites: Enable BigQuery MCP in your GCP project first:
```bash
gcloud beta services mcp enable bigquery.googleapis.com --project=PROJECT_ID
```
Required IAM roles: MCP Tool User, BigQuery Job User, BigQuery Data Viewer
- [BigQuery MCP docs](https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp)

**Sentry** — Query errors, issues, and stack traces. OAuth-based, nothing to install.
```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```
Complete OAuth in the browser, then try: `What are the most frequent unresolved errors?`
- [Sentry MCP docs](https://docs.sentry.io/product/sentry-mcp/)

**Databricks** — Access Unity Catalog and SQL warehouses via `mcp-remote` bridge
```bash
claude mcp add-json databricks '{"command":"npx","args":["mcp-remote","https://<workspace-hostname>/api/2.0/mcp/functions/{catalog}/{schema}","--header","Authorization: Bearer <YOUR_PAT>"]}'
```
Replace `<workspace-hostname>` and `<YOUR_PAT>` with your Databricks workspace URL and personal access token.
- [Databricks MCP docs](https://docs.databricks.com/aws/en/generative-ai/mcp/connect-external-services)

**Tavily** — AI-optimized web search with search, extract, map, and crawl tools. Get a free API key at [tavily.com](https://tavily.com).
```bash
claude mcp add --transport http tavily https://mcp.tavily.com/mcp/?tavilyApiKey=<YOUR_KEY>
```
Then try: `Search for the latest AI funding trends in 2024`
- [Tavily MCP docs](https://docs.tavily.com/documentation/mcp)

**Firecrawl** — Scrape, crawl, and extract structured data from any website. Get an API key at [firecrawl.dev](https://www.firecrawl.dev/app/api-keys).
```bash
claude mcp add firecrawl -e FIRECRAWL_API_KEY=<YOUR_KEY> -- npx -y firecrawl-mcp
```
Then try: `Scrape the homepage of ycombinator.com and summarize it`
- [Firecrawl MCP docs](https://docs.firecrawl.dev/mcp-server)

**Browse more:** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — 10,000+ public MCP servers

**Finding trusted MCPs:** The [github.com/mcp](https://github.com/mcp) organization is the official home for MCP on GitHub — use it to find verified servers, SDKs, and community-maintained registries.

---

**End of Lab 1**
