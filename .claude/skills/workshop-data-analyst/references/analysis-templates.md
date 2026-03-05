# Analysis Report Templates

Three reusable report templates for the workshop's most common analysis scenarios.

---

## Template 1: Funding Landscape Report

**Data sources:** `data/startup-funding.db`
**Output file:** `output/funding-landscape-{YYYY-MM-DD}.md`

```markdown
# Funding Landscape Report
**Date:** {date}
**Data source:** startup-funding.db

## Market Overview

| Metric | Value |
|--------|-------|
| Total startups tracked | {n} |
| Total funding rounds | {n} |
| Total capital deployed | ${n}M |
| Average round size | ${n}M |
| Date range | {start} to {end} |
| Active investors | {n} |

## Industry Breakdown

| Industry | Startups | Rounds | Total Funding ($M) | Avg Round ($M) |
|----------|----------|--------|-------------------|----------------|
| ... | ... | ... | ... | ... |

## Stage Distribution

| Stage | Count | Total ($M) | Avg ($M) | % of Total |
|-------|-------|-----------|---------|-----------|
| Pre-Seed | ... | ... | ... | ... |
| Seed | ... | ... | ... | ... |
| Series A | ... | ... | ... | ... |
| Series B | ... | ... | ... | ... |
| Series C | ... | ... | ... | ... |

## Top Investors

| Investor | Type | Portfolio Cos | Total Invested ($M) | Focus Stages |
|----------|------|--------------|-------------------|-------------|
| ... | ... | ... | ... | ... |

## Conversion Funnel

| Transition | Companies | Conversion Rate |
|-----------|-----------|----------------|
| Seed → Series A | ... | ...% |
| Series A → B | ... | ...% |
| Series B → C | ... | ...% |

## Key Findings

| # | Finding | Evidence | Significance |
|---|---------|----------|-------------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |
| 3 | ... | ... | ... |

## Recommendations

| Priority | Recommendation | Based On | Expected Impact |
|----------|---------------|----------|----------------|
| HIGH | ... | Finding #N | ... |
| MEDIUM | ... | Finding #N | ... |
```

---

## Template 2: Customer Health & Churn Risk Report

**Data sources:** `data/customer-metrics.csv`
**Output file:** `output/churn-risk-{YYYY-MM-DD}.md`

```markdown
# Customer Health & Churn Risk Report
**Date:** {date}
**Data source:** customer-metrics.csv

## Key Metrics

| Metric | Value |
|--------|-------|
| Total customers tracked | {n} |
| Active customers | {n} |
| Churned customers | {n} |
| Total MRR | ${n} |
| Average MRR per customer | ${n} |
| Average NPS | {n} |
| Date range | {start} to {end} |

## Health by Segment

| Segment | Customers | Avg MRR | Avg Logins | Avg NPS | Churn Rate |
|---------|-----------|---------|-----------|---------|-----------|
| ... | ... | ... | ... | ... | ... |

## Churn Indicators

Accounts flagged based on: low logins (<25th percentile), high tickets (>75th percentile), NPS < 7, low feature usage (<25th percentile).

| Risk Score | Accounts | Total MRR at Risk |
|-----------|----------|------------------|
| 4 (Critical) | ... | $... |
| 3 (High) | ... | $... |
| 2 (Warning) | ... | $... |

## At-Risk Accounts (Score >= 2)

| Company | Segment | MRR | Risk Score | Logins | Tickets | NPS |
|---------|---------|-----|-----------|--------|---------|-----|
| ... | ... | ... | ... | ... | ... | ... |

## Trends

| Month | Total MRR | MoM Growth | Avg Logins | Avg NPS |
|-------|----------|-----------|-----------|---------|
| ... | ... | ... | ... | ... |

## Account Owner Performance

| Owner | Accounts | Total MRR | Avg NPS | Churn Rate |
|-------|----------|----------|---------|-----------|
| ... | ... | ... | ... | ... |

## Key Findings

| # | Finding | Evidence | Significance |
|---|---------|----------|-------------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |
| 3 | ... | ... | ... |

## Recommended Actions

| Priority | Recommendation | Based On | Expected Impact |
|----------|---------------|----------|----------------|
| HIGH | ... | Finding #N | ... |
| MEDIUM | ... | Finding #N | ... |
```

---

## Template 3: Sales Pipeline Intelligence Report

**Data sources:** `data/sample-sales.db`, `data/sample-deals.json`
**Output file:** `output/pipeline-intelligence-{YYYY-MM-DD}.md`

```markdown
# Sales Pipeline Intelligence Report
**Date:** {date}
**Data sources:** sample-sales.db, sample-deals.json

## Pipeline Overview

| Metric | Value |
|--------|-------|
| Total deals | {n} |
| Open deals | {n} |
| Closed Won | {n} |
| Closed Lost | {n} |
| Total pipeline value | ${n} |
| Weighted pipeline | ${n} |
| Average deal size | ${n} |
| Average win rate | {n}% |

## Stage Distribution

| Stage | Deals | Total Value | Avg Value | Avg Probability | Weighted Value |
|-------|-------|------------|----------|----------------|---------------|
| ... | ... | ... | ... | ... | ... |

## Rep Performance

| Rep | Deals | Won | Lost | Win Rate | Revenue Won | Avg Deal Size |
|-----|-------|-----|------|---------|------------|--------------|
| ... | ... | ... | ... | ... | ... | ... |

## Deal Velocity

| Stage | Avg Days to Close | Fastest | Slowest |
|-------|------------------|---------|---------|
| ... | ... | ... | ... |

## At-Risk Deals (from sample-deals.json)

| Deal | Company | Value | Stage | Days in Stage | Competitors | Risk Factors |
|------|---------|-------|-------|--------------|------------|-------------|
| ... | ... | ... | ... | ... | ... | ... |

## Industry Analysis

| Industry | Deals | Total Value | Won Value | Win Rate |
|----------|-------|------------|----------|---------|
| ... | ... | ... | ... | ... |

## Key Findings

| # | Finding | Evidence | Significance |
|---|---------|----------|-------------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |
| 3 | ... | ... | ... |

## Recommendations

| Priority | Recommendation | Based On | Expected Impact |
|----------|---------------|----------|----------------|
| HIGH | ... | Finding #N | ... |
| MEDIUM | ... | Finding #N | ... |
```
