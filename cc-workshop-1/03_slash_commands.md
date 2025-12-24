# Workshop 02: Creating Custom Slash Commands

**Duration: ~12 minutes**

## What You'll Learn

- What slash commands are and how they work
- The correct file format and frontmatter
- Use arguments in commands

---

## What Are Slash Commands?

Slash commands are reusable prompts stored as Markdown files. Type `/command-name` and Claude executes the prompt inside.

**Important:** Slash commands run in the main context window, meaning they share conversation history and context with your current session.

**Locations:**
- Project: `.claude/commands/`
- Personal: `~/.claude/commands/`

---

## Command File Format

```markdown
---
description: Brief description shown in command list
argument-hint: [optional-args]
allowed-tools: Tool1, Tool2
---

Your prompt here. Use $ARGUMENTS for user input.
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `description` | No | Shown in `/help` and autocomplete |
| `argument-hint` | No | Shows expected arguments |
| `allowed-tools` | No | Restrict which tools the command can use |
| `model` | No | Override the model (e.g., `claude-3-5-haiku-20241022`) |

---

## Task 1: Create the Commands Directory

```bash
mkdir -p .claude/commands
```

---

## Task 2: Create a Quality Check Command

Create `.claude/commands/quality-check.md`:

```markdown
---
description: Run linter, formatter, and tests
allowed-tools: Bash(./scripts/*), Bash(pytest:*)
---

Run a comprehensive quality check:

1. Run the linter: `./scripts/lint.sh`
2. Run the formatter: `./scripts/format.sh`
3. Run all tests: `pytest tests/ -v`

Report any issues. If everything passes, confirm the codebase is healthy.
```

**Test it:**
```
/quality-check
```

---

## Task 3: Code Review Command

Create `.claude/commands/review.md`:

```markdown
---
description: Review current git changes
allowed-tools: Bash(git diff:*), Bash(git status:*)
---

Review current git changes:

1. Run `git status` and `git diff`
2. Check for: logic errors, security issues, missing error handling

Output as:
## Review Summary
- Files: [count]
- Issues: [count]

## Issues
### [file]:[line] - [Severity]
**Issue**: [description]
**Fix**: [suggestion]
```

---

## Task 4: Debug Helper

Create `.claude/commands/debug.md`:

```markdown
---
description: Help debug an issue
argument-hint: <issue description>
allowed-tools: Read, Grep, Glob, Bash(git log:*), Bash(pytest:*)
---

Debug: $ARGUMENTS

1. Search for related code
2. Check recent changes: `git log --oneline -10`
3. Run tests if relevant
4. Identify root cause
5. Propose solutions

If no issue described, ask for details.
```

---

## Your Structure

```
.claude/
└── commands/
    ├── quality-check.md
    ├── review.md
    └── debug.md
```

---

## Checkpoint

- [ ] Created `.claude/commands/`
- [ ] Created at least 2 commands with frontmatter
- [ ] Tested a command with arguments

---

## Next Up

Continue to: [04_skills.md](./04_skills.md)
