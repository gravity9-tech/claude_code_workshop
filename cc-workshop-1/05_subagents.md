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

**Locations:**
- Project: `.claude/agents/`
- Personal: `~/.claude/agents/`

---

## Task 1: Using Built-in Agents

Try these prompts on the workshop codebase:

```
Explore the FastAPI application structure and explain how routes connect to mock_data
```

```
Find all files related to product filtering and price validation
```

```
Plan how to add a wishlist endpoint to app/api/routes.py
```

---

## Task 2: Create Agents with `/agents`

The `/agents` command lets you create agents interactively. Claude guides you through the setup.

### Create a Code Reviewer Agent

Run `/agents` and provide this prompt:

```
Create a code-reviewer agent that reviews code for security vulnerabilities
and quality issues. It should check for injection attacks, XSS, hardcoded
secrets, and code quality. Output a structured review with severity levels.
```

Claude will:
1. Ask clarifying questions about scope and behavior
2. Generate the agent file with proper frontmatter
3. Save it to `.claude/agents/code-reviewer.md`

---

## Task 3: Create a Test Generator Agent

Run `/agents` again:

```
Create a test-generator agent that generates pytest tests for FastAPI endpoints.
It should test: successful responses, invalid parameters (400 errors), and
not found cases (404 errors). Match the style in tests/test_api.py.
```

---

## Task 4: Running Agents in Parallel (Within Claude)

Run multiple agents simultaneously in a single prompt:

```
Run these tasks in parallel:
1. Find all API endpoints in app/api/routes.py and list their HTTP methods
2. Review app/mock_data.py for any hardcoded values that should be configurable
```

Another example - parallel code review and test gap analysis:

```
Run in parallel:
1. Check if tests/test_api.py covers all endpoints in app/api/routes.py
2. Review app/models.py for missing field validations
```

Claude spawns separate agents that work simultaneously and report back.

---

## Task 5: Running Agents in Separate Terminals

For long-running or independent tasks, use multiple terminal windows:

**Terminal 1 - Security Review:**
```bash
claude -p "Review app/api/routes.py for input validation and injection risks"
```

**Terminal 2 - Test Coverage:**
```bash
claude -p "Compare tests/test_api.py against app/api/routes.py and list untested scenarios"
```

**Terminal 3 - Documentation:**
```bash
claude -p "Generate OpenAPI descriptions for all endpoints in app/api/routes.py"
```

| Approach | Best For |
|----------|----------|
| `Run in parallel...` (within Claude) | Quick coordinated tasks, shared context |
| Separate terminals with `-p` | Long tasks, different focus areas |
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
- [ ] Created at least 1 custom agent with `/agents`
- [ ] Ran agents in parallel within Claude
- [ ] Tried running Claude in separate terminals

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

Continue to: [06_mcp_playwright.md](./06_mcp_playwright.md) - Browser automation with MCP
