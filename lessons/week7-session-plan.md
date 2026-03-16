# Week 7: Improving Skills and Agents with Evals

## Session Goals
- Understand why skills and agents need systematic evaluation to improve
- Learn the autoresearch methodology for iteratively improving skill files
- Use binary evals to measure and improve one of your own skills
- Run automated evals against an agent and analyze the results

---

## Block 1: Theory - Why Your Skills and Agents Need Evals (30 min)

### The Problem

You've built skills and agents over the last six weeks. They work. But are they good?

Skills are prompts. Prompts are inherently noisy. The same skill file can produce different outputs each time. Some runs are great. Some are mediocre. You can't tell which version of the output your user will get.

Without evals, you're guessing. You tweak a prompt, run it once, it looks better, you ship it. But did it actually improve? Or did you just get lucky on that one run?

### Why Off-the-Shelf Evals Don't Work

You might think: "Can't I just use some eval framework that scores my agent automatically?"

**No.** Here's why (from [Hamel Husain's eval research](https://hamel.dev/blog/posts/evals-faq/)):

| Off-the-Shelf Eval | Why It Fails |
|-------------------|--------------|
| "Helpfulness score 1-10" | What does "helpful" mean for YOUR skill? |
| "Coherence rating" | Your skill could be coherent but produce wrong outputs |
| "Safety check" | Passes safety but misses your actual requirements |
| "Factual accuracy" | Checks facts but doesn't test the skill's specific job |

**Generic metrics create false confidence.** Your skill could score 95% on a generic eval and still be useless for its actual purpose.

The only eval that matters is: **Does it do what YOU built it to do?**

### The Right Approach: Build Evals Into Your Skills

1. **Build evals WHILE building, not after**
   - Don't wait until you're "done" to create test cases
   - Every time you build a new skill or add a capability, immediately write 3 eval questions
   - Example: Build an MCP tool → Immediately create 3 queries to test it
   - This catches problems early when they're easy to fix

2. **Start with error analysis, not infrastructure**
   - Run your skill 10-20 times on real inputs
   - Manually look at the outputs
   - Ask: "Would I accept this if a human produced it?"
   - Spend 30 minutes doing this before building anything

3. **Define YOUR pass/fail criteria**
   - What makes an output "good enough" for your skill?
   - Be specific. Not "good summary" but "captures the 3 main points in under 200 words"
   - Write it down. This becomes your eval criteria.

4. **Use the Three-Query Pattern**
   - For each capability in your skill, create at least 3 test queries:
     - **2 basic queries**: Simple, should definitely work (e.g., "How many companies are in the database?")
     - **1 complex query**: Tests reasoning and synthesis (e.g., "Which AI startups are most likely to raise Series B?")
   - The complex query reveals whether your skill can think, not just retrieve

5. **Run and compare**
   - Run your skill on each input
   - Compare actual output to expected
   - Note: You're looking for "close enough," not "exact match"

### The evals.md Convention

Every skill should have an `evals.md` file alongside its SKILL.md:

```
my-skill/
├── SKILL.md          (the skill itself)
├── evals.md          (3-6 binary eval criteria)
└── references/
    └── research-log.md  (score trajectory from autoresearch)
```

The `evals.md` file looks like this:

```markdown
# Eval Criteria: [Skill Name]

Each criterion is answered yes/no per output.
Score = passes / (N outputs x criteria count).

1. [Criterion 1 — specific, binary, cannot be gamed]
2. [Criterion 2]
3. [Criterion 3]
4. [Criterion 4]
```

**A skill without eval criteria cannot be systematically improved.** If you can't define what "good" means, you're guessing every time you edit the prompt.

### Autoresearch: The Loop That Makes Skills Better

Evals aren't just for measuring quality. They're the engine that makes skills and agents better over time.

**Autoresearch** (based on [Andrej Karpathy's methodology](https://github.com/karpathy/autoresearch)) treats prompt engineering the way you would treat model training. You define a loss function (your eval), run experiments (generating outputs), and optimize (mutating the prompt). The difference: instead of gradient descent, you or an agent reads the failures and rewrites the prompt to fix them.

The loop:

```
1. Pick a skill to improve
2. Define 3-6 binary eval criteria (your evals.md)
3. Generate N outputs using the skill
4. Score each output against criteria → baseline score
5. Read the failures. Ask: why did these fail?
6. Edit the SKILL.md to fix the failure pattern
7. Generate N more outputs → new score
8. Keep the version with the higher score
9. Log the attempt in your research log
10. Repeat until converged
```

**Three ingredients required:**

| Ingredient | What It Is | Example |
|------------|-----------|---------|
| Objective metric | A number you can measure | Eval pass rate (e.g., 8/10) |
| Measurement tool | Automated scoring system | Binary eval criteria + string checks |
| Something to change | The artifact being optimized | Your skill's SKILL.md or agent prompt |

**Why this works for skills and agents:**

Skills are prompts. The same skill file can produce subtly different outputs each time. Autoresearch controls for that variance by running many trials, scoring them against standardized criteria, and only keeping changes that improve the median score.

For agents, the same principle applies: the agent's system prompt and tool configuration are the artifacts you're optimizing. The eval criteria test whether the agent makes the right decisions given the context it has.

### Eval Design Rules

| Rule | Why |
|------|-----|
| Binary pass/fail only | 1-10 scales are inconsistent. What's the difference between a 6 and a 7? Nobody knows. Binary forces you to decide: good enough or not? |
| 3-6 criteria max | More than 6 and the agent finds ways to technically pass all of them while producing mediocre output. Keep it to what actually matters. |
| Test genuine quality, not surface compliance | "Must be under 47 words" causes the model to game the eval. "Is the output concise and direct?" tests real quality. |
| Specific enough to measure, general enough to not game | "Does it cite specific numbers from the data?" is good. "Does it say '200 startups'?" is too specific and breaks when data changes. |

**The school test analogy:** A student who doesn't understand the material but memorizes the answer key can still score 100%. If your eval questions are too specific or too numerous, you get the prompt-engineering equivalent of that student.

### Skill-Specific Eval Examples

| Skill Type | Eval Criteria |
|------------|--------------|
| Diagram generator | Text legible? Pastel palette? Linear layout? No ordinals? |
| Sales email writer | Under 150 words? Personalized opener? Single clear CTA? No jargon? |
| Research agent | Cites 2+ sources? All claims supported? Distinguishes facts from inferences? |
| Data analysis agent | Cites specific numbers? Acknowledges data limitations? Provides reasoning? |
| Proposal generator | Includes pricing section? Professional tone? Under 2 pages? Clear CTA? |
| Code reviewer | Catches known bug pattern? Suggests fix? Explains why? No false positives? |

### The Research Log: Your Compounding Asset

Every autoresearch run produces a log of what was tried, what worked, and what didn't. This log is the most valuable output of the process:

- **Model upgrades:** When a new model ships, feed the research log to the new model. It picks up where the last one left off.
- **Cross-skill learning:** Patterns that improve one skill (e.g., "explicit negative constraints reduce hallucination") transfer to others.
- **Institutional knowledge:** The log captures prompt engineering insights that would otherwise live only in someone's head.

Store research logs alongside your skill files. They're the prompt engineering equivalent of training data.

```markdown
# Research Log: [Skill Name]

## Run 1 — 2026-03-16
**Score:** 9/20
**Change:** Added explicit word limit and output template
**Result:** Kept (improved from 6/20)
**Observation:** Negative constraints work better than positive guidance for controlling verbosity

## Run 2 — 2026-03-16
**Score:** 14/20
**Change:** Added examples of good vs. bad output
**Result:** Kept (improved from 9/20)
**Observation:** Showing the model what NOT to do cuts bad patterns faster than describing ideal output
```

### Don't Aim for 100%

From Hamel's research:

> "A 70% pass rate might indicate you're testing meaningful things. A 100% pass rate might mean your tests are too easy."

If every test passes, your eval criteria probably aren't challenging enough. When your skill hits 90%+, add harder criteria.

### Test Prediction, Not Just Retrieval

The best evals test whether your skill can reason and synthesize, not just fetch data.

| Eval Type | Bad Example | Good Example |
|-----------|-------------|--------------|
| Data retrieval | "List all Series A companies" | "Which companies are most likely to raise Series B?" |
| Research | "Find info about Acme Corp" | "Would Acme Corp be a good acquisition target? Why?" |
| Analysis | "What's the average deal size?" | "Is the market heating up or cooling down? Support your answer." |

### Context Management Criteria (For Data Agents)

If your agent queries databases or large datasets, add these pass/fail criteria:

| Criterion | Pass | Fail |
|-----------|------|------|
| Acknowledges limits | "Showing top 100 of 45,000 results" | Presents limited results as complete |
| Uses appropriate limits | Adds LIMIT clause for exploration | Returns unbounded results |
| Tracks truncation | Notes when previous results were limited | Forgets and makes claims based on incomplete data |
| Aggregates first | Starts with GROUP BY, then drills down | Tries to load entire dataset |

### If You Use LLM-as-Judge, Require Reasoning

Sometimes you need an LLM to evaluate outputs (complex judgments, scaled evaluation). If you do:

**Always require reasoning BEFORE the verdict.**

```
Bad:  "Pass: true"
Good: "The output correctly identified the company size (500 employees) and
       mentioned the VP title as a seniority indicator. However, it failed
       to note the technology industry fit. Verdict: FAIL"
```

Why reasoning first?
- Forces the LLM to think before judging
- Lets you debug bad judgments
- Catches cases where the verdict doesn't match the reasoning

### Calibrate Domain Specificity

Your eval questions need to be domain-specific, but not TOO specific.

| Too Generic | Just Right | Too Specific |
|-------------|------------|--------------|
| "Does it return data?" | "Does it return funding data with correct schema?" | "Does it return exactly 47 rows for Q3 2024?" |
| "Is it helpful?" | "Does it explain the trend direction with evidence?" | "Does it mention the exact words 'market cooling'?" |
| "Does it work?" | "Does it handle missing data gracefully?" | "Does it throw error code ERR_NULL_12?" |

**The sweet spot:** Questions that test your specific domain logic but don't break when underlying data changes.

---

## Block 2: Lab (Part 1) - Autoresearch: Improve a Skill with Evals (45 min)

**Lab Document:** `labs/week7-lab1.md` or `admin/docx/labs/week7-lab1.docx`

Complete **Part 1** of the Week 7 Lab.

**Overview:**
- Pick a skill or agent prompt you built in weeks 3-6
- Create an `evals.md` file with 3-5 binary eval criteria
- Generate 5 outputs and score them (baseline)
- Analyze failures and edit the skill to fix them
- Re-run 5 outputs and score again (improved)
- Log everything in a research log

**Success criteria:**
- evals.md created with binary criteria
- Baseline score recorded (N outputs x criteria)
- At least one skill mutation made based on failure analysis
- Improved score recorded and compared to baseline
- Research log documenting what was changed and why

---

## BREAK (10 min)

---

## Block 3: Theory - Automating Your Evals (20 min)

### When to Automate

Manual testing is fine for 5 test cases. But what about:
- 50 test cases?
- Running after every skill edit?
- Comparing different prompt versions?

That's when you want automation. The autoresearch loop can be fully automated: an agent reads your skill, generates N outputs, scores them, mutates the skill, and repeats. You walk away and come back to a better skill.

### The Workshop Eval Runner

This workshop includes a ready-to-use eval runner at `scripts/run-funding-evals.py`. It demonstrates:
- Streaming output so you see Claude's work in real-time
- Tool call visibility (shows SQL queries and results)
- Boolean pass/fail scoring with string matching
- JSON result export for analysis

You'll run this script hands-on in Lab 2.

### How the Eval Runner Works

**1. Uses Claude Code CLI with Streaming**

The script uses proper CLI flags for real-time output:

```python
cmd = [
    'claude', '-p', prompt,           # Direct prompt (no piping)
    '--output-format', 'stream-json', # Newline-delimited JSON events
    '--verbose',                      # Required for stream-json with -p
    '--allowedTools', 'Bash(sqlite3:*),Read'  # Auto-approve DB queries
]
```

**2. Parses Stream Events**

The `stream-json` format emits events as newline-delimited JSON:

| Event Type | Contains | Script Action |
|------------|----------|---------------|
| `assistant` | Text content, tool_use | Print text, show tool calls |
| `user` | tool_result | Show query results |
| `result` | Final output | Extract for scoring |

**3. Boolean Pass/Fail Scoring**

Each eval has pass criteria checked with simple string matching:

| Criterion Pattern | How It's Checked |
|-------------------|------------------|
| `"Returns exactly 200"` | `"200" in output` |
| `"Does NOT hardcode"` | `"hardcode" not in output.lower()` |
| `"Uses COUNT(*)"` | `"count(*)" in output.lower()` |
| Other patterns | Marked as "needs review" |

### From Manual to Autonomous

The manual autoresearch you did in Lab 1 can be fully automated:

1. **Manual (Lab 1):** You read failures, decide what to change, edit the skill yourself
2. **Semi-automated:** A script generates and scores outputs. You read results and edit the skill.
3. **Fully autonomous:** An agent reads the evals, generates outputs, scores them, mutates the skill, and loops. You set it up and walk away.

The autonomous version uses the same three ingredients. The only difference is who does the mutation: you, or the agent.

### Cost of Autoresearch

Autoresearch is cheap:

| Component | Approx. Cost | Notes |
|-----------|-------------|-------|
| Generation (per output) | ~$0.02 | Depends on model |
| Eval (per output) | ~$0.01-$0.03 | Text evals are cheaper than vision |
| Per test run (10 outputs) | ~$0.20-$0.50 | 10 generations + 10 evaluations |
| Full optimization (50 runs) | ~$10-$25 | Enough to go from mediocre to near-perfect |

### The Key Insight

Your eval is only as good as your criteria.

"Does the output contain the word 'score'?" - Bad eval, too simple
"Is the score between 70-90 AND does it mention company size?" - Better, domain-specific

Spend more time on defining good criteria than on automation infrastructure.

---

## Block 4: Lab (Part 2) - Run the Eval Script (40 min)

**Lab Document:** `labs/week7-lab2.md` or `admin/docx/labs/week7-lab2.docx`

Complete **Part 2** of the Week 7 Lab.

**Overview:**
- Explore the eval dataset with `--dry-run`
- Run a single eval to see output format
- Run all evals by difficulty level
- Analyze results from JSON output
- (Optional) Add a custom eval

**Success criteria:**
- Explored eval dataset structure
- Ran evals by difficulty (easy, medium, hard)
- Analyzed results JSON file
- Documented pass/fail rates and observations

---

## Wrap-Up (15 min)

### Key Takeaways

1. **Every skill should have an evals.md** - 3-6 binary yes/no criteria that define what good looks like. A skill without evals cannot be systematically improved.

2. **Generic evals don't work** - "Helpfulness" scores tell you nothing about your specific skill. Build evaluators for your failure modes.

3. **Autoresearch turns evals into a skill improvement engine** - Define criteria, score, mutate, re-score, keep the winner. This is how skills get better.

4. **Start with error analysis** - Manually review outputs before building automation. The failures tell you what to change in the skill.

5. **The research log is the real asset** - What you changed and why transfers across skills and model upgrades. It compounds over time.

### Homework

**Part 1: Run More Autoresearch Iterations**

Continue the autoresearch loop from Lab 1:
- Run 2-3 more mutation cycles on the same skill
- Try different mutation strategies (negative constraints, output templates, examples)
- Track each iteration in your research log
- Goal: get your pass rate above 80%

**Part 2: Automate Your Evals**

Either:
- Adapt the workshop eval runner (`scripts/run-funding-evals.py`) for your skill
- Write a simple script using the Claude Agent SDK (see Block 3)

Run your eval criteria automatically across 10+ outputs and save the results.

**Part 3: Document Your Findings**

Create `eval-report.md` with:
- Your eval criteria and why you chose them
- Baseline score and final score after mutations
- What you changed in each iteration and why
- Your research log with key prompt engineering insights

**Part 4: Prepare Your Demo (Week 8)**

Next week is demo day. Start preparing now:

1. **Pick your best agent** - The one that showcases your learning

2. **Prepare a 5-minute demo** covering:
   - The problem you're solving (30 sec)
   - Your solution architecture (1 min)
   - Live demo with real data (2.5 min)
   - What you learned (1 min)

3. **Record a backup video** - In case of live demo issues

4. **Show your eval results** - Demonstrating that you tested and improved your skill is impressive. Show the before/after scores.

### Next Week Preview

Week 8: Demos - Present your projects and learn from each other

---

## Facilitator Notes

### Philosophy

This week has two goals:

1. Teach students that skills and agents need evals the same way software needs tests. A skill without an `evals.md` is like a function without unit tests.
2. Give students a practical methodology (autoresearch) they can use after the course to keep improving their skills. The loop works whether you do it manually or automate it.

The focus is on the THINKING (what makes a good eval for YOUR skill) not the TOOLING. Get people comfortable with manual evaluation before automation.

### Common Questions

**"How do I judge if the output is 'close enough'?"**
You're the domain expert. If you would accept this from a human team member, it passes.

**"My skill gives different outputs each time. How do I test that?"**
That's exactly why autoresearch runs multiple outputs. You score 5 or 10, not just one. The aggregate score absorbs the variance. A single run can be lucky or unlucky. Five runs give you a real signal.

**"5 test cases seems too few."**
It's a starting point. Quality over quantity. 5 thoughtful tests beat 50 generic ones. You can grow the set as you discover new failure patterns.

**"Should I use LLM-as-judge?"**
Not for this course. It adds complexity and cost. Start with simple rule-based checks and human judgment. LLM-as-judge is useful at scale, but you need to validate the judge against human scores first.

**"When should I create eval questions?"**
Immediately when you build something new. Just built an MCP tool? Create 3 eval questions right then. Wrote a new skill? Add an evals.md before moving on. This habit catches problems early.

**"How is autoresearch different from just fixing bugs?"**
Bug fixing is reactive. Autoresearch is systematic. You define what "good" means upfront, measure it across multiple outputs, and optimize toward it. The research log captures what worked and what didn't, which transfers to other skills.

**"What if my skill is already good?"**
Add harder eval criteria. If everything passes at 100%, your tests aren't challenging enough. A 70-80% pass rate usually means you're testing meaningful things.

**"What makes a good prediction eval?"**
It should require synthesis across multiple data points. "Which company will raise Series B next?" is better than "List companies that raised Series A" because it tests reasoning, not retrieval.

### Timing

- Block 1 (Theory): The autoresearch section and evals.md convention are the new material. Spend about 10 minutes on the evals.md convention and autoresearch loop. The rest of Block 1 covers eval design principles.
- Block 2 (Lab 1): Give full 45 min. The mutation and re-scoring steps take longer than people expect. Push students to start scoring early rather than spending all time on criteria design.
- Block 3 (Theory): Show both options (manual and automated), but emphasize that manual autoresearch from Lab 1 is the foundation.
- Block 4 (Lab 2): Hands-on iteration is the most valuable part.

### If People Finish Early

Have them:
- Run additional autoresearch iterations on the same skill
- Try autoresearch on a second skill or their agent prompt
- Help a neighbor design better eval criteria
- Start on the automation script
- Begin demo prep

### Resources

- [Hamel Husain's Eval FAQ](https://hamel.dev/blog/posts/evals-faq/) - The article this session draws from
- [Karpathy's Autoresearch](https://github.com/karpathy/autoresearch) - The original methodology
- [Claude Agent SDK Docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk/overview) - For custom automation scripts
- [Claude Code CLI Docs](https://docs.anthropic.com/en/docs/claude-code) - For understanding CLI flags

**Workshop Eval Resources:**
- `data/evals/funding-analysis-evals.json` - Machine-readable eval set (16 test cases)
- `evals/week7-golden-dataset.md` - Detailed documentation with expected outputs
- `scripts/run-funding-evals.py` - Eval runner script (see documentation below)

---

## Appendix: Eval Runner Reference

### CLI Options

```bash
python3 scripts/run-funding-evals.py [OPTIONS]

Options:
  --filter=DIFFICULTY   Run only easy, medium, or hard evals
  --id=EVAL_ID          Run a specific eval by ID
  --dry-run             Show evals without executing
  --verbose, -v         Show criteria details for all results
```

### Eval JSON Format

Evals are defined in `data/evals/funding-analysis-evals.json`:

```json
{
  "name": "Startup Funding Analysis Evals",
  "evals": [
    {
      "id": "basic-001",
      "name": "Basic Count",
      "category": "retrieval",
      "difficulty": "easy",
      "input": "How many startups are in the database?",
      "pass_criteria": [
        "Returns exactly 200",
        "Uses COUNT(*) or equivalent"
      ]
    }
  ],
  "scoring": {
    "expected_pass_rates": {
      "easy": 0.95,
      "medium": 0.80,
      "hard": 0.60
    }
  }
}
```

### Results JSON Format

Results are saved to `output/eval-results.json`:

```json
{
  "timestamp": "2026-01-21T06:41:27Z",
  "eval_set": "Startup Funding Analysis Evals",
  "summary": {"passed": 12, "failed": 2, "review": 2, "total": 16},
  "results": [
    {
      "id": "basic-001",
      "name": "Basic Count",
      "passed": true,
      "output": "SELECT COUNT(*) ... **200 startups**",
      "duration_ms": 8786,
      "criteria_results": [...]
    }
  ]
}
```

### Adapting for Your Skill

To use this pattern for your own skill or agent:

1. **Create your eval JSON** with inputs and pass criteria (mirror your evals.md)
2. **Modify the prompt template** in `run_eval()` to match your skill's context
3. **Update `--allowedTools`** to match what your skill needs
4. **Adjust scoring logic** for your criteria patterns

### Key Design Decisions

| Decision | Why |
|----------|-----|
| Stream-json output | See progress during long evals instead of waiting |
| Tool visibility | Debug what queries the agent is running |
| Boolean scoring | Clear pass/fail, no ambiguous scales |
| String matching | Simple, fast, no LLM-as-judge complexity |
| JSON export | Enables trend analysis across runs |
