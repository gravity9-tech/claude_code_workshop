---
name: craft
description: Creates Claude Code skills or agents from a description. Use when the user wants to create, generate, build, or scaffold a new skill or agent.
argument-hint: <skill|agent> <description>
---

# Craft

Create a well-structured Claude Code **skill** or **agent** from a description.

## Arguments

- `$0` — artifact type: `skill` or `agent`
- Remaining arguments — description of what to create

If `$0` is not `skill` or `agent`, infer the type from context or ask the user.

## Process

### 1. Parse Request

Extract from `$ARGUMENTS`:
- **Type**: skill or agent
- **Purpose**: what it should do
- **Triggers**: when it should activate
- **Scope**: what tools/access it needs

### 2. Research

Use WebSearch to find domain best practices relevant to the artifact's purpose. This informs the instructions and tool selection.

### 3. Determine Tools

Do NOT blanket-allow all tools. Select tools based on what the artifact actually does:

| Artifact needs to... | Grant these tools |
|-----------------------|-------------------|
| Read/search code | Read, Grep, Glob |
| Modify files | Read, Edit, Write |
| Run shell commands | Bash (scope with patterns like `Bash(git:*)`) |
| Research online | WebSearch, WebFetch |
| Spawn subagents | Task |
| Nothing external | Omit `allowed-tools` entirely |

Principle: **start with zero tools and add only what's justified by the instructions.** If a tool isn't referenced in any instruction step, don't include it.

### 4. Craft the Description

The `description` field is the most important metadata — it controls when Claude auto-loads the skill/agent.

**Rules:**
- **What + When**: first clause says what it does, second says when to trigger
- **Include trigger keywords**: verbs and nouns users/Claude would use (e.g., "deploy", "review", "format")
- **Include anti-triggers**: use "DO NOT TRIGGER when..." for ambiguous domains
- **Under 200 chars** for the summary line; use multi-line for complex trigger logic
- **Test mentally**: "If a user says X, would this description match?" — if no, add the keyword

**Good examples:**
```
Reviews code for security vulnerabilities. Use when auditing code, checking for OWASP issues, or reviewing auth.
```
```
Sets up Playwright MCP server. Use when setting up browser automation, web testing, or scraping.
```

**Bad examples:**
```
A helpful skill for doing things with code.    # too vague, no triggers
Security stuff.                                 # no "when to use"
```

### 5. Design & Write

Read the appropriate reference file for the artifact type:
- **Skill**: Read `${CLAUDE_SKILL_DIR}/refs/skill.md` for metadata fields, template, and validation checklist
- **Agent**: Read `${CLAUDE_SKILL_DIR}/refs/agent.md` for metadata fields, template, and validation checklist

Follow the template structure and validate against the checklist in that file.

### 6. Present & Save

1. Display the complete artifact
2. Show validation checklist results (from the ref file)
3. Ask where to save (default: `.claude/skills/<name>/SKILL.md` or `.claude/agents/<name>.md`)
4. Save using the Write tool
5. Confirm: `/name` for skills, `@name` for agents
