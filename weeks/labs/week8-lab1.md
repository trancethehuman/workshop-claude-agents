# Week 8 Lab 1: Structure Your Demo

**Course:** Claude Agents Workshop  
**Duration:** 20 minutes  
**Focus:** Creating a demo outline and talking points for your capstone presentation

---

## Lab Architecture

This lab prepares your demo structure and talking points.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Demo Structure Flow                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐               │
│   │ The Problem │────▶│ The Solution│────▶│  Live Demo  │               │
│   │   (30 sec)  │     │   (1 min)   │     │  (2.5 min)  │               │
│   └─────────────┘     └─────────────┘     └─────────────┘               │
│                                                   │                     │
│                                                   ▼                     │
│                                           ┌─────────────┐               │
│                                           │  Learnings  │               │
│                                           │   (1 min)   │               │
│                                           └─────────────┘               │
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │ Key Insight: Your opening line sets the tone. Lead with the    │    │
│   │ impact, not the technology.                                    │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A 5-minute demo outline with clear sections and a compelling opening.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Capstone agent completed** - Your agent from Weeks 1-7 is working
- [ ] **Evals passing** - At least 3 of 5 test cases from Week 7
- [ ] **Sample data prepared** - Real or realistic test inputs for your demo
- [ ] **Notes ready** - What your agent does and why it matters

**Bring to this lab:**
- Your working agent (Claude Code skill, SDK script, or sub-agent system)
- Notes on key capabilities and limitations
- Ideas for what to demonstrate

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Understand the 5-minute demo format
2. Create a complete demo outline with all sections
3. Write a compelling opening line
4. Prepare talking points for each section

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Complete Your Demo Outline | 15 min |
| 1.2 | Write Your Opening Line | 5 min |
| | **TOTAL** | **20 min** |

---

## Demo Format

You have **5 minutes** for your presentation plus **2 minutes** for Q&A.

| Section | Time | Content |
|---------|------|---------|
| The Problem | 30 sec | What workflow are you automating? Who benefits? |
| The Solution | 1 min | High-level architecture, key components |
| Live Demo | 2.5 min | Show the agent working on a real use case |
| Learnings | 1 min | What worked, what was hard, what you'd change |

---

## Task 1.1: Complete Your Demo Outline (15 min)

Fill out this template for your presentation:

```markdown
# [Your Agent Name] Demo

## The Problem (30 sec)
- I'm solving: _______________________________________________
- This helps: ________________________________________________
- Before my agent: ___________________________________________

## The Solution (1 min)
- Architecture: [Skills / MCP / Sub-agents / SDK]
- Key components:
  1. _______________________________________________________
  2. _______________________________________________________
  3. _______________________________________________________

## Live Demo (2.5 min)
- I'll show: _________________________________________________
- Sample input: ______________________________________________
- Expected output: ___________________________________________
- Backup if live fails: _______________________________________

## Learnings (1 min)
- What worked well: __________________________________________
- What was challenging: ______________________________________
- What I'd do differently: ____________________________________
```

Save this as `demo-outline.md` in your project folder.

### Section Guidelines

**The Problem (30 sec)**
- Be specific about who experiences this problem
- Quantify if possible ("3 hours per week", "200 tickets per day")
- Make it relatable to your audience

**The Solution (1 min)**
- Name the architecture pattern you used
- List 2-3 key components (skills, MCP servers, agents)
- Don't go into code details yet

**Live Demo (2.5 min)**
- Pick ONE compelling use case
- Show real input → agent working → output
- Have a backup plan ready

**Learnings (1 min)**
- Be honest about challenges
- Share one insight others could learn from
- Mention what you'd do differently with more time

---

## Task 1.2: Write Your Opening Line (5 min)

Your opening line sets the tone. Write a single sentence that explains why your agent matters.

**Bad openings:**
- "So, um, I built this agent that kind of does some stuff..."
- "This is my project. It uses Claude Code."
- "I'm sorry this isn't more polished, but..."

**Good openings:**
- "Every week I spend 3 hours enriching leads manually. My agent does it in 3 minutes."
- "Our team gets 200 support tickets daily. This agent routes and drafts responses automatically."
- "I read 50 articles a week to stay current. This agent summarizes them for me."

**Template:**
"[Time/effort spent on problem]. [My agent does X]."

**Your opening line:**
```
___________________________________________________________
___________________________________________________________
```

Write it down. Memorize it. This is how you'll start your demo.

---

## Troubleshooting

### Outline Issues

| Problem | Solution |
|---------|----------|
| Can't articulate the problem | Think about what you did manually before the agent |
| Too many things to show | Pick the ONE most impressive capability |
| Demo takes too long | Remove explanation, let the output speak |
| Not sure what to say | Read your outline aloud, adjust to natural speech |

### Opening Line Issues

| Problem | Solution |
|---------|----------|
| Sounds generic | Add specific numbers or time saved |
| Too technical | Lead with the human impact, not the tech |
| Too long | Cut to one sentence, max two |
| Can't remember it | Write it on a sticky note, practice 5x |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Demo outline created** - All four sections filled in
- [ ] **Opening line written** - Compelling, specific, memorized
- [ ] **Sample input chosen** - Realistic data for the demo
- [ ] **Expected output documented** - Know what success looks like
- [ ] **Backup plan ready** - What to show if live demo fails
- [ ] **File saved** - `demo-outline.md` in project folder

**Document your demo structure:**

| Element | Your Implementation |
|---------|---------------------|
| Opening line | |
| Architecture type | |
| Key capability shown | |
| Backup plan | |

---

## Reference: Example Project Showcases

These examples show what participants have built:

### GTM / Sales

| Project | Stack | Description |
|---------|-------|-------------|
| Lead Enrichment Pipeline | Sub-agents + WebSearch | Enriches and scores inbound leads |
| Email Sequence Generator | Skills + Gmail MCP | Creates personalized outreach |
| CRM Sync Agent | SDK + HubSpot MCP | Keeps CRM data consistent |

### Developer Tools

| Project | Stack | Description |
|---------|-------|-------------|
| Code Review Bot | GitHub MCP + Skills | Reviews PRs and suggests fixes |
| Documentation Generator | SDK + Repo tools | Creates docs from code |
| Dependency Auditor | Sub-agents + npm/pip | Flags outdated packages |

### Content / Marketing

| Project | Stack | Description |
|---------|-------|-------------|
| Content Repurposer | Skills + Google Docs MCP | Turns blog posts into social threads |
| SEO Analyzer | WebSearch + Skills | Audits pages and suggests improvements |
| Newsletter Curator | Sub-agents + RSS | Aggregates and summarizes industry news |

### Operations / Data

| Project | Stack | Description |
|---------|-------|-------------|
| Invoice Processor | Skills + Google Sheets | Extracts data from PDF invoices |
| Data Quality Monitor | Skills + Evals | Profiles CSVs and flags issues |
| Compliance Checker | Sub-agents + Notion MCP | Audits records against policy rules |

---

**End of Lab 1**
