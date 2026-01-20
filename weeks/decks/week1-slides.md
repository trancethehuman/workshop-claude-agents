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

# The Shift: Chatbots to Agents

**Chatbot (2022-2023):**
- Human asks question, AI responds, Human acts
- AI is a consultant

**Agent (2024+):**
- Human defines goal, AI plans and acts, Human reviews outcome
- AI is a worker

---

# The Agent Loop

```
INPUT → THINK → SELECT TOOL → EXECUTE → OBSERVE
                    ↑                      │
                    └──────────────────────┘
                         (repeat until done)
```

---

# Core Concepts We'll Cover

| Week | Concept | What It Is |
|------|---------|------------|
| 2 | Tool Calling | How Claude executes actions |
| 3 | MCP | Protocol for connecting to external services |
| 4 | Agent Skills | Markdown files that teach Claude new capabilities |

---

# Core Concepts (Continued)

| Week | Concept | What It Is |
|------|---------|------------|
| 5 | Sub-agents | Specialized agents for focused subtasks |
| 6 | Agent SDK | Run agents headlessly at scale |
| 7 | Evals | Measure and improve agent quality |

---

# Why Now?

- Models are good enough to reason reliably
- Tool use is mature and standardized
- Context windows are large enough for real work

---

# The Rise of GTM Engineering

- New role: **GTM Engineer** - builds AI agents for sales/marketing teams
- GTM engineering jobs grew **205% YoY** in 2025
- Vercel pays **$202K-$302K** for this role

---

# Vercel Case Study

> "We had 10 SDRs doing inbound workflow, and now we just have one that is QAing the agent. The other nine, we deployed on outbound."

*- Jeanne DeWitt Grosser, COO at Vercel*

---

# Claude Code: Beyond Coding

![width:800px](../md/images/week1-boris-cherny-claude-code-non-technical.png)

---

# Key Insight

> "Increasingly, code is no longer the bottleneck."

*- Boris Cherny, Creator of Claude Code*

---

# The Future of Analytics

| Today | Tomorrow |
|-------|----------|
| "Let me check the dashboard" | "What's our conversion rate?" |
| "I need to pull a report" | "Show me deals at risk" |
| "Can someone query this?" | "Which customers should I call?" |

---

# Why Claude Code Over Alternatives?

**The short answer:** Claude Code is arguably the best general-purpose agent harness available today.

**Key insight:** LLMs are filesystem-native. They've seen grep, find, cat billions of times during training.

---

# Vercel's Results After Removing 80% of Tools

| Metric | Before | After |
|--------|--------|-------|
| Success rate | 80% | 100% |
| Execution time | 275 sec | 77 sec (3.5x faster) |
| Token usage | Higher | 37% fewer tokens |

---

# Framework Comparison

| Framework | Approach | Problem |
|-----------|----------|---------|
| LangChain | Prompt chaining | Doesn't leverage LLM knowledge |
| LangGraph | Low-level DAG control | Overkill - you're building plumbing |
| CrewAI | Role-based agents | Too many abstractions |

---

# Why Claude Code Works

- **Claude Code:** Filesystem + bash + tools
- Works with how LLMs think, not against it
- Debuggable: see exactly which files and commands

---

# Why Filesystems Work

- Training distribution: LLMs have seen Unix commands billions of times
- Natural structure: Data maps to directories
- Precise retrieval: Load only what you need

---

# Real Example: Sales Call Summarization

Vercel structured data as files:
```
/customers/cust_12345/
  ├── profile.json
  ├── tickets/
  └── conversations/2024-01-15.txt
```

**Result:** Cost dropped from $1.00 to $0.25 per call

---

# What If You Don't Like Terminals?

**Claude Cowork** - Same agentic capabilities in a desktop GUI
- Runs in Claude Desktop app (macOS)
- Can create Excel, PowerPoint, formatted documents
- Same filesystem-native approach, friendlier interface

---

# Demo: Claude Code in Action

Watch how Claude:
1. Uses **tools** to read the file
2. Reasons about what to do
3. Executes code to analyze
4. Iterates until complete

