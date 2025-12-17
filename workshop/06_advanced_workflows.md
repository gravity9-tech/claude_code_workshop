# Workshop 06: Advanced Workflows - Putting It All Together

## Learning Objectives

By the end of this workshop, you will:
- Combine commands, skills, and agents into powerful workflows
- Build end-to-end automated development processes
- Create team-wide standardized workflows
- Understand best practices for complex automation

---

## The Power of Combination

Each Claude Code feature is useful alone, but combined they become transformative:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  CLAUDE.md  │────>│  Commands   │────>│   Agents    │
│  (Context)  │     │ (Triggers)  │     │  (Workers)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────────────┐
                    │    Skills    │
                    │ (Knowledge)  │
                    └──────────────┘
```

---

## Workflow 1: Complete Feature Development

### The Challenge

Developing a new feature involves many steps:
1. Understanding existing patterns
2. Planning the implementation
3. Writing the code
4. Writing tests
5. Documenting changes
6. Code review
7. Creating a PR

### The Automated Workflow

Create `.claude/commands/new-feature-workflow.md`:

```markdown
# Complete Feature Development Workflow

Feature to implement: $ARGUMENTS

## Phase 1: Research & Planning (Parallel)

Run these agents simultaneously:

1. **Explore Agent**: Find existing patterns in this codebase that are similar to this feature. Look for:
   - Similar API endpoints
   - Related data models
   - UI patterns if applicable
   - Test patterns

2. **Plan Agent**: Create an implementation plan for this feature that includes:
   - Data model changes
   - API endpoint design
   - Frontend changes (if any)
   - Test strategy
   - Migration needs (if any)

Wait for both agents to complete before proceeding.

## Phase 2: Review the Plan

Present the implementation plan for my approval. Include:
- Summary of findings from exploration
- Proposed implementation steps
- Files that will be created/modified
- Estimated complexity

**STOP HERE** and wait for my feedback before proceeding.

## Phase 3: Implementation

Once approved, proceed with:

1. Create/modify data models
2. Implement API endpoints
3. Add frontend code if needed
4. Run tests to verify nothing broke

## Phase 4: Quality Assurance (Parallel)

Run these agents simultaneously:

1. **Test Generator Agent**: Generate comprehensive tests for the new feature
2. **Code Reviewer Agent**: Review all changes for issues
3. **Doc Generator Agent**: Update documentation

## Phase 5: Final Checklist

Before committing:
- [ ] All tests pass
- [ ] Linter passes
- [ ] Documentation updated
- [ ] No security issues found
- [ ] Changes follow project conventions

Generate a summary of all changes made.
```

### Usage:

```
/new-feature-workflow user-wishlist-persistence
```

---

## Workflow 2: Bug Fix Pipeline

### The Challenge

Debugging involves:
1. Reproducing the issue
2. Finding root cause
3. Implementing fix
4. Ensuring no regressions
5. Testing the fix

### The Automated Workflow

Create `.claude/commands/fix-bug.md`:

```markdown
# Bug Fix Workflow

Bug description: $ARGUMENTS

## Phase 1: Investigation (Parallel)

Run simultaneously:

1. **Explore Agent**: Find all code related to this bug:
   - Search for relevant keywords
   - Trace data flow
   - Find related tests

2. **Explore Agent**: Check recent changes that might have caused this:
   - Run `git log --oneline -20`
   - Look for changes to relevant files

## Phase 2: Root Cause Analysis

Based on exploration findings:

1. Identify the exact location of the bug
2. Explain why the bug occurs
3. Determine the scope of impact

Present findings and proposed fix approach. **STOP** for approval.

## Phase 3: Implementation

1. Implement the fix
2. Ensure the fix is minimal and focused
3. Don't refactor unrelated code

## Phase 4: Verification (Parallel)

Run simultaneously:

1. **Test Generator Agent**: Create/update tests that:
   - Would have caught this bug
   - Verify the fix works
   - Check for regressions

2. **Code Reviewer Agent**: Verify the fix:
   - Doesn't introduce new issues
   - Is the right approach
   - Follows project patterns

## Phase 5: Summary

Provide:
- Root cause explanation
- Fix description
- Test coverage added
- Any related issues found
```

### Usage:

```
/fix-bug cart total shows NaN when applying certain discount codes
```

---

## Workflow 3: Code Review Automation

### The Challenge

Code reviews need to check:
- Correctness
- Security
- Performance
- Testing
- Documentation

### The Automated Workflow

Create `.claude/commands/full-review.md`:

```markdown
# Comprehensive Code Review Workflow

Files/changes to review: $ARGUMENTS

## Phase 1: Gather Context

1. Get list of changed files:
   ```bash
   git diff --name-only main
   ```

2. Get the diff:
   ```bash
   git diff main
   ```

## Phase 2: Multi-Agent Review (Parallel)

Launch 4 specialized review passes:

1. **Code Reviewer Agent (Security Focus)**:
   Review with the code-reviewer skill focusing on:
   - Injection vulnerabilities
   - Authentication/authorization
   - Data exposure
   - Input validation

