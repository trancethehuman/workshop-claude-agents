# Kahoot: Week 6 - Agent SDK (TypeScript)

## Question 1: When should you use the Agent SDK instead of the Claude Code CLI?

- ☐ When you want to chat interactively with Claude
- ☐ When you need to run one-off tasks from the terminal
- ☐ When building products, automation, batch processing, or production systems
- ☐ When you want to avoid writing any code

## Question 2: What does the `bypassPermissions` tool permission mode do?

- ☐ Prompts the user before every tool call
- ☐ Auto-approves only file edits
- ☐ Auto-approves all tool calls — should only be used in sandboxed environments
- ☐ Blocks all dangerous tool calls entirely

## Question 3: How do you define a custom tool in the Agent SDK?

- ☐ Write a YAML configuration file
- ☐ Register it through the MCP protocol
- ☐ Define a TypeScript function with a Zod schema for input validation
- ☐ Add it to the CLAUDE.md file

## Question 4: What is the purpose of Session Management in the Agent SDK?

- ☐ To track how long the agent has been running
- ☐ To manage API rate limits
- ☐ To persist conversation state across multiple calls
- ☐ To handle user authentication

## Question 5: What does the Streaming API let you do?

- ☐ Stream video content to the agent
- ☐ Process files in chunks to save memory
- ☐ Watch your agent work in real-time as it processes
- ☐ Send data to multiple agents simultaneously

## Question 6: Which tool permission mode auto-approves file edits but prompts for everything else?

- ☐ `default`
- ☐ `acceptEdits`
- ☐ `bypassPermissions`
- ☐ `readOnly`

## Question 7: What is a key production consideration when running Agent SDK agents?

- ☐ Always run without sandboxing for maximum speed
- ☐ Disable all error handling to reduce complexity
- ☐ Run in Docker with sandboxing and monitor token usage and success/failure rates
- ☐ Use the largest model for every task regardless of complexity

## Question 8: What are Hooks in the Agent SDK used for?

- ☐ Connecting to webhooks from external services
- ☐ Scheduling agents to run at specific times
- ☐ Intercepting tool calls for logging, validation, or custom behavior
- ☐ Managing Git hooks for version control
