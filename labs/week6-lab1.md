# Week 6 Lab 1: Your First SDK Agent

**Course:** Claude Agents Workshop  
**Duration:** 30 minutes  
**Focus:** Setting up the Agent SDK and building a Database Analyzer agent

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This lab demonstrates how to run Claude agents programmatically using the Agent SDK.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Agent SDK Architecture                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                    Your Application                          │      │
│   │                                                              │      │
│   │   const result = await query({                               │      │
│   │     prompt: "Analyze this data",                             │      │
│   │     options: { tools, permissions, ... }                     │      │
│   │   });                                                        │      │
│   └─────────────────────────────┬────────────────────────────────┘      │
│                                 │                                       │
│                                 ▼                                       │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                    Agent SDK                                 │      │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │      │
│   │  │ Tools   │  │Sessions │  │ Hooks   │  │  MCP    │          │      │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │      │
│   └─────────────────────────────┬────────────────────────────────┘      │
│                                 │                                       │
│                                 ▼                                       │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                    Claude API                                │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A Database Analyzer agent that explores SQLite databases and produces structured reports.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Week 5 complete** - Familiar with sub-agents and multi-agent patterns
- [ ] **Node.js 18+** (for TypeScript) OR **Python 3.9+** - Run `node --version` or `python --version`
- [ ] **Anthropic API key** - Set as `ANTHROPIC_API_KEY` environment variable
- [ ] **Repository cloned** - Access to `data/startup-funding.db`

**Choose your language:**
- TypeScript: npm/yarn installed
- Python: pip/venv available

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Set up the Agent SDK in TypeScript or Python
2. Build a Database Analyzer agent using `query()`
3. Understand tool callbacks and logging
4. Run an agent programmatically

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Set Up the Project | 10 min |
| 1.2 | Build the Database Analyzer | 15 min |
| 1.3 | Run and Test | 5 min |
| | **TOTAL** | **30 min** |

---

## Task 1.1: Set Up the Project (10 min)

Choose TypeScript or Python and set up your project.

### Option A: TypeScript Setup

1. **Create the project:**
   ```bash
   mkdir -p agents/database-analyzer
   cd agents/database-analyzer
   npm init -y
   npm install @anthropic-ai/claude-agent-sdk typescript ts-node zod
   npx tsc --init
   ```

2. **Create the directory structure:**
   ```bash
   mkdir src
   ```

3. **Verify installation:**
   ```bash
   npx ts-node --version
   ```

### Option B: Python Setup

1. **Create the project:**
   ```bash
   mkdir -p agents/database-analyzer
   cd agents/database-analyzer
   python -m venv venv

   # macOS/Linux:
   source venv/bin/activate
   # Windows PowerShell:
   venv\Scripts\Activate.ps1
   # Windows CMD:
   venv\Scripts\activate.bat
   pip install claude-agent-sdk pandas
   ```

2. **Verify installation:**
   ```bash
   python -c "from claude_agent_sdk import query; print('SDK installed')"
   ```

---

## Task 1.2: Build the Database Analyzer (15 min)

Create an agent that analyzes SQLite databases and produces structured reports.

### TypeScript (`src/index.ts`):

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

interface AnalysisResult {
  text: string;
  toolCalls: number;
}

async function analyzeDatabase(dbPath: string): Promise<AnalysisResult> {
  let toolCalls = 0;

  const result = await query({
    prompt: `Analyze the SQLite database at ${dbPath}. Provide:
    1. List of tables and row counts
    2. Schema for each table (columns and types)
    3. Summary statistics for numeric columns
    4. Key relationships between tables`,
    options: {
      maxTurns: 5,
      onToolCall: (tool) => {
        toolCalls++;
        console.log(`[Tool] ${tool.name}`);
      }
    }
  });

  return {
    text: result.text,
    toolCalls
  };
}

// Run the analyzer
async function main() {
  console.log('Starting database analysis...\n');

  const result = await analyzeDatabase('../../data/startup-funding.db');

  console.log('\n=== Analysis Result ===\n');
  console.log(result.text);
  console.log(`\nTotal tool calls: ${result.toolCalls}`);
}

