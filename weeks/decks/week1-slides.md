---
marp: true
theme: default
paginate: true
---

# Week 1: Overview & Setup
## The Age of AI Agents

---

# Session Goals

- Understand what agent engineering is and why it matters
- See the landscape: Claude Code, Agent SDK, tools, skills, MCP
- Get fully set up with Claude Code and TypeScript environment

---

# The Shift from Chatbots to Agents

**Chatbot (2022-2023):**
Human asks question → AI responds → Human acts

**Agent (2024+):**
Human defines goal → AI plans, acts, iterates → Human reviews outcome

---

# The Agent Loop

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   INPUT → THINK → SELECT TOOL → EXECUTE → OBSERVE    │
│              ↑                              │        │
│              └──────────────────────────────┘        │
│                    (repeat until done)               │
└──────────────────────────────────────────────────────┘
```

---

# 8-Week Roadmap

| Week | Concept | What You'll Learn |
|------|---------|-------------------|
| 1 | Setup & Basics | Environment ready, project defined |
| 2 | Tool Calling | How Claude executes actions |
| 3 | MCP | Universal protocol for external services |
| 4 | Agent Skills | Markdown files that teach Claude new capabilities |

---

# 8-Week Roadmap (continued)

| Week | Concept | What You'll Learn |
|------|---------|-------------------|
| 5 | Sub-agents | Specialized agents for focused subtasks |
| 6 | Agent SDK | Run agents headlessly at scale (TypeScript) |
| 7 | Evals | Measure and improve agent quality |
| 8 | Demo Day | Present your project |

---

# Why Now?

- Models are good enough to reason reliably
- Tool use is mature and standardized
- Context windows are large enough for real work

---

# The Rise of GTM Engineering

**Vercel's story:** Replaced 9 of 10 inbound SDRs with an AI agent in six weeks

> "We had 10 SDRs doing this inbound workflow, and now we just have one that is effectively QAing the agent."
> - Jeanne DeWitt Grosser, COO at Vercel

GTM engineering jobs grew **205% year-over-year** in 2025

---

# Claude Code: Beyond Coding

![width:800px](../lectures/images/week1-boris-cherny-claude-code-non-technical.png)

"People are using it for all sorts of things from coding, to devops, to research, to non-technical use cases."
- Boris Cherny, creator of Claude Code

---

# The Future of Analytics

| Today | Tomorrow |
|-------|----------|
| "Let me check the dashboard" | "What's our conversion rate this week?" |
| "I need to pull a report" | "Show me deals at risk of slipping" |
| "Can someone query this?" | "Which customers should I call today?" |

You won't manage dashboards. You'll ask for insights.

---

# Why Claude Code Over Alternatives?

**The insight:** LLMs are filesystem-native

They've seen grep, find, cat, and bash billions of times during training

Claude Code gives Claude a filesystem and bash - that's the core loop

---

# Vercel's Results: Fewer Tools = Better Performance

After removing 80% of their agent's tools:

| Metric | Before | After |
|--------|--------|-------|
| Success rate | 80% | 100% |
| Execution time | 275 sec | 77 sec (3.5x faster) |
| Token usage | Higher | 37% fewer tokens |

---

# The Alternatives

| Framework | Approach | Problem |
|-----------|----------|---------|
| **LangChain** | Prompt chaining | Simple chains don't leverage what LLMs know |
| **LangGraph** | Low-level DAG control | Overkill. You're building plumbing, not solutions |
| **CrewAI** | Role-based agents | Too many abstractions |
| **Claude Code** | Filesystem + bash + tools | Works with how LLMs think |

---

# What If You Don't Like Terminals?

**Claude Cowork** - Same capabilities, desktop GUI

- Runs in Claude Desktop app (macOS)
- Read and write files directly on your computer
- Create Excel, PowerPoints, formatted documents
- No command line required

---

# Lab 1: Environment Setup

**Duration:** 30 minutes

**What you'll do:**
- Install Claude Code CLI
- Clone workshop repository
- Authenticate and test

---

# **BREAK**
## 10 minutes

---

# The Claude Agent Stack

```
┌─────────────────────────────────────────┐
│           Your Application              │
├─────────────────────────────────────────┤
│         Claude Agent SDK (TS)           │  ← Week 6
├─────────────────────────────────────────┤
│    Sub-agents    │    Agent Skills      │  ← Week 5, 4
├─────────────────────────────────────────┤
│              MCP Servers                │  ← Week 3
├─────────────────────────────────────────┤
│             Tool Calling                │  ← Week 2
├─────────────────────────────────────────┤
│               Claude                    │
└─────────────────────────────────────────┘
```

---

# Layer 1: Tool Calling

| Tool | What It Does |
|------|--------------|
| **Read** | Read files |
| **Write** | Create new files |
| **Edit** | Modify existing files |
| **Bash** | Run terminal commands |
| **Glob** | Find files by pattern |
| **Grep** | Search file contents |
| **WebSearch** | Search the web |

---

# Layer 2: MCP (Model Context Protocol)

Connect Claude to external services:

```bash
# Add a GitHub MCP server
claude mcp add --transport http github \
  https://api.githubcopilot.com/mcp/

# Add a database server
claude mcp add --transport stdio db \
  -- npx -y @bytebase/dbhub --dsn "postgresql://..."
```

---

# Layer 3: Agent Skills

Skills are Markdown files that teach Claude new capabilities:

```
.claude/skills/
└── lead-scorer/
    ├── SKILL.md         # Instructions
    ├── references/      # Supporting docs
    └── scripts/         # Utility code
```

Claude automatically discovers and uses skills when relevant.

---

# Layer 4: Sub-agents

The Task tool spawns specialized agents:

```
> Use the code-reviewer agent to review this PR
```

- Main agent delegates to specialist
- Sub-agent runs with focused context
- Returns results to main agent

---

# Layer 5: Agent SDK

Run agents headlessly from TypeScript:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Process all leads in data/leads.csv",
  options: { allowedTools: ["Read", "Write", "Bash"] }
})) {
  console.log(message);
}
```

---

# Claude Code CLI vs Agent SDK

| Aspect | Claude Code CLI | Agent SDK |
|--------|-----------------|------------------|
| **What it is** | Complete CLI tool | Library for your app |
| **Control** | Shell commands, parse output | Full programmatic control |
| **Custom tools** | MCP servers only | In-process MCP servers |
| **Integration** | Subprocess | First-class SDK |

---

# Lab 2: First Steps with Claude Code

**Duration:** 45 minutes

**What you'll do:**
- Explore the repo structure with Claude
- Test built-in tools (Glob, Read, Grep, Bash)
- Customize CLAUDE.md with project context

---

# Homework: Define Your Project

Write a 1-paragraph description of an agent you want to build.

**Requirements:**
- Repeatable workflow you want to automate
- Something useful to you (real or realistic)
- Achievable in 7 weeks of incremental building

**Due before Week 2**

---

# Example Project Ideas

| Domain | Example |
|--------|---------|
| GTM/Sales | Research companies, score leads, draft personalized outreach |
| Data Analytics | Profile datasets, identify anomalies, generate quality reports |
| Developer Tools | Review PRs, generate documentation, track technical debt |
| Content/Marketing | Research topics, draft blog posts, repurpose content |

---

# Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [Claude Models Overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Agent SDK Documentation](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Agent Skills Specification](https://agentskills.io)
- [MCP Protocol](https://modelcontextprotocol.io)

---

# Next Week Preview

**Week 2: Tool Calling**
- How Claude decides which tools to use
- Tool schemas and input validation
- Building custom tools
- Lab: Data analysis workflows
