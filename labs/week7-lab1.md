# Week 7 Lab 1: Create Your Golden Dataset

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes  
**Focus:** Creating a golden dataset with test cases and pass criteria to evaluate agent behavior

---

## Lab Architecture

This lab demonstrates how to design test cases for AI agent evaluation.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Golden Dataset Architecture                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                    Golden Dataset                            │      │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │      │
│   │  │ Test 1  │  │ Test 2  │  │ Test 3  │  │ Test 4  │          │      │
│   │  │ Input   │  │ Input   │  │ Input   │  │ Input   │          │      │
│   │  │ Expect  │  │ Expect  │  │ Expect  │  │ Expect  │          │      │
│   │  │ Criteria│  │ Criteria│  │ Criteria│  │ Criteria│          │      │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │ Key Insight: Golden datasets use binary pass/fail criteria,    │    │
│   │ not subjective 1-10 scales. Each test case is specific and     │    │
│   │ testable.                                                      │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A golden dataset of 5 test cases with specific pass/fail criteria for your agent.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Weeks 1-6 complete** - You have built at least one agent to test
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **A working agent or skill** - Something to evaluate
- [ ] **Text editor ready** - For creating the dataset file

**You'll need:**
- Clear understanding of what your agent should do
- Examples of good and bad outputs from your agent

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Create a golden dataset directory structure
2. Design 5 test cases with specific inputs
3. Define binary pass/fail criteria for each test
4. Run your agent manually against each test
5. Document results and calculate pass rate

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Set Up Eval Directory | 5 min |
| 1.2 | Design Test Cases | 15 min |
| 1.3 | Fill In Test Cases | 10 min |
| 1.4 | Run Agent Manually | 10 min |
| 1.5 | Calculate Results | 5 min |
| | **TOTAL** | **45 min** |

---

## Understanding Golden Datasets

A golden dataset is simply: **expected inputs paired with what "good" looks like.**

| Input | What Good Looks Like |
|-------|---------------------|
| "Score this lead: VP Engineering at 500-person tech company" | Score 70-90, mentions seniority, mentions company size |
| "How many startups are in the database?" | Returns exactly 200, uses COUNT query |

**Key principles:**
- Use binary pass/fail, not 1-10 scales
- Test prediction and reasoning, not just retrieval
- Create domain-specific criteria, not generic "helpfulness"

---

## Task 1.1: Set Up Your Eval Directory (5 min)

1. **Create the directory:**
   ```bash
   mkdir -p agents/my-agent-evals
   cd agents/my-agent-evals
   ```

2. **Create the golden dataset file:**
   ```bash
   touch golden-dataset.md
   ```

3. **Open in your editor:**
   ```bash
   code golden-dataset.md
   # or: vim golden-dataset.md
   ```

---

## Task 1.2: Design Your Test Cases (15 min)

Create 5 test cases following this structure. Copy the template into `golden-dataset.md`:

```markdown
# Golden Dataset for [Your Agent Name]

## Agent Description
[What does your agent do? 1-2 sentences]

---

## Test Case 1: Basic Happy Path
**Input:**
[What you'll give the agent]

**Expected Output:**
[What "good" looks like - be specific]

**Pass Criteria:**
- [ ] Criterion 1 (specific, testable)
- [ ] Criterion 2 (specific, testable)
- [ ] Criterion 3 (specific, testable)

**Actual Output:**
[Fill in after running]

**Result:** [ ] Pass  [ ] Fail

---

## Test Case 2: [Name]
**Input:**

**Expected Output:**

**Pass Criteria:**
- [ ]
- [ ]

**Actual Output:**

**Result:** [ ] Pass  [ ] Fail

---

## Test Case 3: Edge Case
**Input:**

**Expected Output:**

**Pass Criteria:**
- [ ]
- [ ]

**Actual Output:**

**Result:** [ ] Pass  [ ] Fail

---

## Test Case 4: [Name]
**Input:**

**Expected Output:**

**Pass Criteria:**
- [ ]
- [ ]

**Actual Output:**

**Result:** [ ] Pass  [ ] Fail

---

## Test Case 5: Potential Failure
**Input:**
[Something that should be handled gracefully]

**Expected Output:**
[What the agent should do - refuse, ask for clarification, etc.]

**Pass Criteria:**
- [ ]
- [ ]

**Actual Output:**

**Result:** [ ] Pass  [ ] Fail

---

## Summary

| Test | Result | Notes |
|------|--------|-------|
| 1: Basic Happy Path | | |
| 2: | | |
| 3: Edge Case | | |
| 4: | | |
| 5: Potential Failure | | |

**Pass Rate:** _/5 (_%)

**Key Learnings:**
-
-
```

---

## Task 1.3: Fill In Test Cases (10 min)

Choose test cases based on your domain. Use these examples as inspiration:

**For Data Analysis Agents:**

