# Week 4: Agent Skills - Teaching Claude New Capabilities

## Session Goals
- Understand the Agent Skills specification
- Create effective SKILL.md files
- Build skills for data analytics and GTM use cases
- Learn progressive disclosure and skill organization

---

## Block 1: Theory - What Are Agent Skills? (30 min)

### The Problem Skills Solve

Claude is powerful but generic. Skills let you:
- Teach Claude your specific workflows
- Encode team knowledge and standards
- Create reusable capabilities
- Ensure consistent behavior

Without skills, teams hit three recurring problems:

| Problem | What Happens | Example |
|---------|-------------|---------|
| **Prompt Drift** | Without consistent instructions, the agent produces different results for identical requests depending on which context it focuses on | You ask "score this lead" three times and get three different rubrics |
| **Lost Workflow Conventions** | Your org has unique patterns for quality checks, approvals, and decision criteria that agents can't infer | The agent skips your mandatory data validation step because it doesn't know it exists |
| **Context Bloat** | Copying detailed playbooks into every prompt overwhelms the agent's reasoning and buries critical information | You paste a 2,000-word SOP into the prompt and Claude forgets half the steps |

Skills solve all three: write the instructions once, store them in a discoverable location, and the agent loads them on-demand without bloating context.

### Why Skills Matter: SOPs for Your Agent

Think of skills as SOPs (Standard Operating Procedures) for Claude.

In any organization, you don't train every new hire by having them shadow you forever. You write down the process: "Here's how we score leads. Here's our data quality checklist. Here's the format for weekly reports." Then they follow the SOP.

Skills work the same way. You have knowledge Claude doesn't have:
- How your team scores leads
- What makes a good data quality check at your company
- The specific steps for your weekly reporting workflow
- Your industry's benchmarks and red flags

Skills let you write that expertise down once and have Claude use it automatically, forever.

**Real examples:**

| Your Expertise | Without a Skill | With a Skill |
|----------------|-----------------|--------------|
| Lead scoring criteria | Explain rubric every time | Claude scores leads your way automatically |
| Data quality standards | Manually check each dataset | Claude applies your standards consistently |
| Email writing style | Edit every draft Claude writes | Claude writes in your voice from the start |
| Report format | Copy-paste template, fix formatting | Claude generates reports in your exact format |

This is the core skill of this bootcamp: **turning what's in your head into something an agent can use.**

### How to Build Skills: Start With Your Source of Truth

The most important principle for building skills: **start with what already works.**

| Source of Truth | Example |
|-----------------|---------|
| How you already do the work | Your personal process for scoring leads, your email templates |
| The best person on your team | How your top sales rep qualifies deals, how your best analyst profiles data |
| A best practices doc | Your company's style guide, your team's SOP for customer research |
| A trusted external source | A methodology from a respected practitioner, an industry framework you've vetted |

**The right workflow:**

1. Find or create your source of truth (the "golden" version)
2. Write it down as clear, step-by-step instructions
3. Format it as a SKILL.md with the right structure
4. Test it with Claude and iterate

**You can use AI to help build the skill.** Once you have your source of truth, Claude can help you structure it, identify gaps, and format it correctly. But AI assists the process, it doesn't replace the expertise.

**What NOT to do:**

| Anti-Pattern | Why It Fails |
|--------------|--------------|
| Ask AI to "create a lead scoring skill" from scratch | AI will generate generic content that doesn't reflect your actual criteria |
| Copy skills from "awesome-claude-code" repos online | Some influencer's workflow isn't your workflow. Their scoring rubric isn't your rubric. |
| Start with AI and hope it matches your process | You end up with a skill that looks professional but produces wrong outputs |

**The best skills encode real expertise.** They capture what the best person on your team actually does, not what a random AI thinks they should do. Start with your truth, then use AI to help structure and improve it.

### The Architecture: Incremental File Exploration

Skills are part of an emerging pattern in agent design: **incremental file exploration**.

The naive approach is to dump all knowledge into the prompt upfront. "Here's everything you might need to know." This hits context limits fast and wastes tokens on irrelevant information.

The better approach: let the agent explore and load knowledge on-demand.

```
Traditional approach:
┌─────────────────────────────────────────────┐
│ System prompt with ALL instructions         │  ← Context bloat
│ + ALL examples + ALL rubrics + ALL formats  │
└─────────────────────────────────────────────┘

Skills approach:
┌─────────────────────────────────────────────┐
│ Lean system prompt                          │
│ + Skill names and descriptions (lightweight)│
└─────────────────────────────────────────────┘
              ↓ (when needed)
┌─────────────────────────────────────────────┐
│ Load specific SKILL.md                      │  ← On-demand
│ → Load references/ as needed                │
└─────────────────────────────────────────────┘
```

