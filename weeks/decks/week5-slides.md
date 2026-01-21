---
marp: true
theme: default
paginate: true
---

# Week 5: Context Engineering
## Sub-agents and RAG

---

# Session Goals

- Understand sub-agent architecture and use cases
- Use the Task tool to spawn specialized agents
- Define custom agents with focused capabilities
- Build multi-agent workflows for GTM pipelines

---

# The Problem with Single Agents

Complex workflows strain a single agent:
- Context window fills up with intermediate steps
- Focus dilutes across tasks
- Errors cascade

**The real killer: context flooding.**

---

# What Are Sub-agents?

A sub-agent is a separate agent instance that handles a focused subtask within a larger workflow.

Think of it like a boss delegating to employees: you give them a clear brief, they work independently, and they report back with results.

**You don't see every step they took, just the output.**

---

# The Key Insight: Sub-agents Are Black Boxes

```
Without sub-agents:
┌────────────────────────────────────────────────────────┐
│ Main Agent Context                                     │
│ - Task: Research 10 companies                          │
│ - WebSearch result for Company 1 (500 tokens)          │
│ - WebFetch page content (2000 tokens)                  │
│ - ... context explodes ...                             │
└────────────────────────────────────────────────────────┘

With sub-agents:
┌────────────────────────────────────────────────────────┐
│ Main Agent Context                                     │
│ - Task: Research 10 companies                          │
│ - Company 1 result: "Acme Corp, 500 employees..."      │
│ - ... clean, manageable context ...                    │
└────────────────────────────────────────────────────────┘
```

---

# Key Characteristics

- **Isolated context:** Each sub-agent starts fresh, focused only on its task
- **Own conversation:** Sub-agent messages don't pollute the main agent's context
- **Specialized tools:** You can restrict which tools a sub-agent can use
- **Defined model:** Sub-agents can use different models (Haiku for speed, Opus for complexity)
- **Single level:** Sub-agents cannot spawn their own sub-agents

---

# Sub-agents Solve This

```
┌─────────────────────────────────────────────────────────┐
│                    Main Agent                           │
│  "Process these 50 leads"                               │
└─────────────────────────────────────────────────────────┘
          │              │              │
          ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Enrichment │  │   Scorer    │  │   Writer    │
│    Agent    │  │    Agent    │  │    Agent    │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Benefits:** Focused context, parallel execution, specialized tools, isolated failures

---

# The Task Tool

The Task tool spawns sub-agents in Claude Code.

```
> Use the code-reviewer agent to review this PR
```

**How it works:**
1. Creates isolated context for sub-agent
2. Passes the prompt and configuration
3. Sub-agent runs independently until completion
4. Returns final result to main agent

---

# Built-in Sub-agent Types

| Agent Type | Model | Best For | Tools |
|------------|-------|----------|-------|
| `Explore` | Haiku | Codebase exploration | Glob, Grep, Read (read-only) |
| `Plan` | Inherited | Architecture planning | All except Edit/Write |
| `Bash` | Inherited | Command execution | Bash only |
| `general-purpose` | Inherited | Complex multi-step work | All tools |

---

# Three Ways to Create Sub-agents

**1. Built-in agents (Claude Code CLI):**
Use the types above. No configuration needed.

**2. Filesystem-based agents (Claude Code CLI):**
Create agent definitions in `.claude/agents/`

**3. Programmatic agents (Agent SDK):**
Define agents in code when using the SDK

---

# Filesystem-Based Agent Example

```markdown
---
name: lead-enricher
description: Research companies and enrich lead data
model: haiku
tools: ["Read", "WebSearch", "WebFetch", "Write"]
---

# Lead Enricher

Research the company thoroughly. Find:
- Company size and employee count
- Industry and sub-industry
- Recent news and announcements
- Key decision makers and their roles
```

---

# Agent Configuration Options

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Identifier for the agent (lowercase, hyphens) |
| `description` | Yes | What it does and when to use it |
| `tools` | No | Array of allowed tools. Omit for all tools. |
| `model` | No | `haiku`, `sonnet`, or `opus` |
| `permissionMode` | No | `default`, `acceptEdits`, or `bypassPermissions` |

---

# Lab 1: Using Built-in Sub-agents

**Duration:** 30 minutes

**What you'll do:**
- Use the Explore agent for codebase discovery
- Observe parallel sub-agent execution
- Create a custom company-researcher agent
- Test custom agent invocation

---

# **BREAK**
## 10 minutes

---

# Workflow Patterns

**Sequential Pipeline:**
```
Lead → [Enrichment] → [Scoring] → [Email Draft] → Output
```

**Parallel Processing:**
```
        ┌─→ [Agent 1] ─→┐
Lead ───┼─→ [Agent 2] ─→┼─→ Combine
        └─→ [Agent 3] ─→┘
```

---

# Designing Agent Responsibilities

**Good decomposition:**
- Each agent has clear, focused purpose
- Minimal overlap between agents
- Well-defined inputs and outputs

**Anti-patterns:**
- Too many tiny agents (overhead)
- Agents that do "everything"
- Circular dependencies

---

# Context, Memory, and Retrieval

**RAG (Retrieval-Augmented Generation):**

Modern agents treat retrieval as just another tool. Claude can decide when to search, what to search for, and how to use results.

| Traditional RAG | Agentic Search |
|-----------------|----------------|
| Fixed retrieval pipeline | Agent decides when to retrieve |
| Same query for all questions | Agent reformulates queries |
| One-shot retrieval | Iterative search and refinement |

---

# When to Use Vector Search vs Filesystem

| Use Case | Best Approach |
|----------|---------------|
| Structured data (CSVs, databases) | SQL/grep - precise matching |
| Unstructured docs (PDFs, notes) | Vector search - semantic similarity |
| Code search | Grep + embeddings hybrid |
| Finding similar past deals/cases | Vector search - similarity matching |

---

# Lab 2: Build a GTM Pipeline

**Duration:** 45 minutes

**What you'll do:**
- Create specialized agents (lead-enricher, email-drafter)
- Build a lead-pipeline skill for orchestration
- Test the pipeline with startup funding database
- Iterate and refine the workflow

---

# Key Takeaways

1. **Sub-agents = Focused Workers** - Isolated context, specialized tools
2. **Task Tool** - Built-in way to spawn sub-agents
3. **Design Matters** - Clear responsibilities, defined I/O
4. **Orchestration** - Main agent coordinates, sub-agents execute

---

# Homework

**Part 1: Extend Your Pipeline**

Add a new stage to your pipeline:
- GTM/Sales: Competitor research, intent signals
- Developer Tools: Security scanning, test coverage analysis
- Content: SEO analysis, competitor content audit

Create a custom agent definition for this stage. Test with 10+ items.

---

# Next Week Preview

**Week 6: Agent SDK (TypeScript)**
- Running agents headlessly at scale
- Programmatic control of agents
- Building production systems
