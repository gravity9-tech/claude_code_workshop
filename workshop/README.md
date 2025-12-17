# Claude Code Workshop

Welcome to the Claude Code Workshop! This self-paced guide will teach you how to use Claude Code effectively for software development.

## Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- Basic familiarity with command line
- A code editor of your choice
- This workshop repository cloned locally

## Workshop Structure

This workshop is organized into 6 progressive modules:

| Module | Topic | Duration | Difficulty |
|--------|-------|----------|------------|
| 01 | [Getting Started](./01_getting_started.md) | 20 min | Beginner |
| 02 | [Claude Memory System](./02_claude_memory.md) | 30 min | Beginner |
| 03 | [Custom Slash Commands](./03_slash_commands.md) | 45 min | Intermediate |
| 04 | [Building Skills](./04_skills.md) | 45 min | Intermediate |
| 05 | [Mastering Subagents](./05_subagents.md) | 60 min | Advanced |
| 06 | [Advanced Workflows](./06_advanced_workflows.md) | 60 min | Advanced |

## Learning Path

```
01 Getting Started
       │
       ▼
02 Claude Memory ──────┐
       │               │
       ▼               │
03 Slash Commands      │
       │               │
       ▼               │
04 Skills ◄────────────┘
       │
       ▼
05 Subagents
       │
       ▼
06 Advanced Workflows
```

## Example Files

The `examples/` directory contains ready-to-use configurations:

```
examples/
├── commands/          # Slash command templates
│   ├── quality-check.md
│   ├── review.md
│   ├── test.md
│   └── debug.md
├── agents/            # Subagent configurations
│   ├── code-reviewer.md
│   ├── test-generator.md
│   └── doc-generator.md
└── skills/            # Skill templates
    ├── api-designer.md
    └── code-reviewer.md
```

### Using the Examples

To use these examples in your project:

```bash
# Copy commands to your project
cp -r workshop/examples/commands .claude/commands/

# Copy agents to your project
cp -r workshop/examples/agents .claude/agents/

# Copy skills to your project
cp -r workshop/examples/skills .claude/skills/
```

## Quick Start

If you're short on time, here's the essential path:

1. **Module 01**: Run `/init` to set up Claude (5 min)
2. **Module 03**: Create your first command (15 min)
3. **Module 05**: Try running agents (10 min)

## Tips for Success

1. **Follow in order** - Each module builds on the previous
2. **Practice actively** - Don't just read, try every example
3. **Customize examples** - Modify them for your workflow
4. **Experiment** - Try combining features in new ways

## Troubleshooting

### Claude Code not found
```bash
npm install -g @anthropic-ai/claude-code
```

### Permission errors
Make sure scripts are executable:
```bash
chmod +x scripts/*.sh
```

### Commands not appearing
Ensure your `.claude/commands/` directory exists and contains `.md` files.

## Getting Help

- Type `/help` in Claude Code for built-in help
- Check [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- Report issues at [GitHub](https://github.com/anthropics/claude-code/issues)

## What You'll Build

By the end of this workshop, you'll have:

- A fully configured `CLAUDE.md` memory file
- 5+ custom slash commands
- 3+ reusable skills
- 2+ custom agent configurations
- Automated workflows for common tasks

## Let's Begin!

Start with [Module 01: Getting Started](./01_getting_started.md)

---

Happy coding with Claude!
