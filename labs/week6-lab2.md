# Week 6 Lab 2: Build a Headless GTM Agent

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes (+ optional bonus)  
**Focus:** Building a batch lead enrichment service with concurrency and structured output

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This lab builds a production-ready lead enrichment service that processes leads in batches.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Lead Enrichment Architecture                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │                    Lead Enricher Service                 │          │
│   │                                                          │          │
│   │   Input: leads[]  ──▶  enrichBatch()  ──▶  Output: JSON  │          │
│   └─────────────────────────────┬────────────────────────────┘          │
│                                 │                                       │
│          ┌──────────────────────┼──────────────────────┐                │
│          │                      │                      │                │
│          ▼                      ▼                      ▼                │
│   ┌────────────┐         ┌────────────┐         ┌────────────┐          │
│   │   Lead 1   │         │   Lead 2   │         │   Lead 3   │          │
│   │   Agent    │         │   Agent    │         │   Agent    │          │
│   │ (Research) │         │ (Research) │         │ (Research) │          │
│   └────────────┘         └────────────┘         └────────────┘          │
│         │                      │                      │                 │
│         ▼                      ▼                      ▼                 │
│   [EnrichedLead]         [EnrichedLead]         [EnrichedLead]          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A Lead Enrichment Service for headless batch processing with concurrency control.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 1 complete** - SDK installed and working
- [ ] **Database Analyzer runs** - query() function tested
- [ ] **Anthropic API key set** - ANTHROPIC_API_KEY exported

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Define TypeScript types for leads and enrichment
2. Build a single lead enricher
3. Implement batch processing with concurrency control
4. Output structured JSON results
5. Handle errors and edge cases

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 2.1 | Create Project Structure | 5 min |
| 2.2 | Build the Enricher | 20 min |
| 2.3 | Create the Main Runner | 10 min |
| 2.4 | Run and Validate | 10 min |
| | **TOTAL** | **45 min** |
| **Bonus** | Sandboxed Execution | 30 min |

---

## Task 2.1: Create Project Structure (5 min)

Build a lead enrichment service that processes leads in batches.

1. **Create the project:**
   ```bash
   mkdir -p agents/lead-enricher/src
   cd agents/lead-enricher
   npm init -y
   npm install @anthropic-ai/claude-agent-sdk typescript ts-node zod
   ```

2. **Create the types file (`src/types.ts`):**

   ```typescript
   export interface Lead {
     name: string;
     company: string;
     email: string;
     title?: string;
   }

   export interface EnrichedLead extends Lead {
     companySize?: string;
     industry?: string;
     recentNews?: string[];
     linkedinUrl?: string;
     enrichedAt: Date;
     score?: number;
   }

   export interface EnrichmentResult {
     lead: EnrichedLead;
     success: boolean;
     error?: string;
     duration: number;
   }
   ```

---

## Task 2.2: Build the Enricher (20 min)

Create the core enrichment logic.

1. **Create `src/enricher.ts`:**

   ```typescript
   import { query } from "@anthropic-ai/claude-agent-sdk";
   import { Lead, EnrichedLead, EnrichmentResult } from './types';

   const ENRICHMENT_PROMPT = `
   You are a lead research specialist. Given a lead, research their company and provide:

   1. Company size (employees)
   2. Industry/vertical
   3. Recent news (last 3 months)
   4. LinkedIn profile URL if findable

   Be concise. If you can't find information, say "Not found" for that field.

   Output as JSON:
   {
     "companySize": "...",
     "industry": "...",
     "recentNews": ["...", "..."],
     "linkedinUrl": "..."
   }
   `;

   export async function enrichLead(lead: Lead): Promise<EnrichmentResult> {
     const startTime = Date.now();

     try {
       const result = await query({
         prompt: `Research this lead:
   Name: ${lead.name}
   Company: ${lead.company}
   Email: ${lead.email}
   Title: ${lead.title || 'Unknown'}

   ${ENRICHMENT_PROMPT}`,
         options: {
           maxTurns: 8,
           tools: ['WebSearch', 'WebFetch'],
           dangerouslyAllowAllTools: true,
         }
       });

       // Parse the JSON from response
       const jsonMatch = result.text.match(/\{[\s\S]*\}/);
       if (!jsonMatch) {
         throw new Error('No JSON found in response');
       }

       const enrichment = JSON.parse(jsonMatch[0]);

       const enrichedLead: EnrichedLead = {
         ...lead,
         ...enrichment,
         enrichedAt: new Date(),
       };

       return {
         lead: enrichedLead,
         success: true,
         duration: Date.now() - startTime,
       };
     } catch (error) {
       return {
         lead: { ...lead, enrichedAt: new Date() },
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error',
         duration: Date.now() - startTime,
       };
     }
   }

   export async function enrichBatch(
     leads: Lead[],
     concurrency: number = 2
   ): Promise<EnrichmentResult[]> {
     const results: EnrichmentResult[] = [];

     // Process in batches for rate limiting
     for (let i = 0; i < leads.length; i += concurrency) {
       const batch = leads.slice(i, i + concurrency);
       console.log(`\nProcessing batch ${Math.floor(i/concurrency) + 1}...`);

       const batchResults = await Promise.all(
         batch.map(lead => {
           console.log(`  Enriching: ${lead.name} @ ${lead.company}`);
           return enrichLead(lead);
         })
       );
       results.push(...batchResults);

       console.log(`Completed ${Math.min(i + concurrency, leads.length)}/${leads.length} leads`);
     }

     return results;
   }
   ```

