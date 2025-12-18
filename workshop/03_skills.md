# Workshop 03: Building Reusable Skills

**Duration: ~12 minutes**

## What You'll Learn

- Difference between commands and skills
- Correct skill file format (SKILL.md)
- Create skills that enhance Claude's expertise

---

## Commands vs Skills

| | Commands | Skills |
|---|----------|--------|
| **Purpose** | Do a specific task | Provide expertise/knowledge |
| **Location** | `.claude/commands/file.md` | `.claude/skills/name/SKILL.md` |
| **Invocation** | `/command-name` | Auto-invoked or referenced |
| **Structure** | Single file | Directory with SKILL.md |

---

## Skill File Format

Skills live in directories with a required `SKILL.md` file:

```
.claude/skills/
└── my-skill/
    └── SKILL.md
```

### SKILL.md Format

```markdown
---
name: my-skill-name
description: What this skill does. When to use it.
allowed-tools: Read, Grep, Glob
---

# Skill Title

Your expertise and instructions here.
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Lowercase, hyphens only (e.g., `api-designer`) |
| `description` | Yes | What it does + when to use it (max 1024 chars) |
| `allowed-tools` | No | Tools Claude can use with this skill |

**Name rules:** lowercase letters, numbers, hyphens only. No spaces or underscores.

---

## Task 1: Create the Skills Directory

```bash
mkdir -p .claude/skills/api-designer
mkdir -p .claude/skills/code-reviewer
```

---

## Task 2: Create an API Designer Skill

Create `.claude/skills/api-designer/SKILL.md`:

```markdown
---
name: api-designer
description: REST API design expert. Use when designing endpoints, reviewing API structure, or improving consistency.
allowed-tools: Read, Grep, Glob
---

# API Designer

You are an API design expert applying REST best practices.

## URL Structure
- Use nouns: `/products` not `/getProducts`
- Use plural: `/users` not `/user`
- Nest relationships: `/users/{id}/orders`

## HTTP Methods
- GET: Retrieve
- POST: Create
- PUT: Replace
- PATCH: Partial update
- DELETE: Remove

## Status Codes
- 200 Success, 201 Created, 204 No Content
- 400 Bad Request, 401 Unauthorized, 404 Not Found
- 500 Server Error

## Response Format
```json
{
  "data": { },
  "meta": { "total": 100, "page": 1 },
  "errors": []
}
```

Apply these when designing or reviewing APIs.
```

---

## Task 3: Create a Code Reviewer Skill

Create `.claude/skills/code-reviewer/SKILL.md`:

```markdown
---
name: code-reviewer
description: Senior code reviewer for quality and security. Use when reviewing PRs or auditing code.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

You are a senior code reviewer.

## Security Checklist
- No SQL/command injection
- No XSS vulnerabilities
- Input validation present
- No hardcoded secrets

## Quality Checklist
- Functions are small and focused
- Clear naming
- Proper error handling
- Tests exist

## Output Format
### [file]:[line] - [Critical|Warning|Info]
**Issue**: Description
**Fix**: Suggestion
```

---

## Task 4: Using Skills

Reference skills in your prompts:

```
Using the api-designer skill, review app/api/routes.py
```

```
Apply the code-reviewer skill to check the cart.js file
```

Claude will apply the expertise from your skill files.

---

## Your Structure

```
.claude/
├── commands/
│   └── ...
└── skills/
    ├── api-designer/
    │   └── SKILL.md
    └── code-reviewer/
        └── SKILL.md
```

---

## Checkpoint

- [ ] Created `.claude/skills/` with subdirectories
- [ ] Created at least 1 skill with proper SKILL.md format
- [ ] Tested applying a skill

---

## Next Up

Continue to: [04_subagents.md](./04_subagents.md)
