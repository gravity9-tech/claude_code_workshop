# Workshop 04: Mastering Subagents

**Duration: ~16 minutes**

## What You'll Learn

- What subagents are and when to use them
- Built-in agents (Explore, Plan)
- Create custom agent configurations
- Run agents in parallel

---

## What Are Subagents?

Subagents are autonomous Claude instances that:
- Work independently on tasks
- Can run in parallel
- Have specific tools and focus
- Report back results

---

## Built-in Agents

| Agent | Purpose |
|-------|---------|
| `Explore` | Find files, understand architecture |
| `Plan` | Design implementation approaches |

---

## Subagent File Format

```markdown
---
name: agent-name
description: When to use this agent
tools: Read, Grep, Glob
model: sonnet
---

Your agent's instructions here.
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase with hyphens |
| `description` | Yes | When Claude should use this agent |
| `tools` | No | Comma-separated tool list |
| `model` | No | `haiku`, `sonnet`, `opus`, or `inherit` |
| `skills` | No | Skills to auto-load |

**Locations:**
- Project: `.claude/agents/`
- Personal: `~/.claude/agents/`

---

## Task 1: Using Built-in Agents

Try these:

```
Explore this codebase and explain the architecture
```

```
Find all files related to the shopping cart
```

```
Plan how to add user authentication
```

---

## Task 2: Create the Agents Directory

```bash
mkdir -p .claude/agents
```

---

## Task 3: Create a Code Reviewer Agent

Create `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Reviews code for security and quality. Use after writing or modifying code.
tools: Read, Grep, Glob
model: sonnet
---

You are a senior code reviewer.

## Process
1. Read the files to review
2. Check for security issues (injection, XSS, secrets)
3. Check for quality issues (naming, errors, structure)

## Output

## Review Summary
**Files**: [list]
**Risk**: Low | Medium | High

## Issues
### [file]:[line] - [Critical|Warning|Info]
**Issue**: Description
**Fix**: Suggestion

## Verdict
Approved | Needs changes
```

---

## Task 4: Create a Test Generator Agent

Create `.claude/agents/test-generator.md`:

```markdown
---
name: test-generator
description: Generates tests for code. Use when adding tests for new or existing code.
tools: Read, Grep, Glob, Write, Edit
model: sonnet
---

You generate comprehensive tests.

## Process
1. Read the file(s) to test
2. Identify public functions
3. Create tests for: happy path, edge cases, errors

## Conventions
- Use pytest
- Follow existing test patterns
- Name: `test_<function>_<scenario>_<expected>`

## Output
Create `tests/test_<module>.py` with imports, fixtures, and tests.
```

---

## Task 5: Running Agents in Parallel (Within Claude)

The real power - multiple agents working at once:

```
Run these in parallel:
1. Explore: Find all API endpoints
2. Code reviewer: Check routes.py for issues
```

Both agents run simultaneously and report back.

---

## Task 6: Running Agents in Separate Terminals

You can also run Claude instances yourself in multiple terminals for true parallel work.

### Step 1: Open Two Terminals

Open two terminal windows, both in the project directory:

```bash
cd claude_code_workshop
```

### Step 2: Run Different Tasks Simultaneously

**Terminal 1 - Code Review:**
```bash
claude "Review app/api/routes.py for security and quality issues"
```

**Terminal 2 - Test Generation:**
```bash
claude "Generate tests for the wishlist functionality in app/api/routes.py"
```

### Step 3: Using the -p Flag for One-Shot Prompts

The `-p` flag runs Claude with a prompt and exits when done:

**Terminal 1:**
```bash
claude -p "Find all API endpoints and list them with their HTTP methods"
```

**Terminal 2:**
```bash
claude -p "Check the JavaScript files in static/js/ for any console.log statements"
```

### Why Use Separate Terminals?

| Approach | Best For |
|----------|----------|
| Within Claude (`Run in parallel...`) | Quick tasks, automatic coordination |
| Separate terminals | Long-running tasks, different focus areas |

### Practical Example: Pre-Commit Workflow

Open 3 terminals and run simultaneously:

**Terminal 1 - Linting:**
```bash
claude -p "Run ./scripts/lint.sh and summarize any issues"
```

**Terminal 2 - Tests:**
```bash
claude -p "Run pytest tests/ -v and report failures"
```

**Terminal 3 - Security Check:**
```bash
claude -p "Search for any hardcoded secrets or API keys in the codebase"
```

---

## Your Structure

```
.claude/
├── commands/
│   └── ...
├── skills/
│   └── ...
└── agents/
    ├── code-reviewer.md
    └── test-generator.md
```

---

## Checkpoint

- [ ] Used the Explore agent
- [ ] Used the Plan agent
- [ ] Created at least 1 custom agent
- [ ] Ran agents in parallel (within Claude)
- [ ] Ran Claude in separate terminals

---

## Workshop Complete!

You've learned:
1. `/init` to generate CLAUDE.md
2. Custom slash commands with frontmatter
3. Skills with SKILL.md format
4. Subagents for parallel work

### Final Structure

```
.claude/
├── commands/
│   ├── quality-check.md
│   ├── test.md
│   ├── review.md
│   └── debug.md
├── skills/
│   ├── api-designer/
│   │   └── SKILL.md
│   └── code-reviewer/
│       └── SKILL.md
└── agents/
    ├── code-reviewer.md
    └── test-generator.md
```

---

## Next Up

Continue to: [05_mcp_playwright.md](./05_mcp_playwright.md) - Browser automation with MCP
