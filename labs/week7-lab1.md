# Week 7 Lab 1: Improve a Skill with Autoresearch

**Course:** Claude Agents Workshop
**Duration:** 45 minutes
**Focus:** Using binary evals to systematically measure and improve one of your skills or agents

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This lab follows the autoresearch loop: create an evals.md for your skill, score a baseline, mutate the skill, and measure improvement.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     Autoresearch Loop Architecture                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│   │  Your Skill  │───▶│  Generate N  │───▶│  Score Each  │             │
│   │  (SKILL.md)  │    │  Outputs     │    │  Output      │             │
│   └──────────────┘    └──────────────┘    └──────┬───────┘             │
│          ▲                                        │                     │
│          │                                        ▼                     │
│   ┌──────┴───────┐                       ┌──────────────┐             │
│   │  Mutate the  │◀──────────────────────│  Analyze     │             │
│   │  Skill       │                       │  Failures    │             │
│   └──────────────┘                       └──────────────┘             │
│                                                                         │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │ Key Insight: A skill without eval criteria cannot be            │    │
│   │ systematically improved. evals.md is to skills what unit        │    │
│   │ tests are to functions.                                         │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** An evals.md file for your skill, a baseline score, an improved skill, and a research log.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Weeks 3-6 complete** - You have built at least one skill or agent to improve
- [ ] **Claude Code running** - Start with `claude` in the repo directory
- [ ] **A working skill or agent prompt** - Something that produces output you can evaluate
- [ ] **Text editor ready** - For editing your skill file and recording results

**You'll need:**
- A skill file (SKILL.md) or agent prompt from a previous week
- Clear understanding of what good output looks like for that skill

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Create an `evals.md` file for your skill with 3-5 binary criteria
2. Generate 5 outputs and score them (establish a baseline)
3. Analyze what's failing and why
4. Edit the skill to fix the failure patterns
5. Re-generate 5 outputs and score them (measure improvement)
6. Document changes in a research log

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Create evals.md for Your Skill | 10 min |
| 1.2 | Generate Baseline Outputs and Score | 10 min |
| 1.3 | Analyze Failures and Mutate the Skill | 15 min |
| 1.4 | Re-run and Compare Scores | 10 min |
| | **TOTAL** | **45 min** |

---

## Understanding the Skills Gym

The Skills Gym is a convention for continuously improving skill files through evals. Every skill that goes through the gym gets two files alongside SKILL.md:

```
my-skill/
├── SKILL.md              (the skill itself)
├── evals.md              (3-6 binary eval criteria)
└── references/
    └── research-log.md   (score trajectory from autoresearch)
```

**evals.md** defines what "good output" means for this skill. Without it, every prompt edit is a guess.

**research-log.md** records what mutations were tried, what scores were achieved, and what worked. This log survives model upgrades. When a new model ships, feed the log to the new model and it picks up where the last one left off.

---

## Task 1.1: Create evals.md for Your Skill (10 min)

### Step 1: Choose Your Skill

Pick a skill or agent prompt you built in weeks 3-6. Good candidates:

- A skill that works but produces inconsistent output
- A skill where you've noticed quality issues
- Your main project skill (good prep for demo day)

If you haven't built a custom skill, you can use the workshop's startup funding agent at `.claude/agents/startup-funding-agent.md`.

### Step 2: Write Your evals.md

Create an `evals.md` file in your skill directory (next to your SKILL.md or agent prompt):

```bash
# If your skill is at agents/my-skill/SKILL.md:
touch agents/my-skill/evals.md
```

Write 3-5 binary eval criteria. Every criterion must be a yes/no question.

```markdown
# Eval Criteria: [Your Skill Name]

Each criterion is answered yes/no per output.
Score = passes / (N outputs x criteria count).

1. [Criterion 1]
2. [Criterion 2]
3. [Criterion 3]
```

**Design rules (from the lecture):**
- Binary only. Yes or no. No scales.
- 3-5 criteria max. More invites gaming.
- Test genuine quality, not surface compliance.
- Specific enough to measure, general enough the model can't game them.

**Examples by skill type:**

| Skill Type | Eval Criteria Examples |
|------------|----------------------|
| Data analysis agent | Does the output cite specific numbers from the data? Does it acknowledge when results are limited or incomplete? Does it provide reasoning for claims, not just state facts? |
| Sales/GTM skill | Is the output under 150 words? Does it include a personalized element specific to the recipient? Does it end with a single, clear call to action? |
| Research agent | Does it cite at least 2 specific sources? Are all claims supported by evidence from the sources? Does it distinguish what is factual from what is inferred? |
| Content skill | Is the output free of filler phrases ("In today's fast-paced world", "It's worth noting")? Does it lead with the main point in the first sentence? Is it under the target word count? |
| Diagram generator | Is all text in the diagram legible? Does the color palette use soft/pastel colors only? Is the layout linear (left-to-right or top-to-bottom)? |

