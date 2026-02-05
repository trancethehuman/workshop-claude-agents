# Kahoot: Week 4 - Agent Skills

## Question 1: What is the best analogy for Skills in the context of Claude agents?

- ☐ Plugins that add new tools
- ☐ Templates for generating code
- ☒ Standard Operating Procedures (SOPs) that change how Claude thinks
- ☐ Configuration files for API connections

## Question 2: What is the key difference between a Skill and a Tool?

- ☐ Skills are faster, Tools are more accurate
- ☐ Skills cost more tokens than Tools
- ☒ Tools execute and return results; Skills prepare the agent to solve a problem
- ☐ Tools are written in YAML; Skills are written in JSON

## Question 3: What is the #1 anti-pattern when creating skills?

- ☐ Making skills too short
- ☐ Using YAML frontmatter
- ☒ Asking AI to create a skill from scratch instead of starting from your working process
- ☐ Including examples in the skill file

## Question 4: What is the recommended maximum length for a SKILL.md file?

- ☐ 100 lines
- ☐ 250 lines
- ☒ 500 lines
- ☐ 1,000 lines

## Question 5: What does the "context: fork" option do in a skill's YAML frontmatter?

- ☐ Creates a backup copy of the conversation
- ☐ Splits the skill into two separate files
- ☒ Runs the skill in an isolated sub-agent context
- ☐ Forks the Git repository before running

## Question 6: Which platforms support the SKILL.md format as an open standard?

- ☐ Only Claude Code
- ☐ Claude Code and GitHub Copilot only
- ☒ Claude, GitHub Copilot, OpenAI Codex CLI, Cursor, Gemini CLI, and others
- ☐ All LLM platforms without exception

## Question 7: What is "progressive disclosure" in the context of skills?

- ☐ Gradually revealing the answer to the user
- ☐ Showing loading progress bars during execution
- ☒ Keeping SKILL.md lean and loading detailed reference files only when needed
- ☐ Teaching the agent step by step over multiple sessions

## Question 8: Where should detailed reference information go when building a skill?

- ☐ Directly in the SKILL.md file
- ☐ In the system prompt
- ☒ In a references/ directory loaded on-demand
- ☐ In environment variables
