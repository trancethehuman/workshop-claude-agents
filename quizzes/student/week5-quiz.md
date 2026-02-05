# Kahoot: Week 5 - Context Engineering (Sub-agents & RAG)

## Question 1: What is the main problem with using a single agent for complex tasks?

- ☐ Single agents are slower than multiple agents
- ☐ Single agents can only use one tool at a time
- ☐ The context window fills up, focus dilutes, and errors cascade
- ☐ Single agents cannot access the internet

## Question 2: What does it mean that sub-agents are "black boxes" to the main agent?

- ☐ Their code is encrypted and cannot be read
- ☐ They run on a different server
- ☐ The main agent delegates tasks and sees only the results, not the intermediate steps
- ☐ They cannot communicate with external services

## Question 3: What are the three ways to create sub-agents in Claude Code?

- ☐ API calls, webhooks, and CLI commands
- ☐ Built-in types, filesystem-based agents (AGENT.md), and programmatic agents (Agent SDK)
- ☐ Scripts, plugins, and extensions
- ☐ Docker containers, serverless functions, and microservices

## Question 4: Can sub-agents spawn their own sub-agents?

- ☐ Yes, up to 3 levels deep
- ☐ Yes, with no limit
- ☐ No, sub-agents are single level only
- ☐ Yes, but only if they use the Agent SDK

## Question 5: In a parallel workflow pattern, what happens to the outputs of multiple agents?

- ☐ Only the fastest agent's output is used
- ☐ Outputs are averaged together
- ☐ Results from all parallel agents are combined
- ☐ Each output is sent to the user separately

## Question 6: What is the key difference between traditional RAG and agentic RAG?

- ☐ Agentic RAG uses larger vector databases
- ☐ Traditional RAG is more accurate
- ☐ In agentic RAG, the agent decides when to retrieve and can reformulate queries iteratively
- ☐ Agentic RAG doesn't use embeddings

## Question 7: Where are filesystem-based agent configurations stored?

- ☐ In the package.json file
- ☐ In the .env file
- ☐ In AGENT.md files inside .claude/agents/
- ☐ In the MCP configuration

## Question 8: Which is an anti-pattern when designing multi-agent systems?

- ☐ Giving each agent a clear, focused purpose
- ☐ Defining well-structured inputs and outputs
- ☐ Creating too many tiny agents or agents that do "everything"
- ☐ Minimizing overlap between agents
