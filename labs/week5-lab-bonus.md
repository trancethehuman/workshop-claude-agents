# Week 5 Bonus Lab: RAG with Vectorize.io

**Course:** Claude Agents Workshop  
**Duration:** 30+ minutes  
**Focus:** Adding retrieval-augmented generation (RAG) to your GTM pipeline using Vectorize.io

**Windows users:** Shell commands in this lab use Unix syntax. See [`references/windows-setup.md`](../references/windows-setup.md) for the Windows equivalents, or use WSL2.

---

## Lab Architecture

This bonus lab adds knowledge retrieval to your pipeline.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     RAG-Enhanced Pipeline Architecture                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                     Vectorize.io                             │      │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │      │
│   │  │  Playbooks  │  │ Deal Notes  │  │ Win/Loss    │           │      │
│   │  │             │  │             │  │ Analysis    │           │      │
│   │  └─────────────┘  └─────────────┘  └─────────────┘           │      │
│   └────────────────────────────┬─────────────────────────────────┘      │
│                                │                                        │
│                                ▼                                        │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                   Knowledge Enricher Agent                   │      │
│   │  "Find similar deals and playbook guidance for this lead"    │      │
│   └────────────────────────────┬─────────────────────────────────┘      │
│                                │                                        │
│                                ▼                                        │
│   ┌──────────────────────────────────────────────────────────────┐      │
│   │                      Pipeline Output                         │      │
│   │  Lead + Enrichment + Historical Context + Recommendations    │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A knowledge-enriched pipeline that leverages historical sales data for better lead processing.

---

## Prerequisites

Before starting this lab, verify:

