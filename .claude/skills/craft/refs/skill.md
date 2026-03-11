# Skill Reference

## Frontmatter Fields

| Field | Required | Guidance |
|-------|----------|----------|
| `name` | Yes | Lowercase, hyphenated, under 64 chars, action-oriented |
| `description` | Yes | What + when. Include trigger keywords. Under 200 chars. See SKILL.md §4 |
| `allowed-tools` | No | Only tools the skill actually needs. See SKILL.md §3 |
| `disable-model-invocation` | No | `true` if side-effects or destructive (user must invoke explicitly) |
| `user-invocable` | No | `false` only for background knowledge Claude references silently |
| `model` | No | Only set if a specific model is required; omit to inherit |
| `context` | No | `fork` to run in isolated subagent context |
| `agent` | No | When `context: fork`: `Explore`, `Plan`, or `general-purpose` |
| `argument-hint` | No | Show expected args in autocomplete (e.g., `[issue-number]`) |

**Omit any field that would be set to its default value.**

## Template

```markdown
---
name: <name>
description: <description>
[only include fields that differ from defaults]
---

# <Title>

## Purpose
One sentence explaining what this skill does.

## Instructions
1. Step 1
2. Step 2
3. Continue as needed

## Output Format
Expected structure of results.

## Best Practices
- Guideline 1
- Guideline 2

## Example
Concrete input → output demonstrating usage.
```

## Validation Checklist

**Frontmatter:**
- [ ] `name` is lowercase-hyphenated, under 64 chars
- [ ] `description` explains what AND when, includes trigger keywords
- [ ] `allowed-tools` only lists tools referenced in instructions (or omitted)
- [ ] No fields set to default values
- [ ] `model` only set if specific model is required

**Body:**
- [ ] Under 500 lines total
- [ ] Instructions are numbered and actionable
- [ ] Each instruction step is specific (not "do the thing")
- [ ] Output format is specified
- [ ] Includes at least one concrete example
- [ ] No placeholder text remains

**Description quality:**
- [ ] First clause: what it does
- [ ] Second clause: when to use it
- [ ] Contains trigger keywords a user would say
- [ ] Under 200 characters
