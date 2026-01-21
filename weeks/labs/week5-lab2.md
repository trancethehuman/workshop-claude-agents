# Week 5 Lab 2: Build a GTM Pipeline

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes (+ optional bonus)  
**Focus:** Building a multi-agent GTM pipeline with specialized agents and orchestration

---

## Lab Architecture

This lab builds a complete multi-agent pipeline for lead processing.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GTM Pipeline Architecture                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │                     Pipeline Skill                       │          │
│   │  "Process these leads through the pipeline"              │          │
│   └────────────────────────┬─────────────────────────────────┘          │
│                            │                                            │
│          ┌─────────────────┼─────────────────┐                          │
│          │                 │                 │                          │
│          ▼                 ▼                 ▼                          │
│   ┌────────────┐    ┌────────────┐    ┌────────────┐                    │
│   │ Enrichment │    │   Scorer   │    │   Writer   │                    │
│   │   Agent    │    │   Logic    │    │   Agent    │                    │
│   │            │    │            │    │            │                    │
│   │ Research   │    │ Score by   │    │ Draft      │                    │
│   │ companies  │    │ rubric     │    │ emails     │                    │ 
│   └────────────┘    └────────────┘    └────────────┘                    │
│         │                 │                 │                           │
│         ▼                 ▼                 ▼                           │
│   [JSON output]     [Score + reason]  [Email draft]                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A multi-agent GTM pipeline that enriches leads, scores them, and drafts personalized outreach.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 1 complete** - Custom agent created and tested
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **Repository cloned** - Access to `data/startup-funding.db`
- [ ] **Agents directory exists** - `.claude/agents/` created in Lab 1

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Create specialized agents for lead enrichment and email drafting
2. Design a pipeline skill that orchestrates multiple agents
3. Run the full pipeline with real data
4. Evaluate and iterate on pipeline quality

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 2.1 | Create Specialized Agents | 15 min |
| 2.2 | Design the Pipeline Skill | 15 min |
| 2.3 | Test the Pipeline | 10 min |
| 2.4 | Iterate and Improve | 5 min |
| | **TOTAL** | **45 min** |

---

## Task 2.1: Create Specialized Agents (15 min)

Build the agents that will power your pipeline.

1. **Create `.claude/agents/lead-enricher.md`:**

   ```markdown
   ---
   name: lead-enricher
   description: Enrich a lead with company research. Use when you need firmographic data about a company.
   model: haiku
   tools: ["Read", "WebSearch", "WebFetch"]
   ---

   # Lead Enricher

   Research the company and provide:

   1. **Company Size** - Employee count, revenue if public
   2. **Industry** - Primary industry and sub-vertical
   3. **Recent News** - Funding, product launches, leadership changes
   4. **Key People** - Decision makers relevant to our product
   5. **Tech Stack** - Known technologies they use

   Output as structured JSON:
   ```json
   {
     "company": "...",
     "size": "...",
     "industry": "...",
     "news": ["..."],
     "key_people": ["..."],
     "tech_stack": ["..."]
   }
   ```
   ```

2. **Create `.claude/agents/email-drafter.md`:**

   ```markdown
   ---
   name: email-drafter
   description: Draft personalized outreach emails based on lead data. Use when you have enriched lead info and need to create outreach.
   model: sonnet
   tools: ["Read", "Write"]
   ---

   # Email Drafter

   Write a short, personalized outreach email:

   1. Reference something specific about their company (from research)
   2. Connect to a pain point relevant to their industry/size
   3. Clear, low-friction call to action
   4. Under 100 words

   Be conversational, not salesy. No generic openers like "I hope this email finds you well."
   ```

3. **Note the different models:**

   | Agent | Model | Why |
   |-------|-------|-----|
   | lead-enricher | haiku | Fast research, data gathering |
   | email-drafter | sonnet | Better writing quality needed |

---

## Task 2.2: Design the Pipeline Skill (15 min)

Create a skill that orchestrates the agents.

1. **Create the skill directory:**
   ```bash
   mkdir -p .claude/skills/lead-pipeline
   ```