---

## Task 2.3: Create the Main Runner (10 min)

1. **Create `src/index.ts`:**

   ```typescript
   import { enrichBatch } from './enricher';
   import { Lead } from './types';
   import * as fs from 'fs';

   // Sample leads (in production, load from CSV or API)
   const leads: Lead[] = [
     {
       name: "Sarah Chen",
       company: "Anthropic",
       email: "sarah@anthropic.com",
       title: "VP Engineering"
     },
     {
       name: "Mike Johnson",
       company: "OpenAI",
       email: "mike@openai.com",
       title: "CTO"
     },
     {
       name: "Lisa Park",
       company: "Stripe",
       email: "lisa@stripe.com",
       title: "Head of Product"
     }
   ];

   async function main() {
     console.log('=== Lead Enrichment Service ===');
     console.log(`Starting enrichment of ${leads.length} leads...\n`);

     const results = await enrichBatch(leads, 2);

     // Summary
     const successful = results.filter(r => r.success).length;
     const failed = results.filter(r => !r.success).length;
     const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

     console.log('\n=== Enrichment Complete ===');
     console.log(`Successful: ${successful}`);
     console.log(`Failed: ${failed}`);
     console.log(`Total time: ${(totalDuration / 1000).toFixed(1)}s`);
     console.log(`Avg per lead: ${(totalDuration / results.length / 1000).toFixed(1)}s`);

     // Save results
     const outputDir = 'output';
     if (!fs.existsSync(outputDir)) {
       fs.mkdirSync(outputDir, { recursive: true });
     }

     fs.writeFileSync(
       `${outputDir}/enriched-leads.json`,
       JSON.stringify(results, null, 2)
     );
     console.log('\nResults saved to output/enriched-leads.json');

     // Display enriched data
     console.log('\n=== Enriched Leads ===\n');
     results.forEach(r => {
       console.log(`${r.lead.name} @ ${r.lead.company}`);
       console.log(`  Industry: ${r.lead.industry || 'N/A'}`);
       console.log(`  Size: ${r.lead.companySize || 'N/A'}`);
       console.log(`  Status: ${r.success ? 'Success' : 'Failed'}`);
       console.log('');
     });
   }

   main().catch(console.error);
   ```

---

## Task 2.4: Run and Validate (10 min)

1. **Run the enricher:**
   ```bash
   npx ts-node src/index.ts
   ```

2. **Check the output file:**
   ```bash
   cat output/enriched-leads.json
   ```

3. **Record your results:**

| Metric | Your Result |
|--------|-------------|
| Leads processed | |
| Success rate | |
| Average time per lead | |
| Data fields populated | |

4. **Try with different leads:**
   - Add a lead with a less-known company
   - Add a lead with incomplete information
   - Observe how the agent handles edge cases

---

## Bonus Task: Add Lead Scoring

Extend the enricher to score leads after enrichment:

```typescript
// Add to enricher.ts

export async function scoreLead(lead: EnrichedLead): Promise<number> {
  const result = await query({
    prompt: `Score this lead from 0-100 based on:
- Company size (larger = higher score for B2B)
- Title seniority (VP/C-level = higher)
- Industry fit (tech = higher)

Lead:
${JSON.stringify(lead, null, 2)}

Return only a number 0-100.`,
    options: {
      maxTurns: 1,
    }
  });

  return parseInt(result.text.trim()) || 50;
}
```

---

## Bonus: Sandboxed Execution with Daytona (30 minutes)

For production agents, running code in a sandbox adds a layer of security.

### Task B.1: Set Up Daytona (10 min)