main().catch(console.error);
```

### Python (`analyzer.py`):

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def analyze_database(db_path: str) -> dict:
    """Analyze a SQLite database and return structured results."""
    tool_calls = 0
    result_text = ""

    prompt = f"""Analyze the SQLite database at {db_path}. Provide:
    1. List of tables and row counts
    2. Schema for each table (columns and types)
    3. Summary statistics for numeric columns
    4. Key relationships between tables"""

    async for message in query(
        prompt=prompt,
        options=ClaudeAgentOptions(
            max_turns=5,
            allowed_tools=["Read", "Bash", "Glob"]
        )
    ):
        if message.type == "tool_use":
            tool_calls += 1
            print(f"[Tool] {message.name}")
        if hasattr(message, "result"):
            result_text = message.result

    return {
        "text": result_text,
        "tool_calls": tool_calls
    }

async def main():
    print('Starting database analysis...\n')

    result = await analyze_database('../../data/startup-funding.db')

    print('\n=== Analysis Result ===\n')
    print(result["text"])
    print(f'\nTotal tool calls: {result["tool_calls"]}')

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Task 1.3: Run and Test (5 min)

1. **Run your analyzer:**

   **TypeScript:**
   ```bash
   npx ts-node src/index.ts
   ```

   **Python:**
   ```bash
   python analyzer.py
   ```

2. **Observe the output:**
   - Watch the tool call logs
   - Note how many turns the agent needed
   - Check that the analysis is complete

3. **Record your results:**

| Metric | Your Result |
|--------|-------------|
| Total tool calls | |
| Tools used | |
| Turns to complete | |
| Analysis sections covered | |

---

## Troubleshooting

### SDK Installation Issues

| Problem | Solution |
|---------|----------|
| `Module not found` error | Verify package installed: `npm list` or `pip list` |
| TypeScript compilation errors | Check `tsconfig.json` has `"esModuleInterop": true` |
| Python import errors | Ensure virtual environment is activated |

### API & Authentication Issues

| Problem | Solution |
|---------|----------|
| `API key not set` | Export `ANTHROPIC_API_KEY` environment variable |
| Rate limiting | Add delays between requests, reduce concurrency |
| Permission denied | Check `dangerouslyAllowAllTools` or permissions config |

### Execution Issues

| Problem | Solution |
|---------|----------|
| Tool calls fail | Verify tools are in allowed list |
| JSON parsing fails | Agent output may not be clean JSON; add error handling |
| Timeout errors | Increase `maxTurns` or simplify the task |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **SDK installed** - TypeScript or Python
- [ ] **Project structure created** - Directory and files in place
- [ ] **`query()` function works** - Agent receives prompts
- [ ] **Tool callbacks log correctly** - See [Tool] messages
- [ ] **Database analysis completes** - All 4 sections covered

**Document your setup:**

| Element | Your Implementation |
|---------|---------------------|
| Language used | |
| SDK version | |
| Tools enabled | |
| Output quality | |

---

## Reference: SDK Key Functions

### TypeScript

```typescript
import { query, Session } from "@anthropic-ai/claude-agent-sdk";

// Basic query
const result = await query({
  prompt: "Your task here",
  options: {
    maxTurns: 10,
    tools: ['Read', 'Write', 'Bash', 'WebSearch'],
    onToolCall: (tool) => console.log(tool.name),
  }
});

// With session (for multi-turn)
const session = new Session({
  systemPrompt: "You are a specialist...",
});

await query({ prompt: "First task", session });
await query({ prompt: "Follow-up", session });
```

### Python

```python
from claude_agent_sdk import query, ClaudeAgentOptions

# Basic query (streaming)
async for message in query(
    prompt="Your task here",
    options=ClaudeAgentOptions(
        max_turns=10,
        allowed_tools=["Read", "Write", "Bash"]
    )
):
    if hasattr(message, "result"):
        print(message.result)
```

---

## Reference: Model Selection

| Model | Use Case | Cost |
|-------|----------|------|
| `claude-sonnet-4-5-20250514` | Most agent work (default) | $$ |
| `claude-opus-4-5-20250514` | Complex reasoning | $$$$ |
| `claude-haiku-3-5-20241022` | Fast, simple tasks | $ |

---

**End of Lab 1**
