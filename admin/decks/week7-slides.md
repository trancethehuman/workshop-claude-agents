---
marp: true
theme: default
paginate: true
---

# Week 7: Evals
## Measuring and Improving Agent Quality

---

# Session Goals

- Understand why evals are critical for agent development
- Build golden datasets for your use case
- Create eval runners to test agent behavior
- Iterate based on eval results

---

# Why Evals Matter

You can't improve what you don't measure.

**Without evals:**
- "It works on my machine"
- Manual testing for every change
- Regressions go unnoticed
- No objective quality bar

**With evals:**
- Automated quality checks
- Catch regressions before they ship
- Quantify improvements
- Build confidence in your agent

---

# The Problem: Non-Deterministic Outputs

Traditional software:
```
input("hello") → "hello"  (always)
```

Agents:
```
agent("Analyze this company") → ???
```

Different each time. How do you test that?

---

# The Solution: Define Success Criteria

Instead of expecting exact outputs, define what "good" looks like:

**For data analysis:**
- Must include at least 3 insights
- Insights must reference specific data
- Must include a recommendation

**For lead scoring:**
- Score must be 0-100
- Must cite at least 2 data points
- Must categorize as Hot/Warm/Cold

---

# Golden Datasets

A golden dataset is a collection of test cases with expected behavior.

```json
{
  "test_id": "basic-001",
  "input": "Query the database for AI startups",
  "pass_criteria": [
    "Must use Bash with sqlite3",
    "Must filter for AI/ML industry",
    "Must return at least 5 results"
  ]
}
```

---

# Types of Test Cases

**Basic functionality:**
- Can the agent complete simple tasks?
- Does it use the right tools?

**Edge cases:**
- How does it handle missing data?
- What if the database is empty?

**Complex scenarios:**
- Can it handle multi-step workflows?
- Does it maintain context across turns?

---

# Eval Runner Architecture

```
┌─────────────────────────────────────────────────┐
│ Eval Runner                                     │
│ 1. Load test cases from golden dataset          │
│ 2. For each test:                               │
│    - Send input to agent                        │
│    - Capture output                             │
│    - Check against pass criteria                │
│    - Record PASS/FAIL                           │
│ 3. Generate report                              │
└─────────────────────────────────────────────────┘
```

---

# Pass Criteria Types

**Contains check:**
```javascript
output.includes("Series A")
```

**Numeric range:**
```javascript
score >= 0 && score <= 100
```

**Tool usage:**
```javascript
usedTools.includes("Bash")
```

**Custom logic:**
```javascript
const insights = extractInsights(output);
return insights.length >= 3;
```

---

# Lab 1: Build a Golden Dataset

**Duration:** 45 minutes

**What you'll do:**
- Define 10 test cases for your agent
- Write pass criteria for each
- Include basic, edge, and complex scenarios
- Save as JSON

---

# **BREAK**
## 10 minutes

---

# Writing an Eval Runner

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for (const test of goldenDataset) {
  const result = await query({ prompt: test.input });

  const passed = test.passCriteria.every(
    criteria => evaluateCriteria(result, criteria)
  );

  results.push({
    testId: test.id,
    passed,
    output: result
  });
}

console.log(`Pass rate: ${passCount}/${total}`);
```

---

# Evaluating Outputs

**Structured outputs are easier to eval:**

```typescript
// Hard to eval: free text
"This company looks promising, maybe 70-80% score"

// Easy to eval: structured
{
  "score": 75,
  "category": "warm",
  "reasons": ["strong growth", "recent funding"]
}
```

Use JSON output when possible.

---

# Improving Based on Evals

**The iteration loop:**

1. Run evals → 60% pass rate
2. Analyze failures
3. Update skill/prompt/tools
4. Run evals → 75% pass rate
5. Repeat until satisfactory

Track pass rate over time. It should trend up.

---

# Common Failure Patterns

**Tool selection errors:**
- Agent uses Grep when it should use Bash
- Fix: Add examples to skill

**Missing context:**
- Agent doesn't reference data
- Fix: Add "cite specific data" to prompt

**Format violations:**
- Agent returns text when JSON expected
- Fix: Add schema to skill

---

# Lab 2: Build an Eval Runner

**Duration:** 45 minutes

**What you'll do:**
- Write TypeScript eval runner
- Run your golden dataset
- Generate pass/fail report
- Identify improvement opportunities

---

# Key Takeaways

1. **Evals = Quality Assurance** - You can't improve what you don't measure
2. **Golden Datasets** - Test cases with defined success criteria
3. **Pass Criteria** - Define "good" instead of expecting exact outputs
4. **Iterate** - Run evals, analyze failures, improve, repeat

---

# Homework

**Expand Your Eval Suite:**

1. Add 10 more test cases to your golden dataset
2. Focus on edge cases and failure modes
3. Run evals and track pass rate
4. Iterate on your agent until pass rate > 80%

Document:
- Initial pass rate
- Changes you made
- Final pass rate
- Example failures and how you fixed them

---

# Next Week Preview

**Week 8: Demo Day**
- Present your capstone project
- Show what you built
- Learn from others
- Celebrate!
