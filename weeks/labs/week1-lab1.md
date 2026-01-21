# Week 1 Lab 1: Environment Setup

**Course:** Claude Agents Workshop  
**Duration:** 30 minutes  
**Focus:** Installing Claude Code, cloning the repository, and authenticating

---

## Lab Architecture

This lab establishes your development environment for the workshop.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Your Development Machine                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│   │   Terminal   │────▶│  Claude Code │────▶│  Claude API  │        │
│   │              │◀────│   (Agent)    │◀────│              │        │
│   └──────────────┘     └──────────────┘     └──────────────┘        │
│                              │                                      │
│                              ▼                                      │
│                    ┌─────────────────┐                              │
│                    │   Local Files   │                              │
│                    │  - CLAUDE.md    │                              │
│                    │  - data/*.db    │                              │
│                    └─────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**What we're building:** A fully configured Claude Code environment ready for the workshop.

---

## Prerequisites

Before starting this lab, verify you have:

- [ ] **Claude Pro subscription** - Active and able to access Claude
- [ ] **Node.js 18+** - Run `node --version` to check
- [ ] **Git** - Run `git --version` to check
- [ ] **VS Code or preferred editor** - For editing files
- [ ] **Terminal access** - macOS Terminal, iTerm2, or Windows with WSL2

---

## Lab Overview (Outcomes)

By the end of this lab, you will:

1. Install Claude Code CLI on your machine
2. Clone and navigate the workshop repository
3. Authenticate Claude Code with your account
4. Verify everything works with a test query

---

## Time Breakdown

| Task | Topic | Time |
|------|-------|------|
| 1.1 | Pre-Flight Check | 5 min |
| 1.2 | Install Claude Code | 10 min |
| 1.3 | Clone Workshop Repository | 5 min |
| 1.4 | Authenticate & Test | 10 min |
| | **TOTAL** | **30 min** |

---

## Task 1.1: Pre-Flight Check (5 min)

Verify your prerequisites are met:

1. **Check Node.js version:**
   ```bash
   node --version
   ```
   Expected: `v18.x.x` or higher

2. **Check Git:**
   ```bash
   git --version
   ```
   Expected: Any version (e.g., `git version 2.39.0`)

3. **Check Claude Pro subscription:**
   - Log into [claude.ai](https://claude.ai)
   - Verify you have Pro or higher (check account settings)

**If any check fails:** Raise your hand for facilitator help before proceeding.

---

## Task 1.2: Install Claude Code (10 min)

1. **Install via the official installer (recommended):**
   ```bash
   # macOS/Linux
   curl -fsSL https://claude.ai/install.sh | sh
   ```

   OR via npm:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Verify the installation:**
   ```bash
   claude --version
   ```
   Expected: Version number displayed (e.g., `claude-code 1.x.x`)

3. **If you see a "command not found" error:**
   - Close and reopen your terminal
   - Try again
   - If still failing, check your PATH or ask for help

---

## Task 1.3: Clone Workshop Repository (5 min)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/trancethehuman/workshop-claude-agents
   cd workshop-claude-agents
   ```

2. **Verify the clone:**
   ```bash
   ls -la
   ```
   You should see:
   - `CLAUDE.md`
   - `data/` folder
   - `weeks/` folder
   - Other workshop files

---

## Task 1.4: Authenticate & Test (10 min)

1. **Start Claude Code in the repository:**
   ```bash
   claude
   ```

2. **Follow the authentication prompts:**
   - A browser window will open
   - Log in with your Claude account
   - Authorize Claude Code
   - Return to terminal

3. **Test that it's working:**
   ```
   > What files are in this repository?
   ```

4. **Expected result:** Claude lists the files and folders in the repo, using the Glob or Bash tool.

---

## Troubleshooting

### Installation Issues

| Problem | Solution |
|---------|----------|
| `command not found: claude` | Close and reopen terminal, or add to PATH manually |
| npm permission errors | Don't use sudo. Fix npm permissions: `npm config set prefix ~/.npm-global` |
| Node version too old | Use nvm: `nvm install 18 && nvm use 18` |

### Authentication Issues

| Problem | Solution |
|---------|----------|
| Browser doesn't open | Copy the URL from terminal and open manually |
| "Not authorized" error | Verify Claude Pro subscription is active |
| Token expired | Run `claude` again to re-authenticate |

### Windows-Specific Issues

| Problem | Solution |
|---------|----------|
| Scripts don't run | Use WSL2 (Windows Subsystem for Linux) |
| Path issues | Use forward slashes in paths |
| Terminal compatibility | Use Windows Terminal with WSL |

---

## Final Checklist

Before proceeding to Lab 2, verify:

- [ ] **Claude Code installed** - `claude --version` returns a version number
- [ ] **Repository cloned** - You can `cd workshop-claude-agents` and see files
- [ ] **Authentication working** - Claude responds to queries
- [ ] **Test query successful** - "What files" query returns repo contents

---

**End of Lab 1**
