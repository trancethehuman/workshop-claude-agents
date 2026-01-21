---
marp: true
theme: default
paginate: true
---

# Week 7: Evals
## Testing Your Agent Before Demo Day

---

# Session Goals

- Understand why you need to test your agent
- Create a "golden dataset" of 5 input/output pairs
- Run your agent against real test cases

---

# The Problem

Traditional software: input → same output every time

AI agents: input → different output each time

How do you test that?

---

# The Solution: A Golden Dataset

A list of inputs you expect your agent to handle, paired with outputs you'd consider "good enough."

That's it. No infrastructure.

---

# Example Golden Dataset

| Input | What Good Looks Like |
|-------|---------------------|
| "Score this lead: VP at 500-person tech" | Score 70-90, mentions seniority |
| "Summarize this 3-page PDF" | Main points, under 200 words |
| "Classify this support ticket" | Correct category, priority |

---

# Why Off-the-Shelf Evals Don't Work

| Off-the-Shelf Eval | Why It Fails |
|-------------------|--------------|
| "Helpfulness score 1-10" | What does "helpful" mean for YOU? |
| "Coherence rating" | Could be coherent but wrong |
| "Safety check" | Passes safety, gives bad advice |

---

# Generic Metrics = False Confidence

Your agent could score 95% on a generic eval and still be useless for your actual workflow.

---

# The Right Approach

1. Run your agent 20-50 times on real inputs
2. Manually look at the outputs
3. Ask: "Would I accept this from a human?"

---

# Define YOUR Pass/Fail Criteria

Not "good summary" but "captures the 3 main points."

Be specific. Write it down.

---

# Create 5 Input/Output Pairs

- Pick 5 representative inputs from your domain
- For each, write what a "passing" output looks like
- Include at least one edge case

---

# Use Binary Pass/Fail, Not Scales

| Approach | Problem |
|----------|---------|
| "Rate this 1-10" | What's the difference between 6 and 7? |
| "Pass or fail?" | Clear, actionable, comparable |

---

# If You Use LLM-as-Judge

**Always require reasoning BEFORE the verdict.**

```
Bad:  "Pass: true"

Good: "The output correctly identified the company size...
      However, it failed to note industry fit.
      Verdict: FAIL"
```

---

# Don't Aim for 100% Pass Rate

> "A 70% pass rate might indicate you're testing meaningful things. A 100% pass rate might mean your tests are too easy."

---

# Lab 1: Create Your Golden Dataset

Create `golden-dataset.md`:

```markdown
# Golden Dataset for [Your Agent]

## Test Case 1: [Name]
**Input:** [What you'll give the agent]
**Expected Output:** [What "good" looks like]
**Pass Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
```

---

# Fill in 5 Test Cases

- 2-3 "happy path" cases (normal inputs)
- 1-2 edge cases (unusual but valid)
- 1 potential failure case

---

# Examples by Domain

| Domain | Happy Path | Edge Case |
|--------|-----------|-----------|
| GTM/Sales | Well-documented lead | Missing company info |
| Developer Tools | Clean PR | PR with 50+ files |
| Customer Support | Billing question | Ticket in another language |

---

# Run Your Agent on Each Input

1. Open Claude Code
2. Trigger your agent with test input #1
3. Copy the output
4. Compare to expected output
5. Mark pass/fail for each criterion

---

# Record Results

```markdown
## Results

| Test Case | Pass/Fail | Notes |
|-----------|-----------|-------|
| 1: Happy path | ✓ Pass | Score was 82, in range |
| 2: Missing data | ✓ Pass | Correctly noted missing |
| 3: Edge case | ✗ Fail | Timed out on large input |

**Pass Rate:** 4/5 (80%)
```

---

# Automating Your Evals

Manual is fine for 5 test cases.

For 50+ cases or after every code change, automate.

---

# Workshop Eval Runner

`scripts/run-funding-evals.py` demonstrates:

- Streaming output (see Claude work in real-time)
- Tool call visibility (shows SQL queries)
- Boolean pass/fail scoring
- JSON result export

---

# How It Works

```python
cmd = [
    'claude', '-p', prompt,
    '--output-format', 'stream-json',
    '--verbose',
    '--allowedTools', 'Bash(sqlite3:*),Read'
]
```

---

# Lab 2: Run the Eval Script

**Step 1:** Preview evals
```bash
python3 scripts/run-funding-evals.py --dry-run
```

**Step 2:** Run a single eval
```bash
python3 scripts/run-funding-evals.py --id=basic-001
```

---

# Run Evals by Difficulty

```bash
# Easy evals (should mostly pass)
python3 scripts/run-funding-evals.py --filter=easy

# Medium evals
python3 scripts/run-funding-evals.py --filter=medium

# Hard evals (expect some failures)
python3 scripts/run-funding-evals.py --filter=hard
```

---

# What You'll See

```
[basic-001] Basic Count
──────────────────────────────────────────────────

┌─ Bash
│ sqlite3 data/startup-funding.db "SELECT COUNT(*)..."
│ 200
└─

**Answer:** There are **200 startups** in the database.

→ ✓ PASS (8s)
```

---

# Analyze Results

```bash
cat output/eval-results.json | python3 -m json.tool
```

Check:
- Overall pass rate by difficulty
- Which evals failed and why

---

# The Key Insight

Your eval is only as good as your pass/fail criteria.

Spend more time on defining good criteria than on automation.

---

# Key Takeaways

1. Golden dataset = expected inputs + outputs
2. Generic evals don't work for your use case
3. Start with error analysis before automation
4. 5 test cases is enough to start

---

# Homework

**Part 1:** Expand golden dataset to 10 test cases

**Part 2:** Automate your evals with a script

**Part 3:** Document findings in eval-report.md

**Part 4:** Prepare your demo for Week 8

---

# Next Week Preview

**Week 8: Demos**
- Present your projects
- Learn from each other