### Step 3: Create Your Research Log

Create a research log file to track your autoresearch run:

```bash
mkdir -p agents/my-skill/references
touch agents/my-skill/references/research-log.md
```

Start the log with this header:

```markdown
# Research Log: [Your Skill Name]

## Skill Location
[Path to your SKILL.md or agent prompt]

## Eval Criteria
[Copy your evals.md criteria here for reference]

## Max Score
[5 outputs] x [N criteria] = [max] points
```

---

## Task 1.2: Generate Baseline Outputs and Score (10 min)

### Step 1: Generate 5 Outputs

Run your skill 5 times with the same input (or 5 different representative inputs). Copy each output somewhere you can review it.

**Using Claude Code:**

```
> [Your test input that triggers the skill]
```

Run it 5 times. Each time, copy the output into a temporary notes file or directly into your research log.

**Tip:** If your skill takes a long time to run, use simpler inputs for this exercise. The goal is to get 5 scored outputs in 10 minutes.

### Step 2: Score Each Output

For each output, check every eval criterion. Mark Y (yes/pass) or N (no/fail).

Record the results in your research log:

```markdown
## Baseline Run

| Output # | Criterion 1 | Criterion 2 | Criterion 3 | Score |
|----------|------------|------------|------------|-------|
| 1        | Y          | N          | Y          | 2/3   |
| 2        | Y          | Y          | N          | 2/3   |
| 3        | N          | N          | Y          | 1/3   |
| 4        | Y          | Y          | Y          | 3/3   |
| 5        | Y          | N          | N          | 1/3   |
| **Total** | **4/5**   | **2/5**    | **3/5**    | **9/15** |
```

**Scoring rules:**
- Be honest. If you're unsure, mark it as a fail.
- Spend about 30 seconds per output per criterion.
- "Would you accept this from a human team member?" is the bar.

### Step 3: Calculate Your Baseline

Add up all the Y marks. That's your baseline score.

Example: 3 criteria x 5 outputs = 15 max. If you got 9 passes, your baseline is 9/15 (60%).

---

## Task 1.3: Analyze Failures and Mutate the Skill (15 min)

This is the most important step. This is where your skill actually improves.

### Step 1: Study the Failures

Look at every N (fail) mark and ask:

1. **Which criterion fails most?** In the example above, Criterion 2 fails 3 out of 5 times. That's your biggest opportunity.
2. **What is the skill doing wrong?** Is it missing instructions? Are the instructions unclear? Is it following instructions but they're wrong?
3. **What single change to the skill would fix the most failures?**

### Step 2: Edit the Skill

Open your SKILL.md and make one targeted change. Resist the urge to rewrite everything. Change one thing so you know what helped.

Common mutations that improve skills:

| Failure Pattern | Skill Mutation |
|----------------|---------------|
| Output is too long or verbose | Add explicit word limits or "be concise" instruction |
| Missing required elements | Add a checklist of required output components |
| Wrong tone or style | Add negative examples ("Do NOT write like this: ...") |
| Hallucinating facts | Add "Only cite information from the provided context" |
| Ignoring edge cases | Add explicit edge case handling instructions |
| Inconsistent format | Add an output template or format example |
| Giving generic output | Add "Be specific to the input. Do not give generic advice." |

**Tips for effective mutations:**
- **Negative constraints often outperform positive guidance.** "Do NOT use exclamation marks" is stronger than "Use a professional tone." The model knows what to avoid more precisely than what to aspire to.
- **Add examples of good and bad output.** When the criterion is about quality (not just format), showing the model what you mean is more effective than describing it.
- **One mutation at a time.** If you change three things, you won't know which one helped. Autoresearch works because you isolate variables.

### Step 3: Log the Mutation

In your research log, record what you changed and why:

```markdown
## Run 1 — [Date]
**Score:** [baseline]/[max]
**Change:** [What you edited in SKILL.md — quote the before/after if useful]
**Why:** [Which failure pattern you're targeting]
```

---

## Task 1.4: Re-run and Compare Scores (10 min)

### Step 1: Generate 5 New Outputs

Run the same 5 inputs through your modified skill. Copy the outputs.

### Step 2: Score Each Output

Same criteria, same scoring rules. Record in your research log:

```markdown
### Results After Mutation

| Output # | Criterion 1 | Criterion 2 | Criterion 3 | Score |
|----------|------------|------------|------------|-------|
| 1        | Y          | Y          | Y          | 3/3   |
| 2        | Y          | Y          | N          | 2/3   |
| 3        | Y          | Y          | Y          | 3/3   |
| 4        | Y          | N          | Y          | 2/3   |
| 5        | Y          | Y          | Y          | 3/3   |
| **Total** | **5/5**   | **4/5**    | **4/5**    | **13/15** |
```

