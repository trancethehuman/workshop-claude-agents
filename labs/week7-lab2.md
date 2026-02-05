# Week 7 Lab 2: Run the Eval Suite

**Course:** Claude Agents Workshop  
**Duration:** 40 minutes (+ optional stretch task)  
**Focus:** Running automated evaluations and analyzing results to identify improvement areas

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This lab demonstrates how to run and analyze automated agent evaluations.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Eval Runner Architecture                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                    Eval Dataset (JSON)                       │      │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │      │
│   │  │ basic-  │  │ agg-    │  │ pred-   │  │ custom- │          │      │
│   │  │ 001     │  │ 001     │  │ 001     │  │ 001     │          │      │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │      │
│   └─────────────────────────────┬────────────────────────────────┘      │
│                                 │                                       │
│                                 ▼                                       │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                    Eval Runner                               │      │
│   │  1. Send input to agent                                      │      │
│   │  2. Capture output                                           │      │
│   │  3. Check against pass criteria                              │      │
│   │  4. Record PASS/FAIL                                         │      │
│   └─────────────────────────────┬────────────────────────────────┘      │
│                                 │                                       │
│                                 ▼                                       │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                    Results (JSON)                            │      │
│   │  Pass: 4/5 (80%)    Failures: Test 3 - timeout               │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** Automated eval runs with pass/fail analysis and improvement recommendations.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 1 complete** - Golden dataset created and manually tested
- [ ] **Python 3 installed** - Required for the eval runner script
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **Repository cloned** - Access to `scripts/run-funding-evals.py` and `data/evals/`

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Explore the eval dataset without running it
2. Run a single eval and understand the output format
3. Run all evals by difficulty level
4. Analyze results JSON to identify patterns
5. Document failures and improvement areas
6. (Stretch) Add a custom eval to the suite

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 2.1 | Explore the Eval Dataset | 5 min |
| 2.2 | Run a Single Eval | 10 min |
| 2.3 | Run All Evals by Difficulty | 15 min |
| 2.4 | Analyze the Results | 10 min |
| | **TOTAL** | **40 min** |
| **Stretch** | Add Custom Eval | 15+ min |

---

## Task 2.1: Explore the Eval Dataset (5 min)

The workshop includes a pre-built eval suite for the funding database.

1. **View available evals without running them:**
   ```bash
   python scripts/run-funding-evals.py --dry-run
   ```

2. **Understand what you'll see:**
   - Eval ID and name
   - Difficulty level (easy, medium, hard)
   - Category (retrieval, aggregation, prediction)
   - Input prompt
   - Pass criteria

3. **Count the evals:**
   - How many easy evals?
   - How many hard evals?
   - What categories are covered?

4. **Record your findings:**

| Difficulty | Count | Categories |
|------------|-------|------------|
| Easy | | |
| Medium | | |
| Hard | | |

---

## Task 2.2: Run a Single Eval (10 min)

Start with one eval to understand the output format.

1. **Run the basic count eval:**
   ```bash
   python scripts/run-funding-evals.py --id=basic-001
   ```

2. **Watch the output carefully:**

   ```
   ──────────────────────────────────────────────────
   [basic-001] Basic Count
   ──────────────────────────────────────────────────

   ┌─ Bash
   │ sqlite3 data/startup-funding.db "SELECT COUNT(*) ..."
   │ 200
   └─

   **Answer:** There are **200 startups** in the database.

   → ✓ PASS (8s)
   ```

3. **Identify the key elements:**
   - Tool calls shown in boxes
   - Agent's reasoning visible
   - Final pass/fail verdict
   - Duration in seconds

4. **Record your observation:**

| Element | What You Saw |
|---------|--------------|
| Tool used | |
| Query run | |
| Result | |
| Duration | |

---

## Task 2.3: Run All Evals by Difficulty (15 min)

1. **Run easy evals first:**
   ```bash
   python scripts/run-funding-evals.py --filter=easy
   ```

   **Expected:** Most should pass (95%+ target)

2. **Run medium evals:**
   ```bash
   python scripts/run-funding-evals.py --filter=medium
   ```

   **Expected:** ~80% pass rate

3. **Run hard evals:**
   ```bash
   python scripts/run-funding-evals.py --filter=hard
   ```

   **Expected:** ~60% pass rate (failures are expected)

4. **Record your results:**

| Difficulty | Passed | Failed | Pass Rate |
|------------|--------|--------|-----------|
| Easy | | | |
| Medium | | | |
| Hard | | | |
| **Total** | | | |

---

## Task 2.4: Analyze the Results (10 min)