2. **Code Reviewer Agent (Performance Focus)**:
   Review focusing on:
   - N+1 queries
   - Memory usage
   - Async handling
   - Caching opportunities

3. **Test Generator Agent**:
   Verify test coverage:
   - Are new functions tested?
   - Are edge cases covered?
   - Generate any missing tests

4. **Doc Generator Agent**:
   Check documentation:
   - Are API changes documented?
   - Are complex functions explained?
   - Is README current?

## Phase 3: Consolidated Report

Compile all findings into:

```markdown
# Code Review Report

## Summary
- **Total Issues**: X
- **Critical**: X
- **Warnings**: X
- **Suggestions**: X

## Security Issues
[List from security review]

## Performance Issues
[List from performance review]

## Missing Tests
[List from test review]

## Documentation Gaps
[List from doc review]

## Verdict
[ ] Approved
[ ] Approved with minor changes
[ ] Needs revision

## Required Changes
[If any]
```
```

### Usage:

```
/full-review
```

---

## Workflow 4: Sprint Planning Assistant

### The Challenge

Sprint planning needs:
- Breaking down features
- Estimating complexity
- Identifying dependencies
- Creating actionable tasks

### The Automated Workflow

Create `.claude/commands/plan-sprint.md`:

```markdown
# Sprint Planning Workflow

Features to plan: $ARGUMENTS

## Phase 1: Feature Analysis (Parallel)

For each feature mentioned, run an Explore agent to:
- Find similar existing implementations
- Identify integration points
- Assess complexity based on codebase

## Phase 2: Break Down Features

For each feature, provide:

### Feature: [Name]

**Description**: What it does

**Components**:
1. Backend changes
   - Models: [list]
   - APIs: [list]
   - Services: [list]

2. Frontend changes
   - Components: [list]
   - State: [list]

3. Infrastructure
   - Migrations: [yes/no]
   - Config changes: [list]

**Dependencies**:
- Depends on: [list]
- Blocks: [list]

**Complexity Assessment**:
- Code complexity: [Low/Medium/High]
- Risk level: [Low/Medium/High]
- Testing needs: [Light/Moderate/Heavy]

## Phase 3: Task Generation

Create detailed tasks:

```markdown
### Task: [Descriptive Name]

**Feature**: [Parent feature]
**Type**: [Backend/Frontend/Infrastructure/Testing]

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2

**Technical Notes**:
- Relevant files: [list]
- Patterns to follow: [reference]
- Watch out for: [gotchas]
```

## Phase 4: Sprint Summary

```markdown
## Sprint Overview

**Total Features**: X
**Total Tasks**: X

### By Complexity
- High: X tasks
- Medium: X tasks
- Low: X tasks

### By Type
- Backend: X tasks
- Frontend: X tasks
- Testing: X tasks

### Recommended Order
1. [Task - because reason]
2. [Task - because reason]
...

### Risks
- [Risk 1]
- [Risk 2]
```
```

### Usage:

```
/plan-sprint product reviews, advanced filtering, order history
```

---

## Workflow 5: Production Deployment Checklist

### The Automated Workflow

Create `.claude/commands/deploy-check.md`:

```markdown
# Pre-Deployment Verification Workflow

## Phase 1: Code Quality (Parallel)

Run simultaneously:

1. **Run Tests**:
   ```bash
   pytest tests/ -v
   ```

2. **Run Linter**:
   ```bash
   ./scripts/lint.sh
   ```

3. **Check Formatting**:
   ```bash
   ./scripts/format.sh --check
   ```

## Phase 2: Security Scan

Run Code Reviewer Agent with security focus on all files changed since last deployment:

```bash
git diff $(git describe --tags --abbrev=0)..HEAD --name-only
```

## Phase 3: Dependency Check

1. Check for outdated dependencies:
   ```bash
   pip list --outdated
   ```

2. Check for known vulnerabilities:
   ```bash
   pip-audit
   ```

## Phase 4: Database Checks

1. Are there pending migrations?
2. Are migrations reversible?
3. Will migrations require downtime?

## Phase 5: Generate Report

```markdown
# Deployment Readiness Report

**Date**: [Today]
**Branch**: [Current branch]
**Last Tag**: [Previous release]

## Checklist

### Tests
- [ ] All tests pass: [PASS/FAIL]
- [ ] Coverage meets threshold: [X%]

### Code Quality
- [ ] Linter passes: [PASS/FAIL]
- [ ] Formatting correct: [PASS/FAIL]

### Security
- [ ] No critical vulnerabilities: [PASS/FAIL]
- [ ] No high vulnerabilities: [PASS/FAIL]
- [ ] Security review complete: [PASS/FAIL]

### Dependencies
- [ ] No vulnerable packages: [PASS/FAIL]
- [ ] Dependencies up to date: [PASS/FAIL]

### Database
- [ ] Migrations ready: [PASS/FAIL]
- [ ] Rollback tested: [PASS/FAIL]

## Decision

**Ready for Deployment**: [YES/NO]

**Blockers** (if any):
- [List]

**Warnings** (non-blocking):
- [List]
```
```

### Usage:

```
/deploy-check
```

---

## Workflow 6: Automated Refactoring

### The Automated Workflow

Create `.claude/commands/refactor.md`:

```markdown
# Guided Refactoring Workflow

