# Golden Dataset: Startup Funding Analysis Agent

This document describes the eval set for testing data analysis agents. The machine-readable version is at `data/evals/funding-analysis-evals.json`.

## Quick Start

```bash
# Run all evals
python3 scripts/run-funding-evals.py

# Run only hard evals
python3 scripts/run-funding-evals.py --filter=hard

# Run a specific eval
python3 scripts/run-funding-evals.py --id=predict-001

# Dry run (show evals without executing)
python3 scripts/run-funding-evals.py --dry-run

# Verbose output
python3 scripts/run-funding-evals.py --verbose
```

---

## Eval Categories

| Category | Count | Tests |
|----------|-------|-------|
| Retrieval | 2 | Basic counts and lookups |
| Aggregation | 1 | GROUP BY, AVG, SUM |
| Multi-table | 1 | JOIN operations |
| Window Functions | 1 | RANK, PARTITION BY |
| CTEs | 1 | WITH clauses, sequential queries |
| Cohort Analysis | 1 | Conversion funnels |
| Interpretation | 2 | Trend analysis with conclusions |
| Prediction | 2 | Reasoning and synthesis |
| Context Management | 2 | Handling large results |
| Accuracy | 3 | Edge cases, missing data |
| Multi-step | 1 | Complex multi-part questions |

---

## Detailed Eval Descriptions

### Easy Tier (Expected: 95% pass)

#### `basic-001`: Basic Count
**Input:** "How many startups are in the database?"

**Expected:** Returns exactly 200. Uses `COUNT(*)`.

**Why it matters:** Baseline test that agent can connect to and query the database.

---

#### `basic-002`: Stage Breakdown
**Input:** "What are the average funding amounts by stage?"

**Expected:**
| Stage | Avg Amount |
|-------|------------|
| Pre-Seed | $1.76M |
| Seed | $6.05M |
| Series A | $24.6M |
| Series B | $61.9M |
| Series C | $192.3M |

**Why it matters:** Tests GROUP BY and AVG, basic data formatting.

---

#### `edge-001`: Specific Entity Lookup
**Input:** "What's the complete funding history for Cursor?"

**Expected:** Pre-Seed ~$1.5M on 2022-05-26. Only one round.

**Why it matters:** Tests exact matching and resistance to hallucination.

---

#### `edge-003`: Nonexistent Entity
**Input:** "What's the funding history for OpenAI?"

**Expected:** States OpenAI is not in the database. Does NOT hallucinate.

**Why it matters:** Agent must admit when data doesn't exist.

---

### Medium Tier (Expected: 80% pass)

#### `join-001`: Top Investors
**Input:** "Who are the top 5 most active investors by portfolio companies?"

**Expected:**
1. Intel Capital - 15 companies
2. Softbank Vision Fund - 14 companies
3. Khosla Ventures - 13 companies

**Pass criteria:**
- Uses `COUNT(DISTINCT startup_id)` not just `COUNT(*)`
- Correctly joins through funding_rounds

**Why it matters:** Tests understanding of schema relationships.

---

#### `trend-001`: Market Trend Analysis
**Input:** "Analyze the funding market from 2021-2024. Is it heating up, cooling down, or plateauing?"

**Expected data:**
| Year | Total Funding |
|------|--------------|
| 2021 | $821M |
| 2022 | $1.43B |
| 2023 | $2.69B |
| 2024 | $2.67B |

**Expected interpretation:** Market plateaued after strong 2021-2023 growth. 2024 roughly flat vs 2023.

**Why it matters:** Tests interpretation, not just data retrieval.

---

#### `context-001`: Result Limiting
**Input:** "List all funding rounds from 2024."

**Expected:** There are 91 rounds. Agent should:
- Use LIMIT for exploration
- State "showing X of 91" if limited
- NOT present partial results as complete

**Why it matters:** Prevents confident claims based on incomplete data.

---

#### `context-002`: Large Result Handling
**Input:** "Show me all the data in the funding_rounds table."

**Expected:** Agent should NOT dump 479 rows. Should suggest aggregation or filtering.

**Why it matters:** Tests whether agent manages context responsibly.

---

#### `edge-002`: Missing Data Handling
**Input:** "Compare the funding trajectories of Cursor, Replit, Codeium, and Tabnine."

**Expected:**
| Company | Rounds | Total |
|---------|--------|-------|
| Cursor | 1 | $1.5M |
| Replit | 2 | $8.8M |
| Codeium | 2 | $7.3M |
| Tabnine | 1 | $1.8M |

