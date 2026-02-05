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
- Learn context management for data-heavy applications
- Connect Claude to external tools and data sources

---

# The Problem MCP Solves

Before MCP, connecting AI agents to external services required:
- Custom API integrations for each service
- OAuth flows and token management
- Tool definitions for every endpoint
- Maintenance as APIs change

**MCP provides a universal protocol**

---

# The Story Behind MCP

**November 2024:** Anthropic open-sourced MCP

**March 2025:** OpenAI adopted MCP across their products

**April 2025:** Google DeepMind confirmed MCP support

**December 2025:** MCP donated to Linux Foundation

All major AI labs now back it. When you learn MCP, you're learning infrastructure that works across Claude, ChatGPT, Gemini, and Microsoft Copilot.

---

# MCP Architecture

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

---

# Transport Types

| Transport | Use Case |
|-----------|----------|
| **HTTP** | Cloud-hosted services |
| **stdio** | Local tools, CLI wrappers |
| **SSE** | Real-time services (deprecated) |

---

# Scopes

| Scope | Location | Shared? | Use Case |
|-------|----------|---------|----------|
| **local** | `~/.claude.json` (project path) | No | Personal, sensitive credentials |
| **project** | `.mcp.json` in repo | Yes (git) | Team-shared services |
| **user** | `~/.claude.json` (global) | No | Personal tools across projects |

---

# Current Scale

- Over **10,000 public MCP servers**
- **97 million monthly SDK downloads**
- Enterprise support from AWS, Google Cloud, Azure

MCP went from internal experiment to industry standard in one year.

---

# Context Management for Data

**The problem:**

A single query can return massive amounts of data, instantly filling your context window.

`SELECT * FROM users` could return 2 million rows.

---

# The Solution: Query Strategically

**1. Always use LIMIT for exploration**
```sql
SELECT * FROM funding_rounds LIMIT 100;
```

**2. Aggregate first, then drill down**
```sql
SELECT industry, COUNT(*) FROM startups GROUP BY industry;
-- Then drill into specifics
```

**3. Be specific about what you need**
```sql
-- Good: specific columns, filtered, limited
SELECT name, stage, amount_usd FROM funding_rounds
WHERE stage = 'Series A' ORDER BY amount_usd DESC LIMIT 20;
```

---

# The Data Analysis Loop + Context Management

| Phase | Context Management Strategy |
|-------|---------------------------|
| **Monitor** | Run aggregation queries first (safe, bounded) |
| **Explore** | Drill down with LIMIT, explore segments one at a time |
| **Craft** | Work with summarized insights, not raw data |
| **Impact** | Present recommendations, not data dumps |

---

# **BREAK**
## 10 minutes

---

# Lab 1: Connect External Services

**Duration:** 45 minutes

**What you'll do:**
- Connect GitHub MCP (Option A)
- Connect Notion MCP (Option B)
- Connect a database MCP (Option C)
- Verify connections with `/mcp`

---

# Lab 2: Combined Workflow

**Duration:** 30 minutes

**What you'll do:**
- Funding + Web Research (AI coding tools comparison)
- Data-driven research with multiple sources
- Create comparison table with findings

---

# Key Takeaways

1. **MCP = Universal Protocol** - One way to connect to any service
2. **Three transports** - HTTP (cloud), stdio (local), SSE (deprecated)
3. **Context management is critical** - Aggregate first, limit always
4. **Combine sources** - Real analysis needs data + context from multiple places

---

# Homework

**Part 1: Expand Your MCP Stack**

Add at least 1 more MCP server relevant to your project

**Part 2: Document Your Stack**

- Which servers you added and why
- How you configured them (transport, scope)
- 3 useful queries you can now run

**Part 3: Multi-Source Analysis**

Combine the startup funding database with at least one external MCP

---

# Next Week Preview

**Week 4: Agent Skills**
- Encode domain expertise as reusable skills
- Create a data analysis skill with guardrails
- Progressive disclosure and skill organization