Target for refactoring: $ARGUMENTS

## Phase 1: Analysis (Parallel)

Run simultaneously:

1. **Explore Agent**: Analyze the target code:
   - Map all dependencies
   - Find all usages
   - Identify patterns

2. **Code Reviewer Agent**: Assess current state:
   - What's wrong with current code?
   - What are the code smells?
   - What risks exist?

## Phase 2: Refactoring Plan

Based on analysis, propose refactoring:

```markdown
## Refactoring Plan

### Current Issues
1. [Issue 1]
2. [Issue 2]

### Proposed Changes
1. [Change 1]
   - Files affected: [list]
   - Risk: [Low/Medium/High]

### Order of Operations
1. [Step - safe, can be tested independently]
2. [Step - builds on previous]
...

### Breaking Changes
- [If any]

### Migration Path
- [If needed for breaking changes]
```

**STOP** for approval before proceeding.

## Phase 3: Execute Refactoring

For each step:
1. Make the change
2. Run tests
3. Commit (if tests pass)
4. Proceed to next step

## Phase 4: Verification

Run in parallel:

1. **Full test suite**: Ensure nothing broke
2. **Code Reviewer Agent**: Verify improvement
3. **Performance check**: Compare before/after if relevant

## Phase 5: Summary

```markdown
## Refactoring Complete

**Changes Made**:
- [List of changes]

**Files Modified**:
- [List]

**Tests**:
- Before: [X passing]
- After: [X passing]

**Improvements**:
- [What's better now]

**Next Steps** (if any):
- [Recommendations]
```
```

### Usage:

```
/refactor app/api/routes.py - extract common validation logic
```

---

## Best Practices for Workflow Design

### 1. Use Checkpoints

Always include `**STOP**` points where human review is needed:

```markdown
Present the plan. **STOP HERE** and wait for approval before proceeding.
```

### 2. Run Independent Tasks in Parallel

When tasks don't depend on each other, run them simultaneously:

```markdown
## Phase 2: Multi-Agent Analysis (Parallel)

Run these agents simultaneously:
1. [Agent 1]
2. [Agent 2]
3. [Agent 3]
```

### 3. Structure Phases Clearly

Organize workflows into logical phases:

```markdown
## Phase 1: Research
## Phase 2: Planning
## Phase 3: Implementation
## Phase 4: Verification
## Phase 5: Documentation
```

### 4. Provide Clear Output Templates

Define what the output should look like:

```markdown
## Output Format

Provide results as:

\`\`\`markdown
# Title

## Section 1
[Content]

## Section 2
[Content]
\`\`\`
```

### 5. Include Fallback Instructions

Handle edge cases:

```markdown
If no issues are found, report:
"All checks passed. Ready to proceed."

If critical issues are found:
**STOP** immediately and report before any further action.
```

---

## Checkpoint: Workshop Complete!

You have now learned:

- [ ] Setting up Claude Code with `/init`
- [ ] Creating and customizing CLAUDE.md memory files
- [ ] Building custom slash commands
- [ ] Creating reusable skills
- [ ] Working with subagents
- [ ] Combining everything into powerful workflows

---

## Your .claude Directory

After completing all workshops, your structure should look like:

```
.claude/
├── commands/
│   ├── quality-check.md
│   ├── test.md
│   ├── review.md
│   ├── new-feature.md
│   ├── debug.md
│   ├── document.md
│   ├── pr.md
│   ├── commit.md
│   ├── new-feature-workflow.md
│   ├── fix-bug.md
│   ├── full-review.md
│   ├── plan-sprint.md
│   ├── deploy-check.md
│   └── refactor.md
├── skills/
│   ├── api-designer.md
│   ├── code-reviewer.md
│   ├── test-architect.md
│   ├── query-optimizer.md
│   ├── refactorer.md
│   └── pandora-domain.md
└── agents/
    ├── code-reviewer.md
    ├── test-generator.md
    ├── doc-generator.md
    └── migration-planner.md
```

---

## Final Exercise: Build Your Own Workflow

Create a custom workflow for something YOU do regularly:

Ideas:
- PR merge process
- Release preparation
- Performance profiling
- Security audit
- Data migration
- API versioning
- Component library update

Share your workflow with your team!

---

## Additional Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Anthropic Discord](https://discord.gg/anthropic)

---

## Congratulations!

You've completed the Claude Code Workshop. You now have the skills to:

1. **Accelerate development** with AI-powered assistance
2. **Standardize workflows** across your team
3. **Automate repetitive tasks** with commands
4. **Leverage specialized knowledge** with skills
5. **Scale with parallel execution** using agents

Happy coding with Claude!