**How it works:**

1. At startup, Claude only loads skill `name` and `description` (a few lines each)
2. When your request matches a skill, Claude loads the full SKILL.md
3. If that skill references detailed docs, Claude loads those only when needed
4. The agent manages its own context window by exploring incrementally

This is the same pattern we saw in Week 2 with filesystem + bash. Instead of stuffing everything into the prompt, the agent retrieves context as it needs it. Skills extend this pattern to domain knowledge.

### How Skills Work

A skill is just a folder with a SKILL.md file. Claude reads it like a recipe and follows the steps.

```
.claude/skills/lead-scorer/
├── SKILL.md              # Your instructions
├── references/
│   └── scoring-rubric.md # Detailed criteria (loaded on-demand)
└── scripts/
    └── validate.py       # Optional automation
```

When you ask Claude something that matches a skill's description, Claude asks permission to use it, loads the instructions, and works from your playbook instead of improvising.

**The key difference from tools:**

Tools execute and return results. Skills prepare the agent to solve a problem. When Claude invokes a skill, it loads the SKILL.md as new instructions, adjusts its execution context, and continues with this enriched environment. Skills change how Claude thinks, not just what it can do.

### The Story Behind Skills

Agent Skills started inside Anthropic as a way to make Claude Code more useful for specialized tasks. As models got more capable, the team needed a scalable way to equip agents with domain expertise without bloating the base prompt.

At an internal hackathon, teams built skills for everything from code review to customer research. The pattern worked so well that Anthropic productized it.

**October 2025:** Anthropic launched Agent Skills publicly. They also released a "skill-creator" skill that uses Claude to generate new skills interactively.

**December 2025:** Anthropic published the Agent Skills specification as an open standard at agentskills.io, following the same playbook as MCP.

### Skills as an Open Standard

The format is now supported across major AI tools:

| Platform | Status |
|----------|--------|
| Claude (Claude.ai, Claude Code, Agent SDK) | Native |
| GitHub Copilot (VS Code, CLI, coding agent) | Native |
| OpenAI Codex CLI | Native |
| Cursor, Gemini CLI, and others | Native or compatible |

Skills you create work across this ecosystem. Put a SKILL.md in `.claude/skills/` or `.github/skills/`, and most agents pick it up automatically. Your investment in writing skills pays off regardless of which AI tools you use.

Anthropic also launched a directory with skills from commercial partners: Atlassian, Canva, Cloudflare, Figma, Notion, Ramp, and Sentry. These are production-grade examples of how companies package their workflows as skills.

**Installing and discovering skills:**

