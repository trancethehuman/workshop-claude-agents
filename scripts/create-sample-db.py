#!/usr/bin/env python3
"""
Creates a sample SQLite database for the AI for Data Science workshop.
Run this script to generate data/sample-sales.db
"""

import sqlite3
import random
from datetime import datetime, timedelta

def create_database():
    conn = sqlite3.connect('data/sample-sales.db')
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            industry TEXT NOT NULL,
            company_size TEXT NOT NULL,
            annual_revenue INTEGER,
            region TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS deals (
            id INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            deal_name TEXT NOT NULL,
            value INTEGER NOT NULL,
            stage TEXT NOT NULL,
            probability INTEGER NOT NULL,
            owner TEXT NOT NULL,
            created_at TEXT NOT NULL,
            closed_at TEXT,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY,
            deal_id INTEGER NOT NULL,
            activity_type TEXT NOT NULL,
            description TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (deal_id) REFERENCES deals(id)
        )
    ''')

    # Sample data
    industries = ['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail', 'Education']
    sizes = ['1-50', '51-200', '201-500', '501-1000', '1000+']
    regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America']
    stages = ['Prospecting', 'Qualification', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
    owners = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eva Martinez']
    activity_types = ['Email', 'Call', 'Meeting', 'Demo', 'Proposal Sent', 'Contract Review']

    # Insert customers
    customers_data = []
    for i in range(1, 51):
        customers_data.append((
            i,
            f"Company {i}",
            random.choice(industries),
            random.choice(sizes),
            random.randint(500000, 50000000),
            random.choice(regions),
            (datetime.now() - timedelta(days=random.randint(30, 365))).isoformat()
        ))

    cursor.executemany('''
        INSERT OR REPLACE INTO customers (id, name, industry, company_size, annual_revenue, region, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', customers_data)

    # Insert deals
    deals_data = []
    for i in range(1, 101):
        stage = random.choice(stages)
        probability = {'Prospecting': 10, 'Qualification': 20, 'Demo': 40, 'Proposal': 60,
                       'Negotiation': 80, 'Closed Won': 100, 'Closed Lost': 0}[stage]
        closed_at = None
        if stage in ['Closed Won', 'Closed Lost']:
            closed_at = (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()

        deals_data.append((
            i,
            random.randint(1, 50),
            f"Deal {i} - {'Expansion' if random.random() > 0.7 else 'New Business'}",
            random.randint(10000, 150000),
            stage,
            probability,
            random.choice(owners),
            (datetime.now() - timedelta(days=random.randint(1, 180))).isoformat(),
            closed_at
        ))

    cursor.executemany('''
        INSERT OR REPLACE INTO deals (id, customer_id, deal_name, value, stage, probability, owner, created_at, closed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', deals_data)

    # Insert activities
    activities_data = []
    activity_id = 1
    for deal_id in range(1, 101):
        num_activities = random.randint(2, 8)
        for _ in range(num_activities):
            activities_data.append((
                activity_id,
                deal_id,
                random.choice(activity_types),
                f"Activity note for deal {deal_id}",
                (datetime.now() - timedelta(days=random.randint(1, 60))).isoformat()
            ))
            activity_id += 1

    cursor.executemany('''
        INSERT OR REPLACE INTO activities (id, deal_id, activity_type, description, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', activities_data)

    conn.commit()
    conn.close()
    print("Database created: data/sample-sales.db")
    print("Tables: customers (50 rows), deals (100 rows), activities (~500 rows)")

if __name__ == '__main__':
    create_database()
