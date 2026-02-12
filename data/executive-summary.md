# Customer Metrics Executive Summary

**Prepared:** February 2025 | **Data Range:** Jan 2023 – Mar 2025 | **Accounts:** 30

---

## Dataset Overview

- **682 monthly records** across 30 SaaS accounts over 27 months
- **Segments:** 11 Enterprise, 11 Mid-Market, 8 SMB
- **Industries:** Healthcare (20%), Technology (20%), Manufacturing (19%), Retail (16%), Financial Services (14%), Education (11%)
- **Data quality:** NPS scores missing for 27.7% of records; all other fields complete

## Net Revenue Retention (Jan 2024 → Jan 2025)

| Segment | Starting MRR | Ending MRR | Expansion | Churned MRR | NRR |
|---|---|---|---|---|---|
| **Enterprise** | $219,043 | $293,484 | $105,346 | $30,905 | **134.0%** |
| **Mid-Market** | $43,690 | $51,803 | $16,017 | $7,904 | **118.6%** |
| **SMB** | $16,103 | $17,978 | $2,129 | $0 | **111.6%** |
| **Overall** | $278,836 | $363,265 | — | — | **130.3%** |

Enterprise drives both the strongest expansion and the largest absolute churn. Mid-Market lost 2 accounts ($7.9K MRR). SMB retained all accounts with modest growth.

## Churn Risk Model: What Predicts Churn

Analysis of 4 churned accounts revealed a consistent pre-churn signature in the **3 months before cancellation**:

| Leading Indicator | Avg. Change Before Churn | Predictive Weight |
|---|---|---|
| Login frequency | **-46% decline** | High |
| Support tickets | **+196% spike** | High |
| NPS score | **-39 point drop** | High |
| Feature usage | **-9% decline** | Moderate |
| MRR trend | +16% (no signal) | None — revenue often *rises* before churn |

**Key insight:** Revenue is a lagging indicator. Accounts that churned were actually *increasing* spend right before leaving. The real warning signs are engagement collapse (logins, NPS) and support escalation.

## Top 3 At-Risk Accounts

| Rank | Account | Segment | MRR at Risk | Risk Score | Warning Signals | Owner |
|---|---|---|---|---|---|---|
| 1 | **Apex Industries** | Enterprise | $24,217 | 65/100 | Feature usage -21%, tickets +39%, NPS -10 pts | Eva Martinez |
| 2 | **BrightPath Education** | SMB | $4,566 | 40/100 | Tickets +50%, NPS -17 pts | Bob Smith |
| 3 | **EcoSystems Ltd** | SMB | $887 | 25/100 | Logins -38% | Bob Smith |

**Total MRR at risk: $29,670/month ($356K annualized)**

## Recommended Actions

### Apex Industries — URGENT (Enterprise, $24K MRR)
- **This week:** Eva Martinez schedules executive check-in to understand pain points behind the ticket spike
- **Within 30 days:** Conduct feature adoption workshop — usage dropped 21%, suggesting they may not be getting value from recent product changes
- **Ongoing:** Assign a dedicated CSM for weekly syncs until NPS stabilizes

### BrightPath Education — HIGH (SMB, $4.6K MRR)
- **This week:** Bob Smith reviews open support tickets for recurring themes — a 50% spike signals a systemic issue, not one-offs
- **Within 30 days:** Schedule an NPS deep-dive call. A 17-point drop in an Expanded account suggests expectations aren't being met post-upsell
- **Ongoing:** Consider whether this account needs a Mid-Market-level support plan given its growth trajectory

### EcoSystems Ltd — MONITOR (SMB, $887 MRR)
- **This week:** Bob Smith sends a personal outreach — a 38% login drop often means they've found an alternative or deprioritized the tool
- **Within 30 days:** Offer a re-engagement session (free training, use-case review) to rebuild the usage habit
- **Ongoing:** Low MRR but a canary for other SMB accounts — investigate if this pattern exists in the broader SMB cohort

---

*Analysis performed by Claude Code on customer-metrics.csv (682 records, 30 accounts, 27 months of data).*
