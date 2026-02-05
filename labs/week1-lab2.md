# Week 1 Lab 2: First Steps with Claude Code

**Course:** Claude Agents Workshop  
**Duration:** 45 minutes  
**Focus:** Exploring built-in tools, customizing CLAUDE.md, and previewing the data

---

## Lab Architecture

This lab explores how Claude Code interacts with files and data in the workshop repository.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Claude Code Environment                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │                    Built-in Tools                            │  │
│   │                                                              │  │
│   │   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐             │  │
│   │   │  Glob  │  │  Read  │  │  Grep  │  │  Bash  │             │  │
│   │   │ (find) │  │(files) │  │(search)│  │(shell) │             │  │
│   │   └────────┘  └────────┘  └────────┘  └────────┘             │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │                    Workshop Files                            │  │
│   │   CLAUDE.md │ data/startup-funding.db │ lessons/ │ labs/     │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**What we're building:** Familiarity with Claude Code's built-in tools and your personalized project context.

---

## Prerequisites

Before starting this lab, verify you have completed Lab 1:

- [ ] Claude Code installed and authenticated
- [ ] Workshop repository cloned
- [ ] Test query "What files are in this repository?" works

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Understand the repository structure
2. Use built-in tools (Glob, Read, Grep, Bash)
3. Customize CLAUDE.md with your project context
4. Explore the startup funding database

---

## Time Breakdown

| Task | Topic                      | Time       |
| ---- | -------------------------- | ---------- |
| 2.1  | Explore the Repo Structure | 5 min      |
| 2.2  | Explore Built-in Tools     | 15 min     |
| 2.3  | Customize Your CLAUDE.md   | 15 min     |
| 2.4  | Data Exploration Preview   | 10 min     |
|      | **TOTAL**                  | **45 min** |

---

## Task 2.1: Explore the Repo Structure (5 min)

1. **Ask Claude to explain the repository:**

   ```
   > Explain the structure of this repository and what each folder is for.
   ```

2. **Observe:**
   - Which tools does Claude use? (Look for Read, Glob, Grep)
   - Does Claude read the CLAUDE.md file?
   - Is the explanation accurate?

3. **Expected:** Claude correctly describes the workshop structure using context from CLAUDE.md.

---

## Task 2.2: Explore Built-in Tools (15 min)

Try each of these commands and observe which tools Claude uses:

1. **File finding with Glob:**

   ```
   > Find all markdown files in this repo
   ```

2. **Reading files:**

   ```
   > Read the CLAUDE.md file and summarize what it says
   ```

3. **Searching content with Grep:**

   ```
   > Search for any files that mention "revenue" or "customer"
   ```

4. **Listing folder contents:**

   ```
   > What files are in the data folder?
   ```

5. **Running commands with Bash:**
   ```
   > Show me the current git status
   ```

**Record your observations:**

| Query                | Tool(s) Used | Result |
| -------------------- | ------------ | ------ |
| Find markdown files  |              |        |
| Read CLAUDE.md       |              |        |
| Search for "revenue" |              |        |
| List data folder     |              |        |
| Git status           |              |        |

---

## Task 2.3: Customize Your CLAUDE.md (15 min)

The CLAUDE.md file provides context that Claude uses in every conversation.

1. **Open CLAUDE.md in your editor:**

   ```bash
   code CLAUDE.md
   # or: vim CLAUDE.md
   # or: nano CLAUDE.md
   ```

2. **Add a section for your project context:**

   ```markdown
   ## My Project Context

   I'm building agents for [data analytics / GTM / sales / other].

   My focus area: [describe your use case in 1-2 sentences]

   Key metrics I care about:

   - [metric 1]
   - [metric 2]
   - [metric 3]

   Domain expertise I want to encode:

   - [expertise area 1]
   - [expertise area 2]
   ```

3. **Save the file.**

4. **Test that Claude uses your context:**

   ```
   > Based on my project context, what kind of agent would be most useful for me?
   ```

5. **Expected:** Claude's response should reference the specific details you added to CLAUDE.md.

---

## Task 2.4: Data Exploration Preview (10 min)

The workshop includes `startup-funding.db`, a SQLite database with venture capital data. We'll use this throughout the course.

1. **Ask Claude to explore the database:**

   ```
   > Look at data/startup-funding.db. Tell me:
   > 1. What tables exist
   > 2. How many rows in each table
   > 3. What the columns represent
   > 4. Any observations about the data
   ```

2. **Observe how Claude:**
   - Uses Bash to run SQLite commands
   - Explores the schema
   - Summarizes findings

3. **Try a specific query:**
   ```
   > Which AI coding tool companies are in the database? List their funding rounds.
   ```

**This previews the data analysis workflows we'll build in Week 2.**

---

## Troubleshooting

### Query Issues

| Problem                   | Solution                                       |
| ------------------------- | ---------------------------------------------- |
| Claude doesn't find files | Check you're in the right directory with `pwd` |
| "No such file" errors     | Verify repo cloned correctly with `ls -la`     |
| Database queries fail     | Ensure sqlite3 is installed: `which sqlite3`   |

### CLAUDE.md Issues

| Problem               | Solution                                   |
| --------------------- | ------------------------------------------ |
| Changes not reflected | Start a new Claude session or run `/clear` |
| File not being read   | Ensure you're in the repo root directory   |

---

## Final Checklist

Before leaving this lab, verify:

- [ ] **Tools functional** - Tested Glob, Read, Grep, and Bash
- [ ] **CLAUDE.md customized** - Added your project context
- [ ] **Context working** - Claude references your project details
- [ ] **Database accessible** - Claude can query startup-funding.db
- [ ] **Model confirmed** - Run `/model` to see which model is active

**Bonus (if time permits):**

- [ ] Changed model with `/model sonnet` or `/model opus`
- [ ] Explored additional Claude Code commands with `/help`

---

## Next Steps

**Homework before Week 2:**

Write a 1-paragraph description of an agent you want to build. Requirements:

- Must involve a repeatable workflow you want to automate
- Must be something useful to you (real or realistic)
- Must be achievable in 7 weeks of incremental building

Submit to the facilitator before Week 2.

**Week 2 Preview:** Tool Calling - How Claude decides which tools to use, tool schemas, and building custom tools.

---

**End of Lab 2**
