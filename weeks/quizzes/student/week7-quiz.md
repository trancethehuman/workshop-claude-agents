# Kahoot: Week 7 - Evals

## Question 1: Why are evals essential for AI agents?

- ☐ They make agents run faster
- ☐ They reduce the cost of API calls
- ☐ You can't improve what you don't measure — evals catch regressions and quantify improvements
- ☐ They are required by the Claude API to deploy agents

## Question 2: What is the core challenge of evaluating AI agent outputs?

- ☐ Agents produce too much output to review
- ☐ Agent outputs are always in different languages
- ☐ Agents produce non-deterministic outputs — different results each time
- ☐ Agents can only produce text, not structured data

## Question 3: What is a "golden dataset" in the context of evals?

- ☐ A dataset containing only correct, validated real-world data
- ☐ A premium dataset that costs extra to access
- ☐ A collection of test cases with inputs and expected behavior criteria
- ☐ A dataset curated by gold-standard domain experts

## Question 4: Which of these is a valid pass criteria type for evals?

- ☐ Exact string match only
- ☐ Human review score only
- ☐ Contains check, numeric range, tool usage verification, or custom logic
- ☐ Response time measurement only

## Question 5: What are the three types of test cases recommended for a golden dataset?

- ☐ Unit tests, integration tests, end-to-end tests
- ☐ Speed tests, accuracy tests, cost tests
- ☐ Basic functionality, edge cases, and complex scenarios
- ☐ Input tests, output tests, and format tests

## Question 6: If your eval runner shows a 60% pass rate, what should you do next?

- ☐ Delete the failing tests since the agent is probably correct
- ☐ Retrain the language model from scratch
- ☐ Analyze failure patterns, update skills/prompts/tools, then re-run evals
- ☐ Increase the model's temperature to get more varied outputs

## Question 7: What is a common fix for "tool selection errors" found through evals?

- ☐ Remove the tools the agent misuses
- ☐ Increase the context window size
- ☐ Add examples to the skill showing which tool to use in specific situations
- ☐ Switch to a completely different language model

## Question 8: Why are structured outputs (like JSON) preferred over free text for evals?

- ☐ JSON is faster for the agent to generate
- ☐ Free text uses more tokens than JSON
- ☐ Structured outputs are easier to evaluate programmatically with specific, measurable criteria
- ☐ JSON is the only format the eval runner can parse