- [ ] **Lab 2 complete** - GTM pipeline working with lead-enricher and email-drafter
- [ ] **Vectorize.io account** - Create at [vectorize.io](https://vectorize.io)
- [ ] **Sales documents ready** - Playbooks, deal notes, or win/loss analyses to upload
- [ ] **Claude Code running** - Start with `claude` in the repo directory

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Set up a Vectorize.io pipeline with your sales documents
2. Create an MCP agent in Vectorize for retrieval
3. Connect the MCP server to Claude Code
4. Build a knowledge-enricher agent
5. Run the enhanced pipeline with historical context

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| B.1 | Set Up Vectorize.io | 10 min |
| B.2 | Create MCP Agent in Vectorize | 5 min |
| B.3 | Connect to Claude Code | 5 min |
| B.4 | Test the RAG Integration | 10 min |
| | **TOTAL** | **30 min** |

---

## Scenario

Your company has historical deal notes, win/loss analyses, and sales playbooks. When processing new leads, you want to:

- Find similar past deals
- Pull relevant playbook sections
- Get recommendations based on what worked before

---

## Task B.1: Set Up Vectorize.io (10 min)

1. **Create an account** at [vectorize.io](https://vectorize.io)

2. **Create a new pipeline:**
   - Click "New Pipeline"
   - Name it "Sales Knowledge Base"
   - Choose your embedding model

3. **Upload your documents:**
   - Sales playbooks (PDF, Word, Markdown)
   - Historical deal summaries
   - Win/loss analysis reports

4. **Configure retrieval settings:**
   - Chunk size: 500-1000 tokens
   - Enable metadata filtering if needed

---

## Task B.2: Create MCP Agent in Vectorize (5 min)

1. **Navigate to Agents** in the Vectorize dashboard

2. **Create a new MCP Agent:**
   - Name: "Sales Knowledge Agent"
   - Select your pipeline as the data source
   - Function name: `search_knowledge_base`

3. **Generate API credentials:**
   - Create a new API key named "Claude Code"
   - Copy the API key and Agent ID

---

## Task B.3: Connect to Claude Code (5 min)

1. **Add the Vectorize MCP server:**
   ```bash
   claude mcp add vectorize-mcp \
     --env VECTORIZE_API_KEY=YOUR_API_KEY \
     -- npx -y mcp-remote@latest \
     https://agents.vectorize.io/api/agents/YOUR_AGENT_ID/mcp \
     --header "Authorization: Bearer ${VECTORIZE_API_KEY}"
   ```

2. **Verify the connection:**
   ```
   > /mcp
   ```
   You should see `vectorize-mcp` in the list.

---

## Task B.4: Test the RAG Integration (10 min)

1. **Test knowledge retrieval:**
   ```
   > Search our knowledge base for deals we won in the Healthcare industry.
   > What were the common winning factors?
   ```

2. **Try more queries:**
   ```
   > Find information about how we handle security objections

   > What's our playbook for selling to enterprise companies with 1000+ employees?
   ```

3. **Create a knowledge-enricher agent:**

   Create `.claude/agents/knowledge-enricher.md`:

   ```markdown
   ---
   name: knowledge-enricher
   description: Enrich leads with insights from our sales knowledge base using Vectorize. Use when you need historical context, playbook guidance, or similar deal examples.
   model: haiku
   tools: ["mcp__vectorize-mcp__search_knowledge_base"]
   ---

   # Knowledge Enricher

   Search our sales knowledge base to provide context for new leads.

   ## Process

   1. **Identify search criteria** from the lead:
      - Industry vertical
      - Company size range
      - Likely pain points

   2. **Search the knowledge base** for:
      - Similar past deals (won and lost)
      - Industry-specific playbook sections
      - Relevant objection handling

   3. **Return structured insights**:

   ```json
   {
     "similar_deals": [
       {"company": "...", "outcome": "...", "key_factors": "..."}
     ],
     "playbook_guidance": "...",
     "recommended_approach": "...",
     "potential_objections": ["..."]
   }
   ```
   ```

4. **Run the full pipeline with knowledge enrichment:**
   ```
   > Process this lead through the full pipeline with knowledge enrichment:
   >
   > Company: MedTech Solutions
   > Industry: Healthcare
   > Size: 300 employees
   > Contact: VP of Operations
   ```

---

## Troubleshooting

### Vectorize Issues

| Problem | Solution |
|---------|----------|
| Connection refused | Check API key and agent ID |
| No results returned | Verify documents were indexed; check query terms |
| Slow retrieval | Reduce chunk size or number of results |
| MCP not showing | Restart Claude Code after adding server |

### Integration Issues

| Problem | Solution |
|---------|----------|
| Agent not using knowledge base | Ensure tool name matches exactly |
| Poor quality results | Add more documents or adjust chunking |
| Context too large | Limit number of retrieved chunks |

---

## Final Checklist

Before completing this lab, verify:

- [ ] **Vectorize.io account created** - Pipeline set up and running
- [ ] **Documents uploaded** - Sales knowledge indexed
- [ ] **MCP agent configured** - API key and agent ID working
- [ ] **MCP connected to Claude Code** - Server shows in `/mcp`
- [ ] **Knowledge enricher agent created** - `.claude/agents/knowledge-enricher.md`
- [ ] **Sample query returns results** - Tested retrieval working

**Document your RAG setup:**

| Element | Your Implementation |
|---------|---------------------|
| Pipeline name | |
| Number of documents | |
| Chunk size | |
| MCP agent ID | |

---

## Reference: Vectorize MCP Connection

```bash
# Full connection command
claude mcp add vectorize-mcp \
  --env VECTORIZE_API_KEY=YOUR_API_KEY \
  -- npx -y mcp-remote@latest \
  https://agents.vectorize.io/api/agents/YOUR_AGENT_ID/mcp \
  --header "Authorization: Bearer ${VECTORIZE_API_KEY}"
```

| Parameter | Description |
|-----------|-------------|
| `vectorize-mcp` | Name for this MCP server in Claude Code |
| `VECTORIZE_API_KEY` | Your API key from Vectorize dashboard |
| `YOUR_AGENT_ID` | Agent ID from the MCP agent you created |

---

**End of Bonus Lab**
