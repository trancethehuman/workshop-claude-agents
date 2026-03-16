# Startup Funding Analyst - Memory

## Database
- Path: `/Users/hainghiem/development/workshop-claude-agents/data/startup-funding.db`

## Tables
- `startups` — company info (id, name, ...)
- `funding_rounds` — columns: id, startup_id, stage, amount_usd, funding_date, lead_investor_id, valuation_usd, announced
- `investors` — investor info
- `investor_portfolio` — join table for investors and startups
- `startup_metrics` — performance metrics per startup
- `funding_summary` — pre-aggregated summary view

## Key Join Pattern
```sql
SELECT s.name, fr.amount_usd, fr.stage, fr.funding_date
FROM funding_rounds fr
JOIN startups s ON fr.startup_id = s.id
```

## Notes
- Monetary columns: `amount_usd`, `valuation_usd` (integers, in USD)
- Date column: `funding_date` (DATE type, format YYYY-MM-DD)
- `announced` is an integer boolean flag
