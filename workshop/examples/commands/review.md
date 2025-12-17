Perform a code review on the current changes.

1. First, check what files have changed:
   - Run `git status` to see modified files
   - Run `git diff` to see unstaged changes
   - Run `git diff --staged` to see staged changes

2. For each changed file, review for:
   - Code correctness and logic errors
   - Security vulnerabilities (injection, XSS, etc.)
   - Performance issues
   - Adherence to project conventions (check CLAUDE.md)
   - Missing error handling
   - Missing or inadequate tests

3. Provide feedback in this format:

## Review Summary
- Files reviewed: [count]
- Issues found: [count]
- Severity: [Critical/Warning/Info]

## Issues

### [Filename]:[Line Number]
**Severity**: [Critical/Warning/Info]
**Issue**: [Description]
**Suggestion**: [How to fix]

## Recommendations
[Overall recommendations for the changes]