1. **Check the results file:**
   ```bash
   # macOS/Linux:
   cat output/eval-results.json | python -m json.tool

   # Windows:
   type output\eval-results.json | python -m json.tool
   ```

2. **Look for patterns:**
   - Which specific evals failed?
   - What category has the most failures?
   - Are failures due to wrong answers or criteria issues?

3. **Examine a failed eval:**
   - Find a failed eval ID in the results
   - Look at the `output` field - what did the agent say?
   - Check `criteria_results` - which criterion failed?

4. **Document your analysis:**

   ```markdown
   ## Eval Analysis

   **Overall Pass Rate:** __/%

   **Failures:**

   | Eval ID | Why It Failed |
   |---------|---------------|
   | | |
   | | |

   **Patterns Noticed:**
   -
   -

   **Suggested Improvements:**
   -
   -
   ```

---

## Stretch Task: Add Your Own Eval

If you finish early, add a custom eval to the suite.

1. **Open the eval file:**
   ```bash
   code data/evals/funding-analysis-evals.json
   ```

2. **Add a new eval case:**
   ```json
   {
     "id": "custom-001",
     "name": "Your Custom Eval",
     "category": "your-category",
     "difficulty": "medium",
     "input": "Your question to the agent",
     "pass_criteria": [
       "Must include X",
       "Returns a number greater than Y"
     ]
   }
   ```

3. **Run your custom eval:**
   ```bash
   python scripts/run-funding-evals.py --id=custom-001
   ```

4. **Did it pass or fail?** Why?

### Stretch Success Criteria

- [ ] Custom eval added to JSON file
- [ ] Eval runs successfully
- [ ] Pass criteria are specific and testable
- [ ] Result documented (pass/fail and why)

---

## Troubleshooting

### Eval Runner Issues

| Problem | Solution |
|---------|----------|
| `python: command not found` | Use `python` or install Python 3 |
| `No module named 'json'` | Ensure Python 3.6+ is installed |
| Script hangs | Press Ctrl+C and try with `--id=` for single eval |
| Permission denied | Run `chmod +x scripts/run-funding-evals.py` (macOS/Linux). On Windows, this step is not needed -- run with `python scripts/run-funding-evals.py` |

### Claude Code Issues

| Problem | Solution |
|---------|----------|
| Agent not responding | Restart Claude Code with `claude` |
| Wrong tool being used | Check allowed tools in your skill |
| Timeout on eval | Increase timeout or simplify the query |

### Pass Criteria Issues

| Problem | Solution |
|---------|----------|
| Everything fails | Criteria may be too specific; loosen requirements |
| Everything passes | Criteria may be too loose; add specificity |
| "Needs review" results | Criteria couldn't be auto-checked; manual review needed |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Explored eval dataset** - Used `--dry-run` to see available evals
- [ ] **Ran single eval** - Understood the output format
- [ ] **Ran by difficulty** - Easy, medium, and hard evals completed
- [ ] **Results recorded** - Pass rates documented for each difficulty
- [ ] **Analyzed results JSON** - Examined failure details
- [ ] **Patterns documented** - Identified common failure modes
- [ ] **Improvements identified** - Know what to fix before demo day

**Document your eval results:**

| Metric | Your Result |
|--------|-------------|
| Total evals run | |
| Overall pass rate | |
| Weakest category | |
| Top improvement | |

---

## Reference: Eval JSON Format

```json
{
  "id": "eval-001",
  "name": "Descriptive Name",
  "category": "retrieval|aggregation|prediction|context",
  "difficulty": "easy|medium|hard",
  "input": "The exact prompt to send to the agent",
  "pass_criteria": [
    "Criterion 1 - what must be true",
    "Criterion 2 - what must be true",
    "Returns exactly X"
  ]
}
```

**Criterion patterns that auto-check:**
- `"Returns exactly 200"` → checks for "200" in output
- `"Does NOT hardcode"` → checks "hardcode" not in output
- `"Uses COUNT(*)"` → checks for "count(*)" in output

---

## Reference: Context Management Criteria (For Data Agents)

| Criterion | Pass | Fail |
|-----------|------|------|
| Acknowledges limits | "Showing top 100 of 45,000" | Presents limited data as complete |
| Uses LIMIT | Adds LIMIT clause | Returns unbounded results |
| Tracks truncation | Notes when data was limited | Makes claims on incomplete data |

---

## Reference: Why Binary Pass/Fail?

1-10 scales are subjective and inconsistent:
- One person's "7" is another's "5"
- Hard to aggregate across many tests
- Doesn't drive clear action

Binary pass/fail:
- Forces specific criteria definition
- Easy to calculate pass rates
- Clear signal: "This works" or "This needs fixing"

---

**End of Lab 2**
