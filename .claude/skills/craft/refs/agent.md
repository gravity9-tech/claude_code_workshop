# Agent Reference

## Frontmatter Fields

| Field | Required | Guidance |
|-------|----------|----------|
| `name` | Yes | Lowercase, hyphenated, descriptive |
| `description` | Yes | What + when to delegate. Include trigger phrases. Under 200 chars. See SKILL.md §4 |
| `tools` | No | Comma-separated allowlist. Start minimal, add only what's needed |
| `disallowedTools` | No | Use instead of `tools` when you want most tools minus a few |
| `model` | No | `opus` (complex), `sonnet` (balanced), `haiku` (fast). Omit to inherit |
| `skills` | No | Skill `name` values to inject as domain knowledge at startup |
| `memory` | No | `user` (cross-project), `project` (team-shared), `local` (private) |
| `maxTurns` | No | Bound the agent's turns if the task should be limited |
| `permissionMode` | No | `acceptEdits`, `dontAsk`, `plan`. Only override when needed |
| `isolation` | No | `worktree` for git-isolated execution |

**Omit any field that would be set to its default value.**

## Tools Matrix

Select tools based on the agent's purpose:

| Purpose | Recommended Tools |
|---------|-------------------|
| Code review | Read, Grep, Glob, Bash(git diff:*) |
| Testing | Read, Write, Bash(npm test:*) |
| Research | Read, Grep, Glob, WebSearch, WebFetch |
| Implementation | Read, Write, Edit, Bash |
| Read-only audit | Read, Grep, Glob |
| Deployment | Bash (scoped to deploy commands) |
| Documentation | Read, Grep, Glob, Write |

**Scope Bash access** with patterns when possible: `Bash(git:*)`, `Bash(npm test:*)`, `Bash(docker:*)`.

## Model Selection

| Complexity | Model | Examples |
|-----------|-------|----------|
| High | `opus` | Architectural decisions, complex multi-step reasoning |
| Medium | `sonnet` | Most agents — balanced capability and speed |
| Low | `haiku` | Quick lookups, simple transformations, formatting |
| Inherited | (omit) | When the parent conversation's model is appropriate |

## Template

```markdown
---
name: <name>
description: <description>
tools: <comma-separated, minimal>
[only include fields that differ from defaults]
---

# <Title>

One sentence role description.

## Process
1. Step 1
2. Step 2
3. Continue as needed

## Output Format
How results should be structured.

## Constraints
- Limitation 1
- Limitation 2
```

## Validation Checklist

**Frontmatter:**
- [ ] `name` is lowercase-hyphenated
- [ ] `description` explains what AND when to delegate
- [ ] `tools` only lists what's needed for the process steps
- [ ] Bash access is scoped with patterns where possible
- [ ] `model` matches task complexity (or omitted to inherit)
- [ ] Skills listed use exact `name` from their SKILL.md
- [ ] No fields set to default values

**Body:**
- [ ] Process steps are numbered and actionable
- [ ] Output format is specified
- [ ] Constraints are realistic and specific
- [ ] Role description is one clear sentence

**Description quality:**
- [ ] First clause: what it does
- [ ] Second clause: when Claude should delegate to it
- [ ] Contains delegation trigger phrases
- [ ] Under 200 characters
