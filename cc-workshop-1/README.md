# Claude Code Workshop

**Total Duration: ~1 hour 15 min**

A hands-on guide to using Claude Code effectively for software development.

## Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- Node.js (for MCP servers)
- Basic command line familiarity
- This repository cloned locally

## Workshop Modules

| Module | Topic | Duration |
|--------|-------|----------|
| 00 | [Project Setup](./00_setup.md) | 5 min |
| 01 | [Context Window](./01_context_window.md) | 5 min |
| 02 | [Getting Started](./02_getting_started.md) | 8 min |
| 03 | [Slash Commands](./03_slash_commands.md) | 12 min |
| 04 | [Skills](./04_skills.md) | 12 min |
| 05 | [Subagents](./05_subagents.md) | 16 min |
| 06 | [MCP & Playwright](./06_mcp_playwright.md) | 12 min |
| 07 | [Hooks](./07_hooks.md) | 8 min |
| 08 | [Marketplace](./08_marketplace.md) | 8 min |

## Learning Path

```
00 Project Setup (clone & open)
         │
         ▼
01 Context Window (memory management)
         │
         ▼
02 Getting Started (/init, CLAUDE.md)
         │
         ▼
03 Slash Commands (automation)
         │
         ▼
04 Skills (expertise)
         │
         ▼
05 Subagents (parallel agents)
         │
         ▼
06 MCP & Playwright (browser testing)
         │
         ▼
07 Hooks (event automation)
         │
         ▼
08 Marketplace (community resources)
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
| 01 | Context Window | Understanding Claude's memory limits |
| 02 | `/init` | Generates CLAUDE.md project memory |
| 03 | Commands | Reusable prompts via `/name` |
| 04 | Skills | Domain expertise for Claude |
| 05 | Agents | Autonomous parallel workers |
| 06 | MCP | External tools (browser automation) |
| 07 | Hooks | Shell commands on events |
| 08 | Marketplace | Community resources & sharing |

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
│   ├── agents/
│   │   ├── code-reviewer.md
│   │   └── test-generator.md
│   └── settings.json            # Hooks config
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

Start with [00_setup.md](./00_setup.md)
