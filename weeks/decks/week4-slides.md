---
marp: true
theme: default
paginate: true
---

# Week 4: Agent Skills
## Teaching Claude New Capabilities

---

# Session Goals

- Understand the Agent Skills specification
- Create effective SKILL.md files
- Build skills for data analytics and GTM use cases
- Learn progressive disclosure and skill organization

---

# The Problem Skills Solve

Claude is powerful but generic. Skills let you:
- Teach Claude your specific workflows
- Encode team knowledge and standards
- Create reusable capabilities
- Ensure consistent behavior

---

# Why Skills Matter: SOPs for Your Agent

Think of skills as **SOPs (Standard Operating Procedures)** for Claude.

You don't train every new hire by having them shadow you forever. You write down the process.

Skills work the same way. You have knowledge Claude doesn't have:
- How your team scores leads
- What makes a good data quality check at your company
- The specific steps for your weekly reporting workflow

---

# Real Examples

| Your Expertise | Without a Skill | With a Skill |
|----------------|-----------------|--------------|
| Lead scoring criteria | Explain rubric every time | Claude scores leads your way automatically |
| Data quality standards | Manually check each dataset | Claude applies your standards consistently |
| Email writing style | Edit every draft Claude writes | Claude writes in your voice from the start |

---

# How to Build Skills: Start With Your Source of Truth

**The most important principle:** start with what already works.

| Source of Truth | Example |
|-----------------|---------|
| How you already do the work | Your personal process, your email templates |
| The best person on your team | How your top sales rep qualifies deals |
| A best practices doc | Your company's style guide, your team's SOP |
| A trusted external source | A methodology from a respected practitioner |

---

# The Right Workflow

1. Find or create your source of truth (the "golden" version)
2. Write it down as clear, step-by-step instructions
3. Format it as a SKILL.md with the right structure
4. Test it with Claude and iterate

**You can use AI to help build the skill.** But AI assists the process, it doesn't replace the expertise.

---

# What NOT to Do

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| Ask AI to "create a lead scoring skill" from scratch | AI generates generic content that doesn't reflect your criteria |
| Copy skills from random repos online | Someone else's workflow isn't your workflow |
| Start with AI and hope it matches your process | You end up with professional-looking but wrong outputs |

---

# The Architecture: Incremental File Exploration

Traditional approach: Dump all knowledge into the prompt upfront

Skills approach: Let the agent explore and load knowledge on-demand

```
┌─────────────────────────────────────────────┐
│ Lean system prompt                          │
│ + Skill names and descriptions (lightweight)│
└─────────────────────────────────────────────┘
              ↓ (when needed)
┌─────────────────────────────────────────────┐
│ Load specific SKILL.md                      │
│ → Load references/ as needed                │
└─────────────────────────────────────────────┘
```

---

# How Skills Work

A skill is just a folder with a SKILL.md file:

```
.claude/skills/lead-scorer/
├── SKILL.md              # Your instructions
├── references/
│   └── scoring-rubric.md # Detailed criteria (loaded on-demand)
└── scripts/
    └── validate.py       # Optional automation
```

When you ask Claude something that matches a skill's description, Claude loads the instructions and works from your playbook.

---

# Skills vs Tools

**Tools** execute and return results.

**Skills** prepare the agent to solve a problem.

When Claude invokes a skill, it loads the SKILL.md as new instructions and continues with this enriched environment.

Skills change how Claude thinks, not just what it can do.

---

# Skills as an Open Standard

The format is now supported across major AI tools:

| Platform | Status |
|----------|--------|
| Claude (Claude.ai, Claude Code, Agent SDK) | Native |
| GitHub Copilot (VS Code, CLI, coding agent) | Native |
| OpenAI Codex CLI | Native |
| Cursor, Gemini CLI, and others | Native or compatible |

---

# SKILL.md Structure

```markdown
---
name: skill-name
description: What it does and when to use it. Include trigger keywords.
---

# Skill Title

## Instructions
Step-by-step guidance for Claude.

## Examples
Concrete input/output examples.
```

---

# YAML Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase, hyphens only (max 64 chars) |
| `description` | Yes | What + when (max 1024 chars) |
| `allowed-tools` | No | Restrict tools: `Read, Grep, Bash(python:*)` |
| `context` | No | `fork` for isolated sub-agent context |

---

# Lab 1: Your First Skill

**Duration:** 30 minutes

**What you'll do:**
- Create skill directory structure
- Write SKILL.md with YAML frontmatter
- Test that skill triggers correctly
- Observe structured output

---

# **BREAK**
## 10 minutes

---

# Multi-File Skills

For complex skills, add supporting files:

```
.claude/skills/data-analyst/
├── SKILL.md              # Main instructions
├── references/
│   ├── sql-patterns.md   # Query templates
│   └── analysis-loop.md  # Methodology
└── scripts/
    └── validate.py       # Validation script
```

---

# Progressive Disclosure

Keep `SKILL.md` under 500 lines. Structure for efficiency:

```markdown
## Quick Start
[Essential instructions - always loaded]

## Detailed Reference
See [reference.md](references/reference.md) for complete documentation.

## Utility Scripts
Run validation: `python scripts/validate.py input.csv`
```

---

# Description Best Practices

**Bad:**
```yaml
description: Helps with data.
```

**Good:**
```yaml
description: Analyze datasets using the Data Analysis Loop (Monitor → Explore → Craft → Impact). Use when profiling data, investigating anomalies, or building analytical reports.
```

Include: what it does, when to use it, keywords users might say

---

# Lab 2: Build a Data Analysis Skill

**Duration:** 45 minutes

**What you'll do:**
- Create skill with references directory
- Add SQL patterns reference file
- Implement tool restrictions (allowed-tools)
- Test with analytical questions

---

# Key Takeaways

1. **Skills = Reusable Knowledge** - Encode workflows Claude can discover
2. **Description is Critical** - Include what, when, and keywords
3. **Progressive Disclosure** - Keep SKILL.md lean, reference details
4. **Test Thoroughly** - Verify discovery and output quality

---

# Homework

**Create Two Skills for Your Project:**

Build two skills that encode expertise from your domain.

| Domain | Example Skills |
|--------|---------------|
| GTM/Sales | Lead scorer, email writer, company researcher |
| Developer Tools | Code reviewer, documentation generator |
| Content/Marketing | Content brief writer, SEO analyzer |
| Data Analytics | Data profiler, anomaly detector, trend analyzer |

---

# Next Week Preview

**Week 5: Sub-agents**
- Orchestrating specialized agents for complex workflows
- Managing context with sub-agents
- Building multi-agent pipelines