**Must:** Note data asymmetry, caveat that database may be incomplete.

**Why it matters:** Agent must not overclaim based on incomplete data.

---

### Hard Tier (Expected: 60% pass)

#### `window-001`: Funding Rank Within Industry
**Input:** "For each industry, which startup raised the largest Series A? Show the top 3 per industry."

**Expected SQL pattern:**
```sql
RANK() OVER (PARTITION BY s.industry ORDER BY fr.amount_usd DESC)
```

**Pass criteria:**
- Uses window function
- Partitions by industry
- Returns exactly 3 per industry

**Why it matters:** Tests advanced SQL and result shaping.

---

#### `cte-001`: Funding Velocity
**Input:** "Which startups moved fastest from Seed to Series A? Show top 10 by days between rounds."

**Expected SQL pattern:**
```sql
WITH round_sequence AS (
  SELECT startup_id, stage, funding_date,
    LAG(funding_date) OVER (PARTITION BY startup_id ORDER BY funding_date) as prev_date
  FROM funding_rounds
)
SELECT ... WHERE stage = 'Series A' AND prev_stage = 'Seed'
```

**Pass criteria:**
- Uses CTE or subquery
- Calculates days between rounds
- Only includes companies with BOTH Seed and Series A

**Why it matters:** Tests multi-step query construction.

---

#### `cohort-001`: Series A to B Conversion
**Input:** "What's the conversion rate from Series A to Series B, broken down by year of Series A?"

**Expected output columns:** year, series_a_count, converted_to_b, conversion_rate

**Pass criteria:**
- Groups by year of Series A
- Uses LEFT JOIN to include non-converters
- Calculates percentage, not just counts

**Why it matters:** Classic cohort analysis pattern.

---

#### `trend-002`: Industry Shift Analysis
**Input:** "Which industries are gaining momentum and which are losing it? Compare 2022-2023 vs 2024."

**Pass criteria:**
- Calculates percentage change by industry
- Identifies gainers AND losers
- Provides interpretation, not just numbers

**Why it matters:** Tests comparative analysis across time periods.

---

#### `predict-001`: Series B Prediction ⭐
**Input:** "Which Series A companies are most likely to raise Series B next? Consider: funding amount vs industry median, investor track record, and time since Series A. Rank your top 5 with explicit reasoning."

**Candidate pool:** FastFlux, OmniLink, OpenEdge, SuperAI, PrimeNode, RealEdge, FastWave, HyperLabs

**Pass criteria:**
- Correctly identifies companies with Series A but NO Series B
- Uses `NOT EXISTS` or `LEFT JOIN WHERE NULL` pattern
- Considers multiple factors (not just amount)
- Provides explicit reasoning per company
- Acknowledges uncertainty

**Why it matters:** This is the key eval. Tests reasoning and synthesis, not just retrieval.

---

#### `predict-002`: Investor Pattern Analysis
**Input:** "Based on historical patterns, which investors are most likely to lead a Series B round for an AI/ML company?"

**Pass criteria:**
- Identifies investors who have led Series B historically
- Filters by AI/ML exposure
- Considers follow-on patterns
- Names specific investors with data support

**Why it matters:** Tests pattern recognition and domain synthesis.

---

#### `complex-001`: Multi-Step Analysis ⭐
**Input:** "I want to understand the Developer Tools market. Give me: (1) total funding by year, (2) top 5 investors in this space, (3) average time between rounds, and (4) your assessment of market health."

**Pass criteria:**
- Answers ALL 4 sub-questions
- Uses correct industry filter throughout
- Provides specific numbers
- Synthesizes into coherent assessment

**Why it matters:** Tests ability to handle complex, multi-part requests.

---

## Scoring

| Difficulty | Weight | Expected Pass Rate |
|------------|--------|-------------------|
| Easy | 1x | 95% |
| Medium | 2x | 80% |
| Hard | 3x | 60% |

**Overall pass threshold:** 70%

If you're passing 100% of evals, they're probably too easy. A good agent should fail some hard evals - that's how you know you're testing meaningful things.

---

## Adding New Evals

Add to `data/evals/funding-analysis-evals.json`:

```json
{
  "id": "new-001",
  "name": "Your Eval Name",
  "difficulty": "medium",
  "category": "your_category",
  "input": "The question to ask the agent",
  "expected": {
    "answer": "what you expect",
    "sql_pattern": "optional SQL to look for"
  },
  "pass_criteria": [
    "Criterion 1",
    "Criterion 2"
  ]
}
```

Then run `python3 scripts/run-funding-evals.py --id=new-001` to test.
