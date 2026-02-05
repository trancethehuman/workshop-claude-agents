---
marp: true
theme: default
paginate: true
---

# Week 6: Agent SDK
## Running Agents Programmatically

---

# Session Goals

- Understand when to use the Agent SDK vs CLI
- Run agents headlessly from TypeScript
- Build custom tools in code
- Create production workflows with streaming and session management

---

# CLI vs SDK: When to Use Which

**Claude Code CLI:**
- Interactive development work
- One-off tasks and experiments
- Terminal-based workflows

**Claude Agent SDK:**
- Building products on top of Claude
- Automation and batch processing
- Custom tools and integrations
- Production deployments

---

# Your First Agent SDK Script

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Analyze the startup funding database",
  options: { allowedTools: ["Read", "Bash"] }
})) {
  console.log(message.content);
}
```

That's it. Full agent loop with streaming.

---

# Streaming: Watch Your Agent Work

The SDK streams every message from Claude:

```typescript
for await (const message of query({ prompt: "..." })) {
  if (message.role === "assistant") {
    console.log("Claude:", message.content);
  }

  if (message.type === "tool_use") {
    console.log("Using tool:", message.name);
  }
}
```

You see thinking, tool calls, and results in real-time.

---

# Tool Permissions

Control which tools the agent can use:

```typescript
await query({
  prompt: "Analyze this data",
  options: {
    allowedTools: ["Read", "Bash(sqlite3:*)"],
    permissionMode: "acceptEdits"
  }
});
```

**Permission modes:**
- `default`: Prompts for approval
- `acceptEdits`: Auto-approves file edits
- `bypassPermissions`: No prompts (trusted environments only)

---

# Building Custom Tools

Define tools as TypeScript functions:

```typescript
import { tool } from "@anthropic-ai/claude-agent-sdk";

const customerLookup = tool({
  name: "customerLookup",
  description: "Look up customer info by email",
  schema: z.object({
    email: z.string().email()
  }),
  execute: async ({ email }) => {
    const customer = await db.customers.findByEmail(email);
    return JSON.stringify(customer);
  }
});
```

---

# Using Custom Tools

Pass tools to the query:

```typescript
await query({
  prompt: "Look up customer jane@example.com",
  options: {
    tools: [customerLookup]
  }
});
```

Claude automatically calls your tool when needed.

---

# Session Management

Sessions persist conversation state:

```typescript
const sessionId = await query({
  prompt: "Start analyzing company data",
  options: { sessionId: "company-analysis-123" }
});

// Later, continue the session
await query({
  prompt: "Now compare to last quarter",
  options: { sessionId }
});
```

---

# Lab 1: Set Up TypeScript Environment

**Duration:** 30 minutes

**What you'll do:**
- Initialize TypeScript project
- Install Agent SDK
- Write and run your first agent script
- Observe streaming output

---

# **BREAK**
## 10 minutes

---

# Batch Processing Pattern

Process multiple items efficiently:

```typescript
const leads = await readLeadsFile();

for (const lead of leads) {
  const result = await query({
    prompt: `Research ${lead.company} and score this lead`,
    options: {
      model: "haiku",  // Fast for simple tasks
      maxTurns: 5
    }
  });

  await saveResult(lead.id, result);
}
```

---

# Error Handling

Handle agent failures gracefully:

```typescript
try {
  const result = await query({ prompt: "..." });
} catch (error) {
  if (error.code === "max_turns_exceeded") {
    console.log("Agent hit turn limit, retrying...");
  } else if (error.code === "tool_execution_failed") {
    console.log("Tool failed:", error.message);
  }
}
```

---

# Hooks: Intercept Tool Calls

Add logging or validation:

```typescript
await query({
  prompt: "Process this data",
  options: {
    hooks: {
      onToolUse: (tool) => {
        console.log(`Using tool: ${tool.name}`);
        logToMonitoring(tool);
      }
    }
  }
});
```

---

# Production Considerations

**Sandboxing:**
- Run in isolated containers (Docker, Firecracker)
- Use `permissionMode: "bypassPermissions"` only in sandboxed environments
- Never run untrusted code on host system

**Monitoring:**
- Track token usage per session
- Log tool calls for debugging
- Monitor success/failure rates

---

# Lab 2: Build a Batch Processor

**Duration:** 45 minutes

**What you'll do:**
- Create a batch lead processor script
- Implement custom scoring tool
- Add error handling and retries
- Log results to CSV

---

# Key Takeaways

1. **SDK for Production** - Programmatic control, custom tools, automation
2. **Streaming** - Real-time visibility into agent actions
3. **Sessions** - Persist conversation state across calls
4. **Custom Tools** - Extend Claude with your business logic

---

# Homework

**Build a Production Pipeline:**

1. Choose a use case that needs batch processing:
   - GTM: Process 100 leads
   - Data: Analyze 50 datasets
   - Content: Generate 20 social posts

2. Implement with SDK:
   - Custom tools for your domain
   - Error handling
   - Progress logging
   - Output to structured format

---

# Next Week Preview

**Week 7: Evals**
- Measure and improve agent quality
- Build golden datasets
- Create eval runners
- Iterate based on results
