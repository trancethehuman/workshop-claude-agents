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

---

# The Problem Skills Solve

Claude is powerful but generic. Skills let you:
- Teach Claude your specific workflows
- Encode team knowledge and standards
- Create reusable capabilities

---

# Skills = SOPs for Your Agent

Think of skills as Standard Operating Procedures for Claude.

You write down the process, Claude follows the SOP.

---

# Your Expertise, Encoded

| Your Expertise | Without a Skill | With a Skill |
|----------------|-----------------|--------------|
| Lead scoring | Explain rubric every time | Claude scores your way |
| Data quality | Manually check each dataset | Claude applies your standards |
| Email style | Edit every draft | Claude writes in your voice |

---

# How to Build Skills: Start With What Works

| Source of Truth | Example |
|-----------------|---------|
| How you already do the work | Your personal scoring process |
| The best person on your team | How your top rep qualifies deals |
| A best practices doc | Your team's SOP |

---

# The Right Workflow

1. Find or create your source of truth
2. Write it down as step-by-step instructions
3. Format it as a SKILL.md
4. Test with Claude and iterate

---

# What NOT To Do

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| Ask AI to create skill from scratch | Generic, doesn't match your criteria |
| Copy skills from online repos | Someone else's workflow, not yours |
| Start with AI and hope it matches | Looks professional, wrong outputs |

---

# Incremental File Exploration

Skills load knowledge on-demand, not upfront.

---

# Traditional vs Skills Approach

```
Traditional:
┌─────────────────────────────────────────────┐
│ System prompt with ALL instructions         │  ← Context bloat
└─────────────────────────────────────────────┘

Skills approach:
┌─────────────────────────────────────────────┐
│ Lean prompt + skill names/descriptions      │
│ → Load SKILL.md when needed                 │  ← On-demand
│ → Load references/ as needed                │
└─────────────────────────────────────────────┘
```

---

# How Skills Work

```
.claude/skills/lead-scorer/
├── SKILL.md              # Your instructions
├── references/
│   └── scoring-rubric.md # Detailed criteria
└── scripts/
    └── validate.py       # Optional automation
```

---

# Skills as Open Standard

| Platform | Status |
|----------|--------|
| Claude (Claude.ai, Claude Code, SDK) | Native |
| GitHub Copilot | Native |
| OpenAI Codex CLI | Native |
| Cursor, Gemini CLI | Compatible |

---

# SKILL.md Structure

```markdown
---
name: skill-name
description: What it does and when to use it.
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
| name | Yes | Lowercase, hyphens (max 64 chars) |
| description | Yes | What + when (max 1024 chars) |
| allowed-tools | No | Restrict tools |

---

# Lab 1: Your First Skill

**Create a Data Profiling Skill**

```bash
mkdir -p .claude/skills/data-profiler
```

---

# Data Profiler SKILL.md

```markdown
---
name: data-profiler
description: Profile CSV datasets. Use when analyzing
a new dataset or checking data quality.
---

# Data Profiler

When profiling a dataset, provide:
1. Structure Overview
2. Quality Assessment
3. Statistical Summary
4. Recommendations
```

---

# Test the Skill

```
> Profile the sample-leads.csv file
```

Watch for:
- Claude asking to use the skill
- Structured output following the template

---

# Multi-File Skills

For complex skills, add supporting files:
```
.claude/skills/lead-scorer/
├── SKILL.md              # Main instructions
├── references/
│   ├── scoring-rubric.md # Detailed criteria
│   └── examples.md       # Sample scores
```

---

# Progressive Disclosure

Keep SKILL.md under 500 lines.

```markdown
## Quick Start
[Essential instructions - always loaded]

## Detailed Reference
See [reference.md](references/reference.md)
```

---

# Description Best Practices

**Bad:**
```yaml
description: Helps with leads.
```

**Good:**
```yaml
description: Score leads 1-100 based on firmographic
signals. Use when prioritizing leads or evaluating
inbound prospects.
```

---

# Restricting Tools

```yaml
---
name: read-only-analyzer
description: Analyze code without making changes
allowed-tools: Read, Grep, Glob
---
```

---

# Lab 2: Build a Lead Scoring Skill

Create a comprehensive lead scoring skill with:
1. Scoring rubric
2. Example scores
3. Structured output

---

# Lead Scorer Structure

```bash
mkdir -p .claude/skills/lead-scorer/references
```

---

# Scoring Process in SKILL.md

1. Gather Information
2. Apply Scoring Rubric
   - Company Fit (0-40 points)
   - Buying Signals (0-30 points)
   - Engagement Level (0-30 points)
3. Output Format: Table with reasoning

---

# Scoring Rubric Example

**Company Fit (0-40 points)**
- Industry Match: 0-15
- Company Size: 0-15
- Budget Indicators: 0-10

---

# Test with Sample Leads

```
> Score the leads in data/sample-leads.csv

> Score this lead: John Smith, VP Engineering at
Acme Corp (250 employees, Technology industry),
downloaded our whitepaper last week
```

---

# Bonus: Data Visualization Skills

Skills can include scripts. Great for charts and dashboards.

```
.claude/skills/data-visualizer/
├── SKILL.md
└── scripts/
    └── visualize.py   # Python matplotlib script
```

---

# Creating Dashboards

For interactive dashboards, ask Claude to write HTML/CSS/JS:

```
> Create an HTML dashboard with:
> 1. Lead count by industry (bar chart)
> 2. Score distribution (histogram)
> 3. Filterable table
> Use Chart.js. Save to output/dashboard/index.html
```

---

# Key Takeaways

1. Skills = Reusable Knowledge
2. Description is Critical - include what, when, keywords
3. Progressive Disclosure - keep SKILL.md lean
4. Skills can include scripts for visualization

---

# Homework

Create two skills for your project:
- Clear trigger description
- Step-by-step instructions
- Defined output format
- References in subdirectory

---

# Next Week Preview

**Week 5: Sub-agents**
- Orchestrating specialized agents for complex workflows
