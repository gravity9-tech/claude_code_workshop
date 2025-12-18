---
description: Help debug an issue
argument-hint: <issue description>
allowed-tools: Read, Grep, Glob, Bash(git log:*), Bash(pytest:*)
---

Help debug: $ARGUMENTS

1. Search for related code using Grep and Glob
2. Check recent changes: `git log --oneline -10`
3. Run relevant tests: `pytest tests/ -v`
4. Identify the likely root cause
5. Propose solutions with trade-offs

If no issue is described, ask for details.