| Test | Input | Pass Criteria |
|------|-------|---------------|
| Basic retrieval | "How many startups are in the database?" | Returns exactly 200 |
| Aggregation | "What's the average Series A size?" | Returns ~$24.6M |
| Prediction | "Which companies will raise Series B next?" | Provides ranked list with reasoning |
| Context mgmt | "List all 2024 funding rounds" | States "showing X of 91" if limited |
| Edge case | "Compare Cursor vs Replit funding" | Notes data asymmetry, adds caveats |

**For GTM/Sales Agents:**

| Test | Input | Pass Criteria |
|------|-------|---------------|
| Happy path | "Score this lead: VP Engineering at 500-person tech company" | Score 70-90, mentions seniority |
| Missing data | "Score lead: unknown@gmail.com" | Notes missing info, lower score |
| Research | "Research Acme Corp for sales outreach" | Finds company info, recent news |
| Edge case | "Lead at company with no online presence" | Gracefully handles lack of data |
| Failure | "Lead email: test@test.test" | Flags as likely invalid |

**For Content Agents:**

| Test | Input | Pass Criteria |
|------|-------|---------------|
| Happy path | "Summarize this 500-word blog post" | Captures 3 main points, under 150 words |
| Long content | "Summarize this 10-page PDF" | Acknowledges length, provides structured summary |
| Technical | "Summarize API documentation" | Captures endpoints, parameters, examples |
| Edge case | "Summarize image-only PDF" | Notes inability to process images |
| Failure | "Summarize this empty file" | Returns appropriate error message |

---

## Task 1.4: Run Your Agent Manually (10 min)

For each of your 5 test cases:

1. **Open Claude Code:**
   ```bash
   claude
   ```

2. **Trigger your agent/skill with the test input:**
   ```
   > [Your test input here]
   ```

3. **Copy the output** to "Actual Output" in your document

4. **Check each pass criterion** and mark pass/fail

5. **Record notes** about what worked or didn't

**Tips for evaluation:**
- Would you accept this output from a human team member?
- Did it answer the actual question, not a related one?
- Are there hallucinations or made-up data?
- Did it handle edge cases gracefully?

---

## Task 1.5: Calculate Results (5 min)

1. **Fill in the summary table:**

   | Test | Result | Notes |
   |------|--------|-------|
   | 1: Basic Happy Path | ✓ Pass | Worked correctly |
   | 2: Aggregation | ✓ Pass | Used correct SQL |
   | 3: Edge Case | ✗ Fail | Timeout on large input |
   | 4: Prediction | ✓ Pass | Good reasoning |
   | 5: Failure Case | ✓ Pass | Handled gracefully |

2. **Calculate pass rate:** 4/5 = 80%

3. **Document key learnings:**
   - What surprised you?
   - What needs improvement?
   - What additional tests would you add?

---

## Troubleshooting

### Test Case Design Issues

| Problem | Solution |
|---------|----------|
| Criteria too vague | Use specific, measurable criteria (numbers, exact strings) |
| Everything passes | Criteria too loose; add specificity |
| Everything fails | Criteria too strict; loosen requirements |
| Can't determine pass/fail | Rewrite criteria as binary yes/no checks |

### Agent Behavior Issues

| Problem | Solution |
|---------|----------|
| Agent not responding | Restart Claude Code with `claude` |
| Wrong tool being used | Check allowed tools in your skill |
| Inconsistent outputs | Run each test multiple times, note variance |
| Timeout on test | Simplify the query or increase patience |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Eval directory created** - `agents/my-agent-evals/` exists
- [ ] **Golden dataset file created** - `golden-dataset.md` with template
- [ ] **5 test cases designed** - Inputs and expected outputs defined
- [ ] **Specific pass criteria** - Binary yes/no checks, not ratings
- [ ] **All tests run manually** - Agent invoked for each test
- [ ] **Results documented** - Actual outputs recorded
- [ ] **Pass rate calculated** - Aim for 70-80% initially
- [ ] **Key learnings noted** - What to improve

**Document your test coverage:**

| Element | Your Implementation |
|---------|---------------------|
| Agent being tested | |
| Number of test cases | |
| Pass rate achieved | |
| Top improvement area | |

---

## Reference: Good vs. Bad Pass Criteria

| Bad | Good |
|-----|------|
| "Is the output helpful?" | "Does it answer the specific question asked?" |
| "Score 7 or higher" | "Pass: mentions company size AND industry" |
| "Good summary" | "Captures the 3 main points in under 200 words" |
| "No errors" | "Returns valid JSON with required fields" |

---

## Reference: The Three-Query Pattern

For each capability, create:
1. **Basic query** - Should definitely work (easy)
2. **Basic query** - Another simple case (easy)
3. **Complex query** - Tests reasoning and synthesis (hard)

Example:
- Basic: "How many startups are in the database?"
- Basic: "What's the average Series A funding?"
- Complex: "Which AI companies are most likely to raise Series B and why?"

---

**End of Lab 1**
