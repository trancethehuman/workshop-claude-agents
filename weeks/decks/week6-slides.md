---
marp: true
theme: default
paginate: true
---

# Week 6: Agent SDK
## Running Agents Programmatically

---

# Session Goals

- Understand the Claude Agent SDK architecture
- Use the `query()` function in TypeScript and Python
- Build headless agents for automation
- Deploy agents in sandboxed environments

---

# Why Run Agents Programmatically?

Claude Code is interactive. But for production:
- Need to run without human in the loop
- Need to process batches of tasks
- Need to integrate into existing systems

---

# SDK Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
│   const result = await query({ prompt: "..." });            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent SDK                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Tools   │  │Sessions │  │ Hooks   │  │  MCP    │        │
└─────────────────────────────────────────────────────────────┘
```

---

# The `query()` Function (TypeScript)

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Research Acme Corp and summarize findings",
  options: { maxTurns: 10 }
});
console.log(result.text);
```

---

# The `query()` Function (Python)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Research Acme Corp and summarize findings",
        options=ClaudeAgentOptions(max_turns=10)
    ):
        if hasattr(message, "result"):
            print(message.result)

asyncio.run(main())
```

---

# Key Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| prompt | string | The task for the agent |
| options.maxTurns | number | Maximum agentic loops |
| options.model | string | Model to use |

---

# More Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| options.tools | Tool[] | Available tools |
| options.mcpServers | McpServer[] | MCP connections |
| options.permissions | Permission[] | Auto-granted permissions |

---

# Model Selection

| Model | Best For | Cost |
|-------|----------|------|
| Sonnet 4.5 | Most agent work (default) | $$ |
| Opus 4.5 | Complex reasoning | $$$$ |
| Haiku | Fast, simple tasks | $ |

---

# Built-in Tools

| Tool | Purpose |
|------|---------|
| Read | Read files |
| Write | Write files |
| Bash | Execute commands |
| WebSearch | Search the web |

---

# Custom Tools with MCP

```typescript
const crmServer = createSdkMcpServer({
  name: "crm-tools",
  tools: [
    tool("search_crm", "Search CRM", { ... })
  ]
});
```

---

# When to Create Custom Tools

| Scenario | Example |
|----------|---------|
| Internal APIs | Company CRM, billing |
| Third-party | Stripe, Twilio, HubSpot |
| Specialized logic | Lead scoring algorithm |

---

# Lab 1: Your First SDK Agent

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

async function analyzeFile(filePath: string) {
  const result = await query({
    prompt: `Analyze the CSV file at ${filePath}`,
    options: { maxTurns: 5 }
  });
  return result.text;
}
```

---

# Sessions for Context Preservation

```typescript
import { query, Session } from "@anthropic-ai/claude-agent-sdk";

const session = new Session({
  systemPrompt: "You are a data analyst.",
});

await query({ prompt: "I'm working on leads.", session });
await query({ prompt: "What columns matter?", session });
```

---

# When to Use Sessions

| Scenario | Use Session? |
|----------|--------------|
| One-off task | No |
| Multi-step workflow | Yes |
| Batch processing (independent) | No |

---

# Streaming Responses

```typescript
for await (const message of query({
  prompt: "Research the top 5 CRM platforms",
  options: { maxTurns: 10 }
})) {
  if (message.type === 'text') {
    process.stdout.write(message.content);
  }
}
```

---

# Message Types in Stream

| Type | Description |
|------|-------------|
| text | Text being generated |
| tool_use | Tool being called |
| tool_result | Tool response |
| error | Error occurred |

---

# Permission Handling

```typescript
const result = await query({
  prompt: "Update the config file",
  options: {
    permissions: {
      allow: [{ tool: 'Read', pattern: '*' }],
      deny: [{ tool: 'Bash', pattern: 'rm:*' }],
    },
  }
});
```

---

# Error Handling

```typescript
try {
  const result = await query({ prompt: "Risky op..." });
} catch (error) {
  if (error instanceof ToolError) {
    console.error(`Tool failed: ${error.message}`);
  } else if (error instanceof AgentError) {
    console.error(`Agent error: ${error.message}`);
  }
}
```

---

# Lab 2: Headless Lead Enrichment

Build a service that enriches leads automatically:

```typescript
async function enrichLead(lead: Lead) {
  const result = await query({
    prompt: `Research ${lead.company}...`,
    options: { maxTurns: 8, tools: ['WebSearch'] }
  });
  return parseResult(result.text);
}
```

---

# Batch Processing with Concurrency

```typescript
async function enrichBatch(leads: Lead[], concurrency = 3) {
  for (let i = 0; i < leads.length; i += concurrency) {
    const batch = leads.slice(i, i + concurrency);
    await Promise.all(batch.map(enrichLead));
  }
}
```

---

# Sandboxing with Daytona

Run agents safely in isolated environments:

| Feature | Benefit |
|---------|---------|
| Isolated filesystems | Agents can't access host |
| Resource limits | CPU, memory, time |
| Code execution | Run Python, TypeScript, bash safely |
| Preview URLs | Expose web apps from sandbox |

---

# Creating a Daytona Sandbox

**Python:**
```python
from daytona_sdk import Daytona

daytona = Daytona()  # Uses DAYTONA_API_KEY env var
sandbox = daytona.create()
```

**TypeScript:**
```typescript
import { Daytona } from "@daytonaio/sdk";
const daytona = new Daytona();
const sandbox = await daytona.create({ language: "python" });
```

---

# Executing Code with `code_run()`

```python
# Execute Python code directly in sandbox
response = sandbox.process.code_run("""
import pandas as pd
df = pd.read_csv('/workspace/leads.csv')
print(f"Rows: {len(df)}")
print(df.describe())
""")
print(response.result)
```

---

# File Operations

```python
# Upload to sandbox
sandbox.fs.upload_file("leads.csv", "/workspace/leads.csv")

# Download from sandbox
sandbox.fs.download_file("/workspace/output.json", "./output.json")

# Preview URL for web apps
preview_url = sandbox.get_preview_link(3000)
```

---

# Claude + Daytona Pattern

```python
import anthropic
from daytona_sdk import Daytona

client = anthropic.Anthropic()
sandbox = Daytona().create()

# 1. Claude generates code
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[{"role": "user", "content": "Write Python to analyze leads.csv"}]
)

# 2. Execute in sandbox
response = sandbox.process.code_run(message.content[0].text)
print(response.result)
```

---

# When to Sandbox

| Scenario | Sandbox? |
|----------|----------|
| Development | No (direct is faster) |
| User-provided data | Yes (can't trust input) |
| Production pipelines | Yes (defense in depth) |
| Code generation | Yes (always sandbox) |

---

# Key Takeaways

1. `query()` works in TypeScript and Python
2. Sessions preserve context across queries
3. Stream for long-running tasks
4. Sandbox production agents with Daytona

---

# Homework

Build an automated report generator:
1. Reads a data file
2. Analyzes the data
3. Generates a markdown report
4. Saves to output folder

---

# Next Week Preview

**Week 7: Evals**
- Building tests to validate your agent
- Creating golden datasets
- Regression testing for production-ready AI
