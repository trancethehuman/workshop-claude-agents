# Lecture Diagram DOT Files

This directory contains Graphviz DOT files for all ASCII diagrams in the lecture markdown files.

## File Mapping

### Week 1: Overview & Setup (4 diagrams)
- `week1-session-plan-diagram-1.dot` - The Agent Loop (INPUT → THINK → SELECT TOOL → EXECUTE → OBSERVE)
- `week1-session-plan-diagram-2.dot` - The Claude Agent Stack (layers from app to Claude)
- `week1-session-plan-diagram-3.dot` - Customer Data File Structure (filesystem example)
- `week1-session-plan-diagram-4.dot` - Agent Skill Directory Structure

### Week 2: Tool Calling (3 diagrams)
- `week2-session-plan-diagram-1.dot` - Tool Calling Loop (THINK → SELECT TOOL → EXECUTE → OBSERVE → THINK AGAIN)
- `week2-session-plan-diagram-2.dot` - Data Analysis Loop (MONITOR → EXPLORE → CRAFT STORY → IMPACT)
- `week2-session-plan-diagram-3.dot` - On-Demand Context Retrieval workflow

### Week 3: MCP Integration (1 diagram)
- `week3-session-plan-diagram-1.dot` - MCP Architecture (Claude Code ↔ MCP Server ↔ External Service)

### Week 4: Agent Skills (3 diagrams)
- `week4-session-plan-diagram-1.dot` - Traditional vs Skills Approach (context bloat vs on-demand loading)
- `week4-session-plan-diagram-2.dot` - Multi-File Skill Structure
- `week4-session-plan-diagram-3.dot` - Progressive Disclosure Pattern

### Week 5: Sub-agents (7 diagrams)
- `week5-session-plan-diagram-1.dot` - Without Sub-agents (context explosion)
- `week5-session-plan-diagram-2.dot` - With Sub-agents (clean context)
- `week5-session-plan-diagram-3.dot` - Sub-agent Architecture (main agent delegates to specialized agents)
- `week5-session-plan-diagram-4.dot` - Workflow Patterns (sequential, parallel, hierarchical)
- `week5-session-plan-diagram-5.dot` - Agent Communication Flow
- `week5-session-plan-diagram-6.dot` - Sandboxing Patterns (batch, long-running, user-triggered)
- `week5-session-plan-diagram-7.dot` - Agent Definition File Structure

### Week 6: Agent SDK (1 diagram)
- `week6-session-plan-diagram-1.dot` - Agent SDK Architecture (app → SDK components → Claude API)

## Total: 19 diagrams

## Usage

Generate PNG from DOT file:
```bash
dot -Tpng week1-session-plan-diagram-1.dot -o week1-session-plan-diagram-1.png
```

Generate all diagrams:
```bash
for file in *.dot; do
  dot -Tpng "$file" -o "${file%.dot}.png"
done
```

## Design Standards

All diagrams follow these conventions:
- **Color scheme:**
  - Blue (#EFF6FF/#2563EB) for primary components
  - Purple (#F5F3FF/#7C3AED) for intermediate/process nodes
  - Yellow (#FEF3C7/#D97706) for important/observe nodes
  - Green (#ECFDF5/#059669) for output/success nodes
  - Gray (#F3F4F6/#6B7280) for data/neutral nodes
  - Red (#FEE2E2/#DC2626) for problems/anti-patterns

- **Layout:**
  - Use `rankdir=TB` for vertical flows
  - Use `rankdir=LR` for horizontal flows
  - Use `rank=same` for horizontal grouping
  - Use `newrank=true` for rank constraints in clusters
  - Use `splines=ortho` for orthogonal edges (right angles)
  - Use `compound=true` for cluster-to-cluster edges

- **Typography:**
  - Font: Arial
  - Title: 14pt bold
  - Labels: 11pt
  - Edges: 9pt
  - Code snippets: Courier 9-10pt

- **Nodes:**
  - `style="rounded,filled"` for boxes
  - `shape=box` for most nodes
  - `shape=plaintext` for annotations/labels
  - `shape=record` for split fields