2. **Create `.claude/skills/lead-pipeline/SKILL.md`:**

   ```markdown
   ---
   name: lead-pipeline
   description: Process leads through enrichment, scoring, and email drafting. Use when processing a batch of leads or running the full GTM pipeline.
   ---

   # Lead Processing Pipeline

   This skill orchestrates multiple specialized agents to process leads.

   ## Pipeline Stages

   ### Stage 1: Enrichment
   For each lead, research the company:
   - Company size and industry
   - Recent news and announcements
   - Key decision makers
   - Technology stack (if B2B tech)

   Use the lead-enricher agent for each company.

   ### Stage 2: Scoring
   Score each enriched lead based on:
   - Company size (larger = higher score)
   - Industry fit (AI/ML, Developer Tools = higher)
   - Funding stage (Series A-C = higher)
   - Recent activity (news, growth signals)

   Score from 0-100. Only proceed with leads scoring 60+.

   ### Stage 3: Email Drafting
   For leads scoring 60+, use the email-drafter agent to create personalized outreach:
   - Reference specific company details
   - Address likely pain points
   - Clear call to action

   ## Execution

   Process leads sequentially or in small batches (3-5) to manage context.

   ## Output Format

   | Lead | Company | Enrichment Summary | Score | Email Draft |
   |------|---------|-------------------|-------|-------------|
   | ... | ... | ... | ... | ... |

   Save detailed results to `output/pipeline-results.json`
   ```

---

## Task 2.3: Test the Pipeline (10 min)

1. **Restart Claude Code:**
   ```bash
   claude
   ```

2. **Run the pipeline with database data:**
   ```
   > Query the funding database for AI startups that raised Series A in 2024.
   > Pick the top 3 by funding amount and run them through the lead pipeline.
   ```

3. **Watch the pipeline execute:**
   - Database query for candidates
   - Sub-agents spawn for enrichment
   - Scoring applied to each lead
   - Emails drafted for qualifying leads

4. **Record the pipeline results:**

| Company | Enrichment Found | Score | Email Drafted? |
|---------|------------------|-------|----------------|
| | | | |
| | | | |
| | | | |

---

## Task 2.4: Iterate and Improve (5 min)

Based on your results, identify improvements:

1. **Check enrichment quality:**
   - Did the agent find accurate company info?
   - Were there gaps in the research?

2. **Review scoring logic:**
   - Are the criteria appropriate for your use case?
   - Should weights be adjusted?

3. **Evaluate email drafts:**
   - Are they personalized enough?
   - Is the tone right?
   - Is the CTA clear?

4. **Document one improvement** you would make:

| Issue | Proposed Change |
|-------|-----------------|
| | |

---

## Troubleshooting

### Pipeline Issues

| Problem | Solution |
|---------|----------|
| Too many API calls | Batch similar tasks (e.g., enrich 3-5 leads at once) |
| Inconsistent output | Add explicit output format to agent instructions |
| Missing data | Check agent has required tools (WebSearch for research) |

### Agent Coordination Issues

| Problem | Solution |
|---------|----------|
| Agents not chaining | Ensure skill explicitly references agents by name |
| Output format mismatch | Standardize JSON schemas across agents |
| Scoring inconsistent | Add explicit examples to scoring criteria |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Pipeline agents created** - lead-enricher and email-drafter defined
- [ ] **Pipeline skill created** - lead-pipeline orchestrates the workflow
- [ ] **Pipeline tested** - Processed 3+ leads through full pipeline
- [ ] **Results documented** - Recorded enrichment, scores, and emails
- [ ] **Improvement identified** - Documented one enhancement

**Document your agent stack:**

| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| lead-enricher | | | |
| email-drafter | | | |

---

## Reference: Task Tool Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `prompt` | Yes | Task for the sub-agent |
| `description` | Yes | Short summary (3-5 words) |
| `subagent_type` | Yes | Which agent type to use |
| `model` | No | Override model |
| `run_in_background` | No | Run asynchronously |
| `resume` | No | Continue from previous execution |

---

**End of Lab 2**