### Step 3: Compare

| Metric | Baseline | After Mutation |
|--------|----------|---------------|
| Total score | /[max] | /[max] |
| Pass rate | % | % |
| Criterion 1 pass rate | /5 | /5 |
| Criterion 2 pass rate | /5 | /5 |
| Criterion 3 pass rate | /5 | /5 |

### Step 4: Keep or Revert

If the score improved: **keep the change.** Your skill is now measurably better.

If the score got worse or stayed the same: **revert and try a different mutation.**

This is the core autoresearch decision: keep the version with the higher score.

### Step 5: Complete Your Research Log

```markdown
**Result:** Kept (improved from 9/15 to 13/15)
**Observation:** [What prompt engineering insight did this reveal?]
```

The observation line is the most valuable part. It captures what you learned about making this skill better. Examples of good observations:

- "Negative constraints ('do NOT') cut bad patterns faster than describing ideal output"
- "Adding an output template eliminated format inconsistency but made content slightly more generic"
- "The model was ignoring data limitations because I never told it to acknowledge them"

These observations transfer to other skills. That's why the research log compounds.

---

## Troubleshooting

### Eval Design Issues

| Problem | Solution |
|---------|----------|
| Everything passes | Criteria too loose. Add specificity. A 100% pass rate means your tests aren't challenging enough. |
| Everything fails | Criteria too strict. Ask: "Is this criterion testing something the skill should realistically do?" |
| Same criterion always fails | Good news: that's your target. Focus your mutation on fixing that specific pattern. |
| Can't tell if it's pass or fail | Rewrite the criterion. If you can't tell, the criterion is vague. Make it more specific. |

### Skill Mutation Issues

| Problem | Solution |
|---------|----------|
| Score didn't change | Mutation was too subtle. Make a bolder change. |
| Score got worse | Revert. The mutation introduced a new problem. Try a different approach. |
| Fixed one criterion but broke another | Common tradeoff. Prioritize the criterion that matters more. |
| Skill is already good (90%+) | Add harder criteria. Or move to a different skill. |

### Agent-Specific Issues

| Problem | Solution |
|---------|----------|
| Agent uses wrong tool | Add explicit tool selection guidance to agent prompt |
| Agent loops on the same step | Add termination instructions or max-retry limits |
| Output quality varies wildly between runs | Tighten the prompt with more constraints and examples |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Skill selected** - Chose a skill or agent from weeks 3-6
- [ ] **evals.md created** - 3-5 binary yes/no criteria alongside your SKILL.md
- [ ] **Baseline scored** - 5 outputs evaluated against all criteria
- [ ] **Failures analyzed** - Identified which criterion fails most and why
- [ ] **Skill mutated** - Made one targeted edit to SKILL.md
- [ ] **Re-scored after mutation** - 5 new outputs evaluated
- [ ] **Scores compared** - Baseline vs. improved, documented
- [ ] **Research log complete** - Mutation, result, and observation recorded

**Document your results:**

| Element | Your Result |
|---------|-------------|
| Skill improved | |
| Eval criteria count | |
| Baseline score | |
| Final score | |
| Improvement | |
| Key observation | |

---

## Reference: evals.md Template

```markdown
# Eval Criteria: [Skill Name]

Each criterion is answered yes/no per output.
Score = passes / (N outputs x criteria count).

1. [Does the output ___?]
2. [Is the output ___?]
3. [Does it avoid ___?]
```

---

## Reference: Research Log Template

```markdown
# Research Log: [Skill Name]

## Run 1 — [Date]
**Score:** [X/Y]
**Change:** [What was mutated in SKILL.md]
**Why:** [What failure pattern this targets]
**Result:** [Kept / Reverted]
**Observation:** [What this reveals about the skill]
```

---

## Reference: Eval Criteria Anti-Patterns

| Anti-Pattern | Why It Fails | Better Alternative |
|-------------|-------------|-------------------|
| Likert scale (rate 1-7) | Every step adds noise. Inconsistent across evaluations. | Binary pass/fail |
| Overly narrow ("must be under 47 words") | Model games the eval by parroting constraints | "Is the output concise?" |
| Too many criteria (10+) | Model technically passes all while producing mediocre output | 3-5 criteria that capture what matters |
| Vague ("Is it helpful?") | Different evaluations of the same output disagree | "Does the output answer the specific question asked?" |
| Testing retrieval only | Misses whether the skill can reason and synthesize | "Does it explain WHY, not just WHAT?" |

---

**End of Lab 1**
