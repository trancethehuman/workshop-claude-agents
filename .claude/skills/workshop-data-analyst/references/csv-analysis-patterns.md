# CSV Analysis Patterns

Python/pandas patterns for analyzing `data/customer-metrics.csv`.

All snippets use `python3 -c` for quick inline analysis. For longer scripts, save to a temporary file.

---

## Loading and Profiling

### Basic Profile

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
print(f'Shape: {df.shape}')
print(f'Date range: {df.month.min()} to {df.month.max()}')
print(f'Companies: {df.company.nunique()}')
print(f'Statuses: {df.status.value_counts().to_dict()}')
print()
print(df.describe().round(1))
"
```

### Column Overview

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
for col in df.columns:
    nulls = df[col].isna().sum()
    uniq = df[col].nunique()
    print(f'{col:25s} nulls={nulls:3d}  unique={uniq:4d}  dtype={df[col].dtype}')
"
```

### Dimension Value Counts

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
for col in ['industry', 'region', 'segment', 'product', 'acquisition_channel', 'status']:
    print(f'\n--- {col} ---')
    print(df[col].value_counts())
"
```

---

## Revenue Analysis

### Net Revenue Retention by Segment

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
df['month'] = pd.to_datetime(df['month'])

# Compare first and last month MRR by segment
first = df.groupby(['company','segment'])['mrr_usd'].first().reset_index()
last = df.groupby(['company','segment'])['mrr_usd'].last().reset_index()
merged = first.merge(last, on=['company','segment'], suffixes=('_start','_end'))

retention = merged.groupby('segment').agg(
    start_mrr=('mrr_usd_start','sum'),
    end_mrr=('mrr_usd_end','sum')
).assign(
    nrr_pct=lambda x: (x.end_mrr / x.start_mrr * 100).round(1)
)
print(retention)
"
```

### MRR by Segment and Region

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
pivot = df.pivot_table(
    values='mrr_usd',
    index='segment',
    columns='region',
    aggfunc=['sum','mean','count']
).round(0)
print(pivot)
"
```

---

## Churn Signal Detection

### Identify At-Risk Accounts

Churn signals: declining logins, rising tickets, dropping NPS, low feature usage.

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
df['month'] = pd.to_datetime(df['month'])

# Get latest month data for active customers
latest = df.sort_values('month').groupby('company').tail(1)
active = latest[latest['status'] == 'Active'].copy()

# Score risk factors
active['low_logins'] = (active['monthly_logins'] < active['monthly_logins'].quantile(0.25)).astype(int)
active['high_tickets'] = (active['support_tickets'] > active['support_tickets'].quantile(0.75)).astype(int)
active['low_nps'] = (active['nps_score'] < 7).astype(int)
active['low_features'] = (active['features_used'] < active['features_used'].quantile(0.25)).astype(int)
active['risk_score'] = active[['low_logins','high_tickets','low_nps','low_features']].sum(axis=1)

at_risk = active[active['risk_score'] >= 2].sort_values('risk_score', ascending=False)
print(f'At-risk accounts: {len(at_risk)}')
print(at_risk[['company','segment','mrr_usd','risk_score','monthly_logins','support_tickets','nps_score']].to_string(index=False))
"
```

### Login Trend by Company (Decline Detection)

```bash
python3 -c "
import pandas as pd
import numpy as np
df = pd.read_csv('data/customer-metrics.csv')
df['month'] = pd.to_datetime(df['month'])

# Calculate login trend slope per company
def login_slope(group):
    if len(group) < 3:
        return np.nan
    x = np.arange(len(group))
    y = group['monthly_logins'].values
    return np.polyfit(x, y, 1)[0]

slopes = df.sort_values('month').groupby('company').apply(login_slope).reset_index()
slopes.columns = ['company', 'login_trend']
declining = slopes[slopes['login_trend'] < -2].sort_values('login_trend')
print('Companies with declining login trends:')
print(declining.to_string(index=False))
"
```

---

## Trend Analysis

### Rolling Averages

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
df['month'] = pd.to_datetime(df['month'])

monthly = df.groupby('month').agg(
    total_mrr=('mrr_usd','sum'),
    avg_logins=('monthly_logins','mean'),
    avg_nps=('nps_score','mean'),
    total_tickets=('support_tickets','sum')
).sort_index()

monthly['mrr_3mo_avg'] = monthly['total_mrr'].rolling(3).mean()
monthly['logins_3mo_avg'] = monthly['avg_logins'].rolling(3).mean()

print(monthly.round(1).to_string())
"
```

### Month-over-Month MRR Growth

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
df['month'] = pd.to_datetime(df['month'])

monthly_mrr = df.groupby('month')['mrr_usd'].sum().sort_index()
growth = monthly_mrr.pct_change() * 100

result = pd.DataFrame({
    'mrr': monthly_mrr,
    'mom_growth_pct': growth.round(1)
})
print(result.to_string())
"
```

---

## Segmented Analysis

### Pivot Table: Segment x Product

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')
pivot = df.pivot_table(
    values='mrr_usd',
    index='segment',
    columns='product',
    aggfunc='sum'
).round(0)
print(pivot)
"
```

### Cohort by Tenure

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')

# Get latest record per company
latest = df.sort_values('month').groupby('company').tail(1)

# Create tenure buckets
bins = [0, 6, 12, 24, 100]
labels = ['0-6mo', '7-12mo', '13-24mo', '24mo+']
latest['tenure_bucket'] = pd.cut(latest['months_as_customer'], bins=bins, labels=labels)

summary = latest.groupby('tenure_bucket').agg(
    companies=('company','count'),
    avg_mrr=('mrr_usd','mean'),
    avg_logins=('monthly_logins','mean'),
    avg_nps=('nps_score','mean'),
    churn_count=('status', lambda x: (x == 'Churned').sum())
).round(1)
print(summary)
"
```

### Account Owner Performance

```bash
python3 -c "
import pandas as pd
df = pd.read_csv('data/customer-metrics.csv')

# Latest record per company
latest = df.sort_values('month').groupby('company').tail(1)

owner_stats = latest.groupby('account_owner').agg(
    accounts=('company','count'),
    total_mrr=('mrr_usd','sum'),
    avg_nps=('nps_score','mean'),
    churned=('status', lambda x: (x == 'Churned').sum())
).assign(
    churn_rate=lambda x: (x.churned / x.accounts * 100).round(1)
).sort_values('total_mrr', ascending=False)
print(owner_stats)
"
```