---

# Lab 1: Environment Setup

Pre-Lab Checklist:
- Claude Pro subscription active
- Node.js 18+ installed
- Git installed

---

# Model Requirements

| Model | Best For | Speed | Cost |
|-------|----------|-------|------|
| Claude Sonnet 4.5 | Most agent work (recommended) | Fast | $$ |
| Claude Opus 4.5 | Complex reasoning | Slower | $$$$ |
| Claude Haiku | Simple tasks, sub-agents | Fastest | $ |

---

# Task 1: Install Claude Code

```bash
# macOS/Linux
curl -fsSL https://claude.ai/install.sh | sh

# Verify
claude --version
```

---

# Task 2: Clone Workshop Repo

```bash
git clone [REPO_URL_PROVIDED_BY_FACILITATOR]
cd workshop-claude-agents
```

---

# Task 3: Authenticate & Test

```bash
# Start Claude Code
claude

# Test it's working
> What files are in this repository?
```

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
└─────────────────────────────────────────┘
```

---

# Layer 1: Tool Calling

| Tool | What It Does |
|------|--------------|
| Read | Read files |
| Write | Create new files |
| Edit | Modify existing files |
| Bash | Run terminal commands |

---

# Layer 2: MCP (Model Context Protocol)

Connect Claude to external services:

```bash
# Add a GitHub MCP server
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

---

# Layer 3: Agent Skills

Skills are Markdown files that teach Claude new capabilities:

```
.claude/skills/
└── lead-scorer/
    ├── SKILL.md
    ├── references/
    └── scripts/
```

---

# Layer 4: Sub-agents

Specialized agents that handle focused subtasks:

```typescript
> "Use the code-reviewer agent to review this PR"
// code-reviewer runs with focused context
// Returns results to main agent
```

---

# Layer 5: Agent SDK

Run agents headlessly from TypeScript:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Process all leads in data/leads.csv",
})) {
  console.log(message);
}
```

---

# CLI vs SDK: Key Differences

| Aspect | Claude Code CLI | Claude Agent SDK |
|--------|-----------------|------------------|
| What it is | Complete CLI tool | Library for your app |
| Control | Shell commands | Full programmatic control |
| Custom tools | MCP servers only | In-process MCP servers |

---

# Lab 2: First Steps with Claude Code

Task 1: Customize Your CLAUDE.md
```markdown
## My Project Context
I'm building agents for [data analytics / GTM / other].
My focus area: [describe your use case]
```

---

# Lab 2: Explore Built-in Tools

Try these commands:
```
> What files are in the data folder?
> Read the sample-leads.csv and summarize it
> Search for files that mention "revenue"
```

---

# The 8-Week Journey

| Week | What You'll Learn |
|------|-------------------|
| 1 | Setup and basics |
| 2 | Tool calling |
| 3 | MCP integrations |
| 4 | Agent Skills |

---

# The 8-Week Journey (Continued)

| Week | What You'll Learn |
|------|-------------------|
| 5 | Sub-agents |
| 6 | Agent SDK |
| 7 | Evals |
| 8 | Demo day |

---

# Homework: Define Your Project

Write a 1-paragraph description of an agent you want to build.

**Requirements:**
- Must involve a repeatable workflow to automate
- Must be something useful to you
- Must be achievable in 7 weeks

---

# Example Projects by Domain

| Domain | Example Project |
|--------|-----------------|
| GTM/Sales | Research companies, score leads, draft outreach |
| Data Analytics | Profile datasets, identify anomalies |
| Developer Tools | Review PRs, generate documentation |

---

# Resources

- Claude Code Documentation: code.claude.com/docs
- Agent SDK Documentation: platform.claude.com/docs
- Agent Skills Specification: agentskills.io
- MCP Protocol: modelcontextprotocol.io

---

# Next Week Preview

**Week 2: Tool Calling**
- How Claude decides which tools to use
- Tool schemas and input validation
- Building custom tools
- Lab: Data analysis tools
