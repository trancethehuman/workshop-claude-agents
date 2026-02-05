# Week 5 Lab 1: Using Built-in Sub-agents

**Course:** Claude Agents Workshop  
**Duration:** 30 minutes  
**Focus:** Understanding and using built-in sub-agents for codebase exploration and parallel execution

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This lab demonstrates how sub-agents enable complex workflows by isolating context and parallelizing work.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Sub-agent Architecture                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │                     Main Agent                           │          │
│   │  "Research these three topics in parallel"               │          │
│   └────────────────────────┬─────────────────────────────────┘          │
│                            │                                            │
│          ┌─────────────────┼─────────────────┐                          │
│          │                 │                 │                          │
│          ▼                 ▼                 ▼                          │
│   ┌────────────┐    ┌────────────┐    ┌────────────┐                    │
│   │  Explore   │    │  Explore   │    │  Explore   │                    │
│   │   Agent    │    │   Agent    │    │   Agent    │                    │
│   │  (Topic 1) │    │  (Topic 2) │    │  (Topic 3) │                    │
│   └────────────┘    └────────────┘    └────────────┘                    │
│         │                 │                 │                           │
│         ▼                 ▼                 ▼                           │
│   [Results 1]       [Results 2]       [Results 3]                       │
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │ Key Insight: Each sub-agent has its own context. Intermediate  │    │
│   │ work (web scrapes, file reads) stays isolated. Only final      │    │
│   │ results return to the main agent, keeping context clean.       │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** Familiarity with built-in sub-agents and creating your first custom agent.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Week 4 complete** - Comfortable creating Agent Skills
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **Repository cloned** - Access to workshop codebase

**Understanding helpful but not required:**
- How the Task tool spawns sub-agents
- Difference between built-in agents (Explore, Plan, Bash) and custom agents

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Understand how sub-agents provide context isolation
2. Use built-in sub-agents for codebase exploration
3. Observe parallel sub-agent execution
4. Create your first custom agent definition

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Explore with Built-in Agents | 10 min |
| 1.2 | Create Your First Custom Agent | 15 min |
| 1.3 | Test Your Custom Agent | 5 min |
| | **TOTAL** | **30 min** |

---

## Understanding Sub-agents

Sub-agents are separate agent instances that handle focused subtasks. They:
- Run in isolated context (their intermediate work doesn't pollute main agent)
- Can use different models (Haiku for speed, Opus for complexity)
- Return only final results to the parent agent
- Cannot spawn their own sub-agents (single level only)

---

## Task 1.1: Explore with Built-in Agents (10 min)

Claude Code has built-in agents optimized for common tasks.

1. **Ask a broad exploration question:**
   ```
   > How does the authentication system work in this codebase?
   ```

2. **Watch Claude spawn an Explore agent:**
   - Notice it uses Haiku for speed
   - Observe read-only tools (Glob, Grep, Read)
   - See how it searches methodically

3. **Request parallel exploration:**
   ```
   > I need to understand three things in parallel:
   > 1. How data validation works
   > 2. How errors are handled
   > 3. How logging is configured
   ```

4. **Observe parallel execution:**
   - Multiple sub-agents spawn simultaneously
   - Each searches independently
   - Results compile at the end

5. **Record your observations:**

| Agent Type | Model Used | Tools Available | Time Taken |
|------------|------------|-----------------|------------|
| Explore | | | |

---

## Task 1.2: Create Your First Custom Agent (15 min)

Custom agents let you define specialized workers with specific instructions and tools.

1. **Create the agents directory:**
   ```bash
   mkdir -p .claude/agents
   ```

2. **Create `.claude/agents/company-researcher.md`:**

   ```markdown
   ---
   name: company-researcher
   description: Research a company for sales preparation. Use when preparing for sales calls or evaluating prospects.
   model: haiku
   tools: ["Read", "WebSearch", "WebFetch"]
   ---

   # Company Researcher

   Research the target company and provide a concise briefing:

   1. **Company Overview** - What they do, size, industry
   2. **Recent News** - Last 3 months of relevant news
   3. **Key People** - Leadership team and decision makers
   4. **Potential Pain Points** - Based on their industry and size

   Keep the briefing under 500 words. Focus on actionable intelligence for a sales conversation.
   ```

3. **Understand the configuration:**

   | Field | Value | Purpose |
   |-------|-------|---------|
   | `name` | company-researcher | Identifier for invocation |
   | `description` | Research a company... | Triggers automatic detection |
   | `model` | haiku | Fast model for research |
   | `tools` | Read, WebSearch, WebFetch | Limited to research tools |

4. **Restart Claude Code** to pick up the new agent:
   ```bash
   claude
   ```

---

## Task 1.3: Test Your Custom Agent (5 min)

1. **Invoke the agent explicitly:**
   ```
   > Use company-researcher to research Stripe
   ```

2. **Verify the agent is discovered:**
   - Claude should ask permission to use `company-researcher`
   - Output should follow the four-section structure
   - Research should be concise (under 500 words)

3. **Try implicit invocation:**
   ```
   > I'm preparing for a sales call with Figma tomorrow. What should I know?
   ```

   The description includes "sales preparation" so it should trigger.

4. **Record your results:**

| Request | Agent Triggered? | Output Quality |
|---------|------------------|----------------|
| "Use company-researcher to research Stripe" | | |
| "Preparing for a sales call with Figma" | | |

---

## Troubleshooting

### Agent Not Found

| Problem | Solution |
|---------|----------|
| Agent not discovered | Check `.claude/agents/` directory exists |
| Missing `.md` extension | Agent files must end in `.md` |
| YAML syntax error | Validate frontmatter (use spaces, not tabs) |

### Agent Not Triggering

| Problem | Solution |
|---------|----------|
| Description doesn't match | Add more trigger keywords to description |
| Agent too specific | Broaden the "when to use" section |
| Forgot to restart | Restart Claude Code after adding agents |

### Sub-agent Issues

| Problem | Solution |
|---------|----------|
| Results not returning | Sub-agent may have errored; check output |
| Slow execution | Use parallel execution for independent tasks |
| Context overflow | Break into smaller, focused agents |
| MCP tools not working | Background sub-agents can't access MCP; use foreground |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Built-in agents explored** - Used Explore agent for codebase questions
- [ ] **Parallel execution observed** - Multiple sub-agents ran simultaneously
- [ ] **Agents directory created** - `.claude/agents/` exists
- [ ] **Custom agent created** - company-researcher.md works correctly
- [ ] **Agent triggers correctly** - Matches on relevant requests

**Document your observations:**

| Element | Your Finding |
|---------|--------------|
| Built-in agent model | |
| Parallel tasks completed | |
| Custom agent trigger phrases | |

---

## Reference: Built-in Agent Types

| Agent Type | Model | Tools | Best For |
|------------|-------|-------|----------|
| `Explore` | Haiku | Glob, Grep, Read | Quick searches, finding files |
| `Plan` | Inherited | All except Edit/Write | Architecture planning |
| `Bash` | Inherited | Bash only | Git, scripts, commands |
| `general-purpose` | Inherited | All tools | Complex multi-step work |

---

## Reference: Agent Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase, hyphens only |
| `description` | Yes | What + when (triggers auto-detection) |
| `model` | No | `haiku`, `sonnet`, or `opus` |
| `tools` | No | Array of allowed tools |
| `permissionMode` | No | `default`, `acceptEdits`, `bypassPermissions` |

---

**End of Lab 1**