The community has built a public directory at [skills.sh](https://skills.sh/) for discovering and sharing skills. You can install published skills directly:

```bash
npx skills add <owner/repo>
```

Or simply place skill folders in your project's `.claude/skills/` or `.github/skills/` directory. Most agents pick them up automatically.

**References:**
- [Anthropic: Introducing Agent Skills](https://www.anthropic.com/news/skills)
- [Anthropic Engineering: Equipping Agents for the Real World](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Agent Skills Open Standard](https://agentskills.io)
- [GitHub: Agent Skills Repository](https://github.com/anthropics/skills)
- [Vercel: Agent Skills Explained - An FAQ](https://vercel.com/blog/agent-skills-explained-an-faq)
- [Skills Directory](https://skills.sh/)

### Where Skills Fit: Agent Building Blocks

Students often confuse skills with tools, MCP servers, or system prompts. Here's how they relate:

| Building Block | What It Does | Analogy |
|---------------|-------------|---------|
| **System Prompts** | Set foundational behavior and personality | The agent's job description |
| **Rules** | Define behavioral constraints and compliance requirements | Company policies |
| **Tools** | Individual functions for discrete operations (read file, run query) | A hammer, a screwdriver |
| **MCP Servers** | Standardized interfaces for accessing external services | A universal adapter for power tools |
| **Skills** | Package complete workflows with instructions, context, and decision logic | An SOP manual for a specific job |

The key distinction: tools and MCP servers give agents *capabilities* (what they can do). Skills give agents *expertise* (how to do it well). A tool lets Claude run a SQL query. A skill teaches Claude your team's methodology for data analysis, which queries to run in what order, what to look for, and how to present findings.

### Skills vs Slash Commands

| Aspect | Slash Commands | Agent Skills |
|--------|----------------|--------------|
| **Invocation** | Explicit: `/command` | Automatic: Claude detects |
| **Structure** | Single `.md` file | Directory with `SKILL.md` |
| **Complexity** | Simple prompts | Multi-file workflows |
| **Discovery** | Manual | Automatic (by description) |

### SKILL.md Structure

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

### YAML Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase, hyphens only (max 64 chars) |
| `description` | Yes | What + when (max 1024 chars) |
| `allowed-tools` | No | Restrict tools: `Read, Grep, Bash(python:*)` |
| `context` | No | `fork` for isolated sub-agent context |
| `hooks` | No | PreToolUse, PostToolUse, Stop handlers |

### Demo

Show a skill in action:
1. Create a simple skill
2. Trigger it with a matching request
3. See Claude ask permission and execute

---

## Block 2: Lab (Part 1) - Your First Skill (30 min)

**Lab Document:** `labs/week4-lab1.md` or `admin/docx/labs/week4-lab1.docx`

Complete **Part 1** of the Week 4 Lab.

**Overview:**
- Create skill directory structure
- Write SKILL.md with YAML frontmatter
- Test that skill triggers correctly
- Observe structured output

**Success criteria:**
- Skill created at `.claude/skills/database-profiler/`
- Claude discovers and asks to use the skill
- Output follows the four-section structure

---

## BREAK (10 min)

---

## Block 3: Theory - Advanced Skill Patterns (30 min)

### Multi-File Skills

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

**Reference files** load on demand:

```markdown
For SQL query patterns, see [sql-patterns.md](references/sql-patterns.md).
```

### Progressive Disclosure

Keep `SKILL.md` under 500 lines. Structure for efficiency:

```markdown
## Quick Start
[Essential instructions - always loaded]

## Detailed Reference
See [reference.md](references/reference.md) for complete documentation.

## Utility Scripts
Run validation: `python scripts/validate.py input.csv`
```

### Description Best Practices

**Bad:**
```yaml
description: Helps with data.
```

**Good:**
```yaml
description: Analyze datasets using the Data Analysis Loop (Monitor → Explore → Craft → Impact). Use when profiling data, investigating anomalies, or building analytical reports.
```

Include:
- What it does (capabilities)
- When to use it (trigger scenarios)
- Keywords users might say

### Restricting Tools

Use `allowed-tools` for focused skills:

```yaml
---
name: read-only-analyzer
description: Analyze code without making changes
allowed-tools: Read, Grep, Glob
---
```

Patterns:
- `Read` - exact tool name
- `Bash(python:*)` - Bash with python prefix only
- `Bash(git:*)` - Git commands only

### Hooks for Skills

Add validation or logging:

```yaml
---
name: secure-operations
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh $TOOL_INPUT"
---
```

---

## Block 4: Lab (Part 2) - Build a Data Analysis Skill (45 min)

**Lab Document:** `labs/week4-lab2.md` or `admin/docx/labs/week4-lab2.docx`

Complete **Part 2** of the Week 4 Lab.

**Overview:**
- Create skill with references directory
- Add SQL patterns reference file
- Implement tool restrictions (allowed-tools)
- Test with analytical questions

**Success criteria:**
- Data analyst skill created with references
- Tool restrictions working (only allowed tools)
- Data Analysis Loop applied in output

---

## Bonus: Data Visualization Skill (Optional Lab Extension)

### Building a Visualization Generator Skill

Skills can include scripts that Claude executes. This is powerful for data visualization, where you want consistent chart styles and formats.

**Create the skill structure:**

```bash
mkdir -p .claude/skills/data-visualizer/scripts
```

**Create `SKILL.md`:**

```markdown
---
name: data-visualizer
description: Generate charts and visualizations from data. Use when asked to visualize data, create charts, plot trends, or build graphs. Supports bar charts, line charts, scatter plots, and pie charts.
allowed-tools: Read, Bash, Write
---

# Data Visualizer

Generate professional visualizations from query results or data files.

## Supported Chart Types

| Type | Use When |
|------|----------|
| Bar chart | Comparing categories |
| Line chart | Showing trends over time |
| Scatter plot | Showing correlations |
| Pie chart | Showing proportions |

## Process

1. Get the data (from query or file)
2. Identify the best chart type for the question
3. Run the visualization script with appropriate parameters
4. Save the output image to `output/charts/`

## Execution

Use the Python script in `scripts/visualize.py`:

\`\`\`bash
python .claude/skills/data-visualizer/scripts/visualize.py \
  --input data.csv \
  --chart-type bar \
  --x-column category \
  --y-column value \
  --title "My Chart" \
  --output output/charts/chart.png
\`\`\`

## Chart Selection Guide

- "Compare X across categories" → Bar chart
- "Show trend over time" → Line chart
- "Correlation between X and Y" → Scatter plot
- "Distribution/proportion" → Pie chart
```

**Create `scripts/visualize.py`:**

```python
#!/usr/bin/env python3
"""
Data visualization script for the data-visualizer skill.
Generates charts from CSV data using matplotlib.
"""

import argparse
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend

def create_bar_chart(df, x_col, y_col, title, output):
    plt.figure(figsize=(10, 6))
    plt.bar(df[x_col], df[y_col], color='steelblue')
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(title)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    print(f"Chart saved to {output}")

def create_line_chart(df, x_col, y_col, title, output):
    plt.figure(figsize=(10, 6))
    plt.plot(df[x_col], df[y_col], marker='o', color='steelblue')
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(title)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    print(f"Chart saved to {output}")

def create_scatter_plot(df, x_col, y_col, title, output):
    plt.figure(figsize=(10, 6))
    plt.scatter(df[x_col], df[y_col], alpha=0.6, color='steelblue')
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(title)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    print(f"Chart saved to {output}")

def create_pie_chart(df, label_col, value_col, title, output):
    plt.figure(figsize=(10, 8))
    plt.pie(df[value_col], labels=df[label_col], autopct='%1.1f%%')
    plt.title(title)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    print(f"Chart saved to {output}")

def main():
    parser = argparse.ArgumentParser(description='Generate charts from CSV data')
    parser.add_argument('--input', required=True, help='Input CSV file')
    parser.add_argument('--chart-type', required=True,
                        choices=['bar', 'line', 'scatter', 'pie'])
    parser.add_argument('--x-column', required=True, help='X-axis column')
    parser.add_argument('--y-column', required=True, help='Y-axis column')
    parser.add_argument('--title', default='Chart', help='Chart title')
    parser.add_argument('--output', default='chart.png', help='Output file')

    args = parser.parse_args()

    df = pd.read_csv(args.input)

    chart_functions = {
        'bar': create_bar_chart,
        'line': create_line_chart,
        'scatter': create_scatter_plot,
        'pie': create_pie_chart
    }

    chart_functions[args.chart_type](
        df, args.x_column, args.y_column, args.title, args.output
    )

if __name__ == '__main__':
    main()
```

**Test the skill:**

```
> Query the funding database for total funding by industry, then visualize it as a bar chart
```

### Creating Interactive Dashboards

For dashboards that users can interact with in a browser, Claude can generate HTML, CSS, and JavaScript.

**When to use this approach:**
- Stakeholders want a visual interface
- Data needs to be presented in multiple views
- You want filtering, sorting, or drill-down capabilities

**Example prompt:**

```
> Create an HTML dashboard that displays:
> 1. Funding by industry (bar chart)
> 2. Funding over time (line chart)
> 3. A filterable table of all startups
>
> Use Chart.js for the charts. Make it look professional.
> Save to output/dashboard/index.html
```

Claude will generate a complete HTML file with embedded CSS and JavaScript using Chart.js. Open the file in a browser to see your dashboard.

---

## Wrap-Up (15 min)

### Key Takeaways

1. **Skills = Reusable Knowledge** - Encode workflows Claude can discover
2. **Description is Critical** - Include what, when, and keywords
3. **Progressive Disclosure** - Keep SKILL.md lean, reference details
4. **Test Thoroughly** - Verify discovery and output quality
5. **Data Analysis Loop** - Encode methodology, not just tools

### Homework

**Create Two Skills for Your Project:**

Build two skills that encode expertise from your domain. Each skill should capture a repeatable workflow.

| Domain | Example Skills |
|--------|---------------|
| GTM/Sales | Lead scorer, email writer, company researcher, pipeline forecaster |
| Developer Tools | Code reviewer, documentation generator, PR summarizer |
| Content/Marketing | Content brief writer, SEO analyzer, repurposing guide |
| Customer Support | Ticket classifier, response drafter, escalation checker |
| Operations | Invoice processor, compliance checker, report formatter |
| Data Analytics | Data profiler, anomaly detector, trend analyzer, report generator |

**For each skill:**
- Clear trigger description (when should it activate?)
- Step-by-step instructions Claude can follow
- Defined output format
- Put detailed references in `references/` subdirectory

**Submit:**
- Skill directories
- Screenshot of each skill in action
- Brief description of when each triggers

### Next Week Preview

Week 5: Sub-agents - Orchestrating specialized agents for complex workflows

---

## Facilitator Notes

### Common Issues

1. **Skill not triggering:** Check description keywords match request
2. **Wrong location:** Must be `.claude/skills/` not `skills/`
3. **YAML errors:** Check frontmatter syntax (spaces, not tabs)
4. **Reference not loading:** Verify relative path is correct

### Skill Quality Checklist

- [ ] Name is lowercase with hyphens
- [ ] Description includes what + when + keywords
- [ ] Instructions are step-by-step
- [ ] Output format is defined
- [ ] Examples are included

### Timing Adjustments

- Lab 1 is essential - ensure everyone completes
- Lab 2 can be simplified to just SKILL.md if time short
- References can be homework if needed
