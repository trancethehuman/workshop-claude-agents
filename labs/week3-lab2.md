# Week 3 Lab 2: Multi-Source Workflow — Vercel + Supabase

**Course:** Claude Agents Workshop
**Duration:** 30 minutes
**Focus:** Connecting Vercel MCP and combining deployment logs with database insights

---

## Lab Architecture

This lab connects a second MCP (Vercel) and combines it with the Supabase MCP from Lab 1 for multi-source analysis.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Multi-Source Analysis                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│   │  Supabase    │     │   Vercel     │     │  Web Search  │            │
│   │  (DB data)   │     │  (deploys,   │     │  (context)   │            │
│   │              │     │   logs)      │     │              │            │
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

**What we're building:** A multi-source workflow combining deployment data from Vercel with database data from Supabase to analyze a real staging application.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 1 complete** - Supabase MCP connected and working
- [ ] **Vercel account** - Access to the Oatmeal staging project on Vercel
- [ ] **MCP connection verified** - `/mcp` shows Supabase connected

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Connect the Vercel MCP to Claude Code
2. Query deployment logs and project status from Vercel
3. Combine Vercel deployment data with Supabase database data
4. Produce a multi-source health report for a real staging application

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 2.1 | Connect Vercel MCP | 5 min |
| 2.2 | Explore Vercel data | 10 min |
| 2.3 | Multi-source analysis (Vercel + Supabase) | 15 min |
| | **TOTAL** | **30 min** |

---

## Task 2.1: Connect Vercel MCP (5 min)

### Step 1: Add the Vercel MCP Server

```bash
claude mcp add --transport http vercel https://mcp.vercel.com
```

### Step 2: Complete OAuth

1. A browser window will open
2. Sign in to your Vercel account
3. Authorize the connection
4. Return to terminal when complete

### Step 3: Verify the Connection

```
> /mcp
```

You should see both `supabase` and `vercel` listed in connected servers.

**Tip:** For project-specific access (better tool performance, less manual context), you can use a project-scoped URL instead:
```bash
claude mcp add --transport http vercel https://mcp.vercel.com/<team-slug>/<project-slug>
```

### What Vercel MCP Gives You

| Capability | What you can do |
|------------|----------------|
| **Projects** | List and inspect your Vercel projects |
| **Deployments** | View deployment history, status, and URLs |
| **Logs** | Pull deployment logs for debugging and analysis |
| **Docs** | Search Vercel documentation directly |

---

## Task 2.2: Explore Vercel Data (10 min)

Now that Vercel is connected, explore the Oatmeal staging deployment.

### Query 1: Find the Project

```
> List my Vercel projects. Which one is the Oatmeal staging app?
```

**Observe:** Claude uses the Vercel MCP to list projects and identify the right one.

### Query 2: Deployment History

```
> Show me the recent deployments for the Oatmeal staging app.
> Which ones succeeded vs failed? What branches were deployed?
```

**Observe:** Claude pulls deployment metadata — timestamps, status, commit messages, branch names.

### Query 3: Deployment Logs

```
> Pull the logs from the most recent deployment of the Oatmeal staging app.
> Are there any errors or warnings?
```

**Observe:** Claude retrieves actual build/runtime logs and identifies issues. This is the kind of query that would normally require logging into the Vercel dashboard and clicking through multiple screens.

### Query 4: Deployment Health

```
> How often has the Oatmeal staging app been deployed this week?
> What's the success rate? Are there any patterns in the failures?
```

**Record your findings:**

| Metric | Value |
|--------|-------|
| Total recent deployments | |
| Success rate | |
| Most common error (if any) | |
| Most active branch | |

---

## Task 2.3: Multi-Source Analysis — Vercel + Supabase (15 min)

This is where it gets interesting. Combine both MCPs to get a full picture of the staging environment.

### Query 1: Full Stack Health Check

```
> Give me a full health report for the Oatmeal staging environment:
> 1. From Vercel: latest deployment status, any recent errors in logs
> 2. From Supabase: how many hackathons, participants, and submissions are in the DB
> 3. Summarize: is the staging environment healthy and ready for testing?
```

**Observe how Claude:**
- Switches between Vercel MCP and Supabase MCP tools
- Queries deployment status from one source, database state from another
- Synthesizes into a single coherent report

### Query 2: Correlate Deploys with Data Changes

```
> Compare the Vercel deployment timeline with the Supabase data:
> When was the most recent deployment, and what's the most recent data
> in the hackathons table (by created_at)?
> Does the data activity line up with the deploy activity?
```

### Query 3: Staging Readiness Report

```
> I'm about to demo Oatmeal to a customer. Give me a pre-demo checklist:
> 1. Is the latest Vercel deployment live and healthy?
> 2. Does the Supabase DB have enough sample data to show off?
>    (hackathons, sponsors, participants)
> 3. Are there any empty tables that would look bad in a demo?
> 4. What should I seed before the demo?
```

**Record the staging readiness report:**

| Check | Status | Notes |
|-------|--------|-------|
| Vercel deployment healthy? | | |
| DB has sample hackathons? | | |
| DB has sample sponsors? | | |
| DB has participants? | | |
| Empty tables to seed? | | |

---

## Troubleshooting

### Vercel MCP Issues

| Problem | Solution |
|---------|----------|
| OAuth window doesn't open | Copy URL from terminal, open manually |
| "Not authorized" | Re-run `claude mcp add` to re-authenticate |
| Can't find project | Check team/project slug, or list all projects first |
| Logs are empty | Project may not have recent deployments |

### Multi-Source Query Issues

| Problem | Solution |
|---------|----------|
| Claude only queries one source | Be explicit: "From Vercel... and from Supabase..." |
| Queries take too long | Break into smaller steps, query one source at a time |
| MCP disconnected mid-query | Run `/mcp` to check status, reconnect if needed |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Vercel MCP connected** - Shows in `/mcp` output alongside Supabase
- [ ] **Queried Vercel data** - Pulled deployments and/or logs
- [ ] **Combined two MCPs** - Used both Vercel and Supabase in a single analysis
- [ ] **Produced a multi-source report** - Synthesized findings from both sources

**Record your key insight:**

What's the most useful thing about combining deployment data with database data?

```
_______________________________________________________________

_______________________________________________________________
```

---

## Reference: Multi-MCP Best Practices

### Be Explicit About Sources

When querying multiple MCPs, tell Claude which source to use:
```
> From Vercel, get the deployment logs.
> From Supabase, count the hackathons.
> Combine these into a summary.
```

### Context Management Across MCPs

Each MCP tool call consumes context. When combining sources:
- Query each source separately first (bounded, predictable)
- Ask Claude to synthesize after gathering data
- Don't ask for "everything from everywhere" in one prompt

### Useful MCP Combinations

| Combo | Use Case |
|-------|----------|
| **Vercel + Supabase** | Full-stack health monitoring, deploy-to-data correlation |
| **Vercel + GitHub** | Deployment history tied to PR/commit activity |
| **Supabase + Web Search** | Enrich database records with external context |
| **Sentry + Vercel** | Error tracking correlated with deployment timeline |

---

**End of Lab 2**
