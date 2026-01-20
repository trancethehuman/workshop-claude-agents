# AI for Data Science

An 8-week hands-on workshop teaching you to build AI agents for data analysis, visualization, predictive modeling, and business automation using Claude Code and Claude Agent SDK.

**Key insight:** Claude Code is not just for writing code. It's an agent that can analyze data, research companies, draft emails, process documents, and automate repetitive business tasks. This workshop teaches you to harness that power.

## Prerequisites

Before Week 1, complete the following:

### 1. Claude Pro Subscription

- Sign up at [claude.ai](https://claude.ai)
- Pro subscription required for Claude Code access

### 2. Development Environment

```bash
# Verify Node.js 18+
node --version

# Verify Git
git --version
```

### 3. Install Claude Code

```bash
# Install via npm
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### 4. Clone This Repo

```bash
cd workshop-claude-agents
```

### 5. Test Your Setup

```bash
# Start Claude Code
claude

# Ask it anything
> What files are in this repository?
```

If Claude responds with information about the repo, you're ready.

## Workshop Schedule

| Week | Topic            | Focus                                                |
| ---- | ---------------- | ---------------------------------------------------- |
| 1    | Overview & Setup | Agent engineering landscape, environment setup       |
| 2    | Tool Calling     | How Claude uses tools, web search, data fetching     |
| 3    | MCP Integration  | Connect to CRM, databases, external APIs             |
| 4    | Agent Skills     | Create reusable skills for data analysis & GTM       |
| 5    | Context Engineering | Sub-agents, RAG with Vectorize.io, memory patterns |
| 6    | Agent SDK        | Run agents headlessly at scale                       |
| 7    | Evals            | Measure and improve agent quality                    |
| 8    | Capstone         | Present projects, peer learning                      |

## Repository Structure

```
workshop-claude-agents/
  CLAUDE.md         # Project instructions for Claude
  README.md         # This file
  curriculum.md     # Full curriculum overview
  data/             # Sample datasets (leads, CRM)
  weeks/            # Session materials by week (week1-week8)
  references/       # Supporting documentation
  scripts/          # Setup and utility scripts
```

## Getting Help

- Office Hours: Scheduled weekly, check with facilitator for times
- Issues: Use GitHub Issues or contact the facilitator directly

## Facilitator

**Hai Nghiem**

- CEO @ AGI Ventures Canada Inc.
- LinkedIn: https://www.linkedin.com/in/haiphunghiem/
- GitHub: https://github.com/trancethehuman

## License

MIT
