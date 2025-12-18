---
description: Review current git changes for issues
allowed-tools: Bash(git diff:*), Bash(git status:*)
---

Review the current git changes:

1. Run `git status` to see modified files
2. Run `git diff` for unstaged changes
3. Run `git diff --staged` for staged changes

For each changed file, check for:
- Logic errors
- Security issues (injection, XSS, exposed secrets)
- Missing error handling
- Code style issues

Provide feedback as:

## Review Summary
- Files reviewed: [count]
- Issues: [count]

## Issues (if any)
### [filename]:[line]
**Severity**: Critical | Warning | Info
**Issue**: [description]
**Suggestion**: [fix]
