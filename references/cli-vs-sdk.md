# Claude Code CLI vs Claude Agent SDK

A detailed comparison to help you choose the right approach for your use case.

## Claude Code CLI

The Claude Code CLI is a **complete product** that runs as a standalone executable.

### What It Is

- Full agent loop with built-in tools and permission management
- Interactive terminal interface for development work
- Can be scripted for automation via headless mode

### How to Use It

**Interactive mode:**
```bash
claude
```

**Headless mode (for automation):**
```bash
claude --dangerously-skip-permissions -p 'your task' --output-format stream-json
```

### Running in Sandboxes

For production automation, run Claude Code CLI inside isolated environments:

- **Daytona:** Easy sandbox provisioning for development environments
- **Docker:** Container-based isolation
- **Vercel/Koyeb:** Cloud sandbox environments

The sandbox provides:
- Filesystem restrictions
- Network controls
- Resource limits
- Process isolation

### Use Cases

- Interactive development and exploration
- CI/CD pipelines
- Giving users isolated "cloud computers"
- Running untrusted code safely
- Quick automation scripts

---

## Claude Agent SDK

The Claude Agent SDK is a **library** you embed in your own TypeScript or Python application.

### What It Is

- Same agent loop and tools that power Claude Code
- Programmatic control over the agent
- Ability to add custom tools as native functions
- Built-in streaming, hooks, and session management

### How to Use It

**Basic usage:**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const result = await query({
  prompt: "Analyze the sales data and identify top customers",
  options: {
    maxTurns: 10,
    allowedTools: ["Read", "Bash"],
  }
});

console.log(result.text);
```

**Streaming:**
```typescript
for await (const message of query({
  prompt: "Research competitor pricing",
  options: { maxTurns: 15 }
})) {
  if (message.type === 'text') {
    process.stdout.write(message.content);
  }
}
```

**Custom tools:**
```typescript
const customTools = [
  {
    name: "lookup_customer",
    description: "Look up customer by ID in our CRM",
    parameters: {
      type: "object",
      properties: {
        customerId: { type: "string" }
      }
    },
    execute: async (params) => {
      return await crm.getCustomer(params.customerId);
    }
  }
];

await query({
  prompt: "Get details for customer C-12345",
  options: { tools: customTools }
});
```

### Does It Need a Sandbox?

**Yes, for production use.**

The SDK itself does not provide isolation. It executes commands on whatever machine it runs on. For security:

- Run SDK inside sandboxed containers
- Use Daytona, Docker, or cloud sandbox services
- Implement proper permission controls

### Providing Files

Set the `cwd` (current working directory) and pre-populate with files:

```typescript
const options = {
  cwd: "/path/to/project",
  allowedTools: ["Read", "Write", "Bash"],
  permissionMode: 'acceptEdits'
};
```

You can:
- Pre-populate directories with files
- Mount volumes into containers
- Use session management to maintain state

### Use Cases

- Building products on top of Claude
- API servers with agent capabilities
- Custom workflows with approval hooks
- Production automation at scale
- Applications requiring custom tools

---

## Comparison Table

| Aspect | Claude Code CLI | Claude Agent SDK |
|--------|-----------------|------------------|
| **What it is** | Complete CLI tool | Library for your app |
| **Control** | Shell commands, parse output | Full programmatic control |
| **Custom tools** | MCP servers only | Native TS/Python functions |
| **Permissions** | `--dangerously-skip-permissions` | `permissionMode` + hooks |
| **Session state** | Managed externally | Built-in resumption |
| **Integration** | Treat as subprocess | First-class SDK |
| **Streaming** | Parse JSON output | Native streaming support |
| **Hooks** | Limited | Full lifecycle hooks |
| **Error handling** | Exit codes | Typed exceptions |

---

## Decision Guide

### Choose Claude Code CLI when:

- You want the full Claude Code experience isolated from your host
- Running in CI/CD pipelines
- Providing users with isolated development environments
- Quick scripting and automation
- Don't need custom tools beyond MCP

### Choose Claude Agent SDK when:

- Building a product or API server
- Need programmatic control over the agent loop
- Want to add custom tools as native functions
- Need to implement approval workflows via hooks
- Streaming responses directly to clients
- Managing sessions across requests

---

## Hybrid Approach

For some use cases, you might use both:

1. **SDK as orchestrator:** Your API server uses the SDK
2. **CLI in sandbox:** Each customer gets an isolated sandbox running CLI
3. **Best of both:** Programmatic control with full isolation

Example architecture:
```
User Request
    ↓
Your API (SDK for orchestration)
    ↓
Spawn Sandbox (Daytona/Docker)
    ↓
Run Claude Code CLI in sandbox
    ↓
Return results to user
```

---

## Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [Agent SDK Documentation](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Daytona Sandboxes](https://www.daytona.io/)
- [MCP Protocol](https://modelcontextprotocol.io)
