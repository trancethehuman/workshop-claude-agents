---
marp: true
theme: default
paginate: true
---

# Week 3: MCP Integration
## Connecting to External Services

---

# Session Goals

- Understand MCP (Model Context Protocol) architecture
- Configure MCP servers for various services
- Connect Claude to CRM, databases, and APIs

---

# The Problem MCP Solves

Before MCP, connecting AI agents required:
- Custom API integrations for each service
- OAuth flows and token management
- Tool definitions for every endpoint

---

# MCP = Universal Protocol

One standard way to connect Claude to any external service.

---

# The Story Behind MCP

**November 2024:** Anthropic open-sourced MCP
**March 2025:** OpenAI adopted MCP
**April 2025:** Google DeepMind confirmed MCP support
**December 2025:** Donated to Linux Foundation

---

# Why This Matters

MCP went from internal experiment to industry standard in one year.

All major AI labs now back it.

---

# Current Scale

- Over 10,000 public MCP servers
- 97 million monthly SDK downloads
- Enterprise support from AWS, Google Cloud, Azure

---

# MCP Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Claude Code   │────▶│   MCP Server    │────▶│ External Service│
│                 │◀────│   (adapter)     │◀────│ (GitHub, DB)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

# What an MCP Server Does

- Exposes tools Claude can use
- Handles authentication
- Translates requests to service-specific APIs

---

# Transport Types

| Transport | Use Case |
|-----------|----------|
| HTTP | Cloud-hosted services |
| stdio | Local tools, CLI wrappers |
| SSE | Real-time services (deprecated) |

---

# Scopes

| Scope | Location | Shared? |
|-------|----------|---------|
| local | ~/.claude.json (project) | No |
| project | .mcp.json in repo | Yes (git) |
| user | ~/.claude.json (global) | No |

---

# Lab 1: Your First MCP Integration

**Step 1: Add the GitHub MCP server**
```bash
claude mcp add --transport http github \
  https://api.githubcopilot.com/mcp/
```

---

# Lab 1: Authenticate

**Step 2: In Claude Code**
```
> /mcp
```
Select GitHub and follow the OAuth flow.

---

# Lab 1: Test the Integration

**Step 3:**
```
> List my open pull requests
> Show me issues labeled "bug" in this repo
> What PRs have been merged this week?
```

---

# Common MCP Servers for GTM

| Server | Use Case |
|--------|----------|
| Notion | CRM, databases |
| PostgreSQL | Analytics DB |
| Gmail | Email |

---

# Common MCP Servers (Continued)

| Server | Use Case |
|--------|----------|
| Slack | Team comms |
| HubSpot | CRM |
| Airtable | Structured data |

---

# Adding Database Connections

```bash
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@host:5432/database"
```

---

# Now Claude Can:

```
> What tables are in the database?
> Show me the schema for the leads table
> Find all leads created this month
```

---

# Adding Notion

```bash
claude mcp add --transport http notion \
  https://mcp.notion.com/mcp
```

After OAuth:
```
> Search for opportunities in the CRM
> Update deal "Acme Corp" to "Proposal Sent"
```

---

# Environment Variables

```bash
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=your_key \
  -- npx -y airtable-mcp-server
```

---

# MCP Resources

Reference data with `@`:
```
@github:issue://123
@notion:page://abc123
@postgres:schema://users
```

---

# Lab 2: Building a GTM Integration Stack

**Goal:** Connect multiple services for lead research
1. Query leads from a data source
2. Research companies on the web
3. Store findings in structured format

---

# Option A: Using Sample Data

Create a local MCP server wrapper for mock-crm.json

No API keys required.

---

# Option B: Using Real Services

**Step 1:** Add Notion for CRM
```bash
claude mcp add --transport http notion \
  https://mcp.notion.com/mcp
```

---

# GTM Workflow Test

```
> I need to prepare for a call with Acme Corp.
> Find their contact info, recent activity, and any open deals.
> Then search the web for their latest news.
```

---

# Key Takeaways

1. MCP = Universal Protocol for external services
2. Three transports: HTTP (cloud), stdio (local), SSE
3. Three scopes: local, project, user

---

# Homework

1. Add at least 2 MCP servers relevant to your project
2. Document which servers you added
3. List 3 useful queries you can now run

---

# Next Week Preview

**Week 4: Agent Skills**
- Teaching Claude new capabilities with SKILL.md files