1. **Get API key:** Sign up at [daytona.io](https://daytona.io)

2. **Install the SDK:**

   **Python:**
   ```bash
   pip install daytona-sdk
   ```

   **TypeScript:**
   ```bash
   npm install @daytonaio/sdk
   ```

3. **Set environment variable:**
   ```bash
   # macOS/Linux:
   export DAYTONA_API_KEY=your_api_key_here

   # Windows PowerShell:
   $env:DAYTONA_API_KEY = "your_api_key_here"

   # Windows CMD:
   set DAYTONA_API_KEY=your_api_key_here
   ```

### Task B.2: Run Agent in Sandbox (20 min)

Create a sandboxed analysis agent.

**Python (`sandboxed_analyzer.py`):**

```python
import asyncio
from daytona_sdk import Daytona
from claude_agent_sdk import query, ClaudeAgentOptions

async def run_sandboxed_agent(task: str, data_file: str):
    """Run an agent in a Daytona sandbox with file access."""

    daytona = Daytona()
    sandbox = daytona.create()

    try:
        # Upload data file to sandbox
        print(f"Uploading {data_file} to sandbox...")
        sandbox.fs.upload_file(data_file, f"/workspace/{data_file}")

        # Run the agent
        print("Running agent in sandbox...")
        async for message in query(
            prompt=f"""
            You are running in a sandboxed environment.
            Working directory: /workspace
            Data file: /workspace/{data_file}

            Task: {task}

            Execute any analysis code directly. The environment has Python
            with pandas, numpy, and sqlite3 installed.
            """,
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Write", "Bash"],
                permission_mode="bypassPermissions"  # Safe because sandboxed
            )
        ):
            if hasattr(message, "result"):
                print(message.result)

        # Download results if created
        try:
            sandbox.fs.download_file("/workspace/output/results.json", "./results.json")
            print("\nResults downloaded to ./results.json")
        except:
            print("\nNo results file created")

    finally:
        print("Cleaning up sandbox...")
        sandbox.delete()

if __name__ == "__main__":
    asyncio.run(run_sandboxed_agent(
        task="Analyze the funding data and show top 5 investors by deal count",
        data_file="../../data/startup-funding.db"
    ))
```

**TypeScript (`sandboxed-analyzer.ts`):**

```typescript
import { Daytona } from "@daytonaio/sdk";
import { query } from "@anthropic-ai/claude-agent-sdk";

async function runSandboxedAgent(task: string, dataFile: string) {
  const daytona = new Daytona();
  const sandbox = await daytona.create({ language: "python" });

  try {
    // Upload data file
    console.log(`Uploading ${dataFile} to sandbox...`);
    await sandbox.fs.uploadFile(dataFile, `/workspace/${dataFile}`);

    // Run the agent
    console.log("Running agent in sandbox...");
    for await (const message of query({
      prompt: `
        You are running in a sandboxed environment.
        Working directory: /workspace
        Data file: /workspace/${dataFile}

        Task: ${task}

        Execute any analysis code directly.
      `,
      options: {
        allowedTools: ["Read", "Write", "Bash"],
        permissionMode: "bypassPermissions"
      }
    })) {
      if ("result" in message) {
        console.log(message.result);
      }
    }

    // Download results
    try {
      await sandbox.fs.downloadFile("/workspace/output/results.json", "./results.json");
      console.log("\nResults downloaded to ./results.json");
    } catch {
      console.log("\nNo results file created");
    }

  } finally {
    console.log("Cleaning up sandbox...");
    await sandbox.delete();
  }
}

runSandboxedAgent(
  "Analyze the funding data and show top 5 investors by deal count",
  "../../data/startup-funding.db"
).catch(console.error);
```

### Bonus Success Criteria

- [ ] Daytona SDK installed and configured
- [ ] Sandbox created successfully
- [ ] Data file uploaded to sandbox
- [ ] Agent executed within sandbox
- [ ] Sandbox cleaned up after execution

---

## Troubleshooting

### Execution Issues

| Problem | Solution |
|---------|----------|
| Tool calls fail | Verify tools are in allowed list |
| JSON parsing fails | Agent output may not be clean JSON; add error handling |
| Timeout errors | Increase `maxTurns` or simplify the task |
| Batch processing hangs | Reduce concurrency, add timeout per request |

### Daytona Issues

| Problem | Solution |
|---------|----------|
| Sandbox creation fails | Check Daytona API key is valid |
| File upload fails | Verify file path exists locally |
| Code execution errors | Check Python packages are available in sandbox |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Type definitions created** - Lead, EnrichedLead, EnrichmentResult
- [ ] **Single lead enrichment works** - enrichLead() returns data
- [ ] **Batch processing with concurrency** - enrichBatch() handles multiple leads
- [ ] **JSON output saved to file** - output/enriched-leads.json exists
- [ ] **Summary statistics displayed** - Success/fail counts, timing
- [ ] **At least 2 leads enriched** - Actual company data found

**Document your service:**

| Metric | Your Implementation |
|--------|---------------------|
| Concurrency level | |
| Average enrichment time | |
| Success rate | |
| Output file size | |

---

**End of Lab 2**
