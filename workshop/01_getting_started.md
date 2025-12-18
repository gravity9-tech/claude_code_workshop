# Workshop 01: Getting Started with Claude Code

**Duration: ~8 minutes**

## What You'll Learn

- Initialize Claude Code in a project using `/init`
- Understand the generated CLAUDE.md memory file
- Basic commands and permission model

---

## What is Claude Code?

Claude Code is Anthropic's official CLI that brings Claude into your terminal. It can:

- Read, write, and execute code in your project
- Maintain context through CLAUDE.md memory files
- Run bash commands, search files, make edits
- Work autonomously on multi-step tasks

---

## Task 1: Start Claude Code

Navigate to the project and start Claude:

```bash
cd claude_code_workshop
claude
```

---

## Task 2: Initialize with `/init`

The `/init` command creates a `CLAUDE.md` file - Claude's memory for your project.

In Claude Code, type:

```
/init
```

### What Happens

Claude will:
1. Analyze your project structure
2. Read configuration files (pyproject.toml, requirements.txt, etc.)
3. Identify your tech stack
4. Generate a `CLAUDE.md` with project context

---

## Task 3: Explore the Generated CLAUDE.md

Open the generated file:

```bash
cat CLAUDE.md
```

You'll see sections like:
- Project overview
- Tech stack
- Common commands (run, test, lint)
- Project structure

**Why this matters**: Every new Claude session reads this file first, so Claude immediately understands your project.

---

## Task 4: Understanding Permissions

Claude Code uses a permission system:

| Operation | Permission |
|-----------|------------|
| Reading files | Usually automatic |
| Writing/editing files | Requires approval |
| Running commands | Requires approval |

Try it - ask Claude to:
```
Show me app/main.py
```

Then:
```
Add a comment to the top of app/main.py
```

Notice how Claude asks permission before making changes.

---

## Essential Commands

| Command | Description |
|---------|-------------|
| `/init` | Generate CLAUDE.md |
| `/help` | Show available commands |
| `/clear` | Clear conversation |
| `/cost` | Show token usage |

---

## Checkpoint

Before continuing, verify:

- [ ] Claude Code is running
- [ ] You ran `/init`
- [ ] `CLAUDE.md` exists in project root
- [ ] You understand the permission model

---

## Next Up

Continue to: [02_slash_commands.md](./02_slash_commands.md) - Create custom commands
