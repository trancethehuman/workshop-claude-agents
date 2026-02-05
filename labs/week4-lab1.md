# Week 4 Lab 1: Your First Skill - Database Profiler

**Course:** Claude Agents Workshop  
**Duration:** 30 minutes  
**Focus:** Creating your first SKILL.md file to encode a database profiling workflow

---

## Lab Architecture

This lab demonstrates how Agent Skills encode domain knowledge that Claude can discover and use automatically.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Agent Skills Architecture                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│   │   Your       │     │   Claude     │     │   Claude     │            │
│   │   Request    │────▶│   Code       │────▶│   API        │            │
│   └──────────────┘     └──────┬───────┘     └──────────────┘            │
│                               │                                         │
│                        ┌──────┴───────┐                                 │
│                        │ Skill Match? │                                 │
│                        └──────┬───────┘                                 │
│                               │ Yes                                     │
│                               ▼                                         │
│                    ┌─────────────────────┐                              │
│                    │  .claude/skills/    │                              │
│                    │  ├── skill-name/    │                              │
│                    │  │   └── SKILL.md   │ ← Loaded as instructions     │
│                    │  └── ...            │                              │
│                    └─────────────────────┘                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A Database Profiler skill that provides systematic data exploration with consistent structure.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Week 3 complete** - Familiar with MCP servers and external data sources
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **Repository cloned** - Access to `data/startup-funding.db`
- [ ] **Text editor ready** - For creating SKILL.md files

**Understanding helpful but not required:**
- YAML frontmatter syntax
- Basic SQL patterns from Week 2

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Create a skill directory structure with SKILL.md
2. Write effective skill descriptions that trigger automatically
3. Understand YAML frontmatter fields
4. Test that skills discover and execute correctly

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Create Skill Directory | 5 min |
| 1.2 | Write SKILL.md File | 15 min |
| 1.3 | Test the Skill | 10 min |
| | **TOTAL** | **30 min** |

---

## Understanding Skills

A skill is a folder with a SKILL.md file that teaches Claude a specific workflow. When your request matches a skill's description, Claude asks permission to use it and follows your instructions.

**Key concept:** Skills change how Claude thinks, not just what it can do. They load new instructions into Claude's context.

---

## Task 1.1: Create the Skill Directory (5 min)

1. **Create the skill folder:**
   ```bash
   mkdir -p .claude/skills/database-profiler
   ```

2. **Verify the location:**
   ```bash
   ls -la .claude/skills/
   ```

   You should see the `database-profiler` directory.

3. **Important:** Skills must be in `.claude/skills/` (not just `skills/` at the root).

---

## Task 1.2: Write the SKILL.md File (15 min)

1. **Create the SKILL.md file:**

   Open your editor and create `.claude/skills/database-profiler/SKILL.md` with this content:

   ```markdown
   ---
   name: database-profiler
   description: Profile SQLite databases to understand structure, quality, and statistics. Use when analyzing a new database, checking data quality, or exploring data before analysis.
   ---

   # Database Profiler

   When profiling a database, provide:

   ## 1. Structure Overview
   - List all tables
   - For each table: column names, data types, row count
   - Identify primary keys and foreign key relationships

   ## 2. Quality Assessment
   - Missing values per column (count and percentage)
   - Duplicate rows per table
   - Referential integrity issues (orphaned foreign keys)

   ## 3. Statistical Summary
   For numeric columns:
   - Min, max, mean, median
   - Standard deviation
   - Outlier candidates (beyond 3 std devs)

   For categorical columns:
   - Unique value count
   - Most common values (top 5)
   - Distribution skew

   For date columns:
   - Date range (earliest to latest)
   - Gaps or clustering

   ## 4. Recommendations
   Based on findings, suggest:
   - Data quality issues to address
   - Interesting patterns to explore
   - Next steps for analysis

   ## Context Management
   - Always use LIMIT when exploring individual tables
   - Start with aggregations before drilling down
   - Report row counts so analyst knows the scale

   ## Output Format

   Use markdown tables for statistics. Be concise but thorough.
   ```

2. **Save the file.**

3. **Understand the structure:**

   | Section | Purpose |
   |---------|---------|
   | YAML frontmatter | `name` and `description` for discovery |
   | Instructions | Step-by-step guidance for Claude |
   | Context Management | Guardrails for efficient execution |
   | Output Format | Consistent structure for results |

---

## Task 1.3: Test the Skill (10 min)

1. **Restart Claude Code** to pick up the new skill:
   ```bash
   # Exit and restart
   claude
   ```

2. **Trigger the skill with a matching request:**
   ```
   > Profile the startup-funding.db database
   ```

3. **Watch for these behaviors:**
   - Claude asks permission to use the `database-profiler` skill
   - Output follows the four-section structure
   - Queries use LIMIT and aggregations first
   - Tables are formatted in markdown

4. **Try variations that should also trigger:**
   ```
   > Check the data quality of startup-funding.db

   > Explore what data is in the funding database
   ```

5. **Record your results:**

| Request | Skill Triggered? | Output Followed Structure? |
|---------|------------------|---------------------------|
| "Profile the database" | | |
| "Check data quality" | | |
| "Explore the data" | | |

---

## Troubleshooting

### Skill Not Triggering

| Problem | Solution |
|---------|----------|
| Skill not discovered | Check it's in `.claude/skills/` (not `skills/`) |
| Wrong description | Add keywords users might say |
| Claude didn't ask permission | Restart Claude Code to reload skills |

### YAML Errors

| Problem | Solution |
|---------|----------|
| Invalid frontmatter | Use spaces, not tabs |
| Missing required fields | Add both `name` and `description` |
| Name format wrong | Use lowercase with hyphens only |

### Output Not Following Structure

| Problem | Solution |
|---------|----------|
| Missing sections | Add clearer section headers in SKILL.md |
| Wrong format | Include explicit examples in the skill |
| Too verbose | Add "Be concise" instruction |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Skill directory created** - Located at `.claude/skills/database-profiler/`
- [ ] **SKILL.md has valid YAML frontmatter** - Both `name` and `description` present
- [ ] **Skill triggers correctly** - Claude asks permission when request matches
- [ ] **Output follows structure** - Four sections (Structure, Quality, Statistics, Recommendations)
- [ ] **Context management works** - Queries use LIMIT and aggregations first

**Document your skill:**

| Element | Your Implementation |
|---------|---------------------|
| Skill name | |
| Trigger phrases that work | |
| Output sections generated | |

---

## Reference: YAML Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase, hyphens only (max 64 chars) |
| `description` | Yes | What + when (max 1024 chars) |
| `allowed-tools` | No | Restrict tools: `Read, Grep, Bash(python:*)` |
| `context` | No | `fork` for isolated sub-agent context |
| `hooks` | No | PreToolUse, PostToolUse, Stop handlers |

---

**End of Lab 1**
