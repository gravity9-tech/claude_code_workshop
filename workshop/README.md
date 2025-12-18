# Claude Code Workshop

**Total Duration: ~1 hour**

A hands-on guide to using Claude Code effectively for software development.

## Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- Node.js (for MCP servers)
- Basic command line familiarity
- This repository cloned locally

## Workshop Modules

| Module | Topic | Duration |
|--------|-------|----------|
| 01 | [Getting Started](./01_getting_started.md) | 8 min |
| 02 | [Slash Commands](./02_slash_commands.md) | 12 min |
| 03 | [Skills](./03_skills.md) | 12 min |
| 04 | [Subagents](./04_subagents.md) | 16 min |
| 05 | [MCP & Playwright](./05_mcp_playwright.md) | 12 min |

## Learning Path

```
01 Getting Started (/init, CLAUDE.md)
         │
         ▼
02 Slash Commands (automation)
         │
         ▼
03 Skills (expertise)
         │
         ▼
04 Subagents (parallel agents)
         │
         ▼
05 MCP & Playwright (browser testing)
```

---

## Finished Solutions

The `examples/` folder contains **completed, working versions** of everything you'll build in the workshop.

### What's Included

```
examples/
├── commands/                    # Slash commands (Module 02 & 05)
│   ├── quality-check.md         # Run linter, formatter, tests
│   ├── test.md                  # Run tests with scope filter
│   ├── review.md                # Review git changes
│   ├── debug.md                 # Debug helper
│   └── e2e-test.md              # E2E tests with Playwright MCP
│
├── skills/                      # Skills (Module 03)
│   ├── api-designer/
│   │   └── SKILL.md             # REST API design expertise
│   └── code-reviewer/
│       └── SKILL.md             # Code review expertise
│
├── agents/                      # Subagents (Module 04)
│   ├── code-reviewer.md         # Reviews code for issues
│   ├── test-generator.md        # Generates tests
│   └── doc-generator.md         # Generates documentation
│
└── mcp.json                     # MCP config (Module 05)
```

### Quick Setup

Copy all examples to your project:

```bash
# From project root
mkdir -p .claude

# Copy commands, skills, agents
cp -r workshop/examples/commands .claude/
cp -r workshop/examples/skills .claude/
cp -r workshop/examples/agents .claude/

# Copy MCP configuration
cp workshop/examples/mcp.json .mcp.json
```

Then test:
```bash
# Test a command
claude
/quality-check

# Verify MCP
claude mcp list
```

---

## What You'll Learn

| Module | Feature | What It Does |
|--------|---------|--------------|
| 01 | `/init` | Generates CLAUDE.md project memory |
| 02 | Commands | Reusable prompts via `/name` |
| 03 | Skills | Domain expertise for Claude |
| 04 | Agents | Autonomous parallel workers |
| 05 | MCP | External tools (browser automation) |

---

## Final Project Structure

After completing all modules:

```
your-project/
├── .claude/
│   ├── commands/
│   │   ├── quality-check.md
│   │   ├── test.md
│   │   ├── review.md
│   │   ├── debug.md
│   │   └── e2e-test.md
│   ├── skills/
│   │   ├── api-designer/
│   │   │   └── SKILL.md
│   │   └── code-reviewer/
│   │       └── SKILL.md
│   └── agents/
│       ├── code-reviewer.md
│       └── test-generator.md
├── .mcp.json                    # MCP servers config
└── CLAUDE.md                    # Project memory (via /init)
```

---

## Troubleshooting

**Claude Code not found:**
```bash
npm install -g @anthropic-ai/claude-code
```

**Commands not appearing:**
```bash
ls .claude/commands/
```

**Skills not loading:**
```bash
ls .claude/skills/*/SKILL.md
```

**MCP server issues:**
```bash
claude mcp list
claude mcp get playwright
```

## Help

- Type `/help` in Claude Code
- Type `/mcp` to check MCP server status
- [Claude Code Docs](https://docs.anthropic.com/claude-code)

---

Start with [01_getting_started.md](./01_getting_started.md)
