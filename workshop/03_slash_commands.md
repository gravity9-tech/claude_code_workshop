# Workshop 03: Creating Custom Slash Commands

## Learning Objectives

By the end of this workshop, you will:
- Understand what slash commands are and why they're powerful
- Create custom commands for your project
- Use variables and arguments in commands
- Build a library of reusable workflow automations

---

## What Are Slash Commands?

Slash commands are reusable prompts that you can invoke with `/command-name`. They:

- Automate repetitive tasks
- Standardize team workflows
- Reduce typing and cognitive load
- Can accept arguments for flexibility

---

## How Slash Commands Work

Commands are Markdown files stored in:

```
.claude/commands/          # Project-specific commands
~/.claude/commands/        # User-level commands (available everywhere)
```

When you type `/my-command`, Claude reads the corresponding `.claude/commands/my-command.md` file and executes the prompt inside.

---

## Task 1: Create Your First Command

Let's create a command that runs the full quality check on our code.

### Step 1: Create the commands directory

```bash
mkdir -p .claude/commands
```

### Step 2: Create the command file

Create `.claude/commands/quality-check.md`:

```markdown
Run a comprehensive quality check on this project:

1. First, run the linter: `./scripts/lint.sh`
2. Then, run the formatter check: `./scripts/format.sh`
3. Finally, run all tests: `pytest tests/ -v`

Report any issues found in a clear, actionable format.
If everything passes, confirm the codebase is healthy.
```

### Step 3: Test your command

In Claude Code, type:

```
/quality-check
```

Claude will execute the entire quality workflow!

---

## Task 2: Command with Arguments

Commands can accept arguments using `$ARGUMENTS` placeholder.

### Create a test runner command

Create `.claude/commands/test.md`:

```markdown
Run tests based on the provided scope.

Arguments provided: $ARGUMENTS

Based on the arguments:
- If empty: run all tests with `pytest tests/ -v`
- If "api": run only API tests with `pytest tests/test_api.py -v`
- If "models": run only model tests with `pytest tests/test_models.py -v`
- If a specific test name: run `pytest tests/ -v -k "$ARGUMENTS"`

Show the test output and summarize the results.
```

### Usage examples:

```
/test              # Runs all tests
/test api          # Runs API tests only
/test models       # Runs model tests only
/test product      # Runs tests matching "product"
```

---

## Task 3: Code Review Command

Create a command that performs code review on staged changes.

Create `.claude/commands/review.md`:

```markdown
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
```

### Usage:

```
/review
```

---

## Task 4: Feature Generator Command

Create a command that scaffolds new features.

Create `.claude/commands/new-feature.md`:

```markdown
Create scaffolding for a new feature: $ARGUMENTS

Based on the feature name provided, create:

1. **API Route** (if needed)
   - Add endpoint in `app/api/routes.py`
   - Follow existing patterns for route structure
   - Include proper type hints and Pydantic models

2. **Test File**
   - Create tests in `tests/test_<feature>.py`
   - Include at least:
     - Happy path test
     - Error case test
     - Edge case test

3. **Update Documentation**
   - Add the new endpoint to CLAUDE.md if applicable

Follow these conventions:
- Use existing code patterns from the project
- Include type hints on all functions
- Add docstrings explaining purpose

Do NOT create the feature logic yet - just the scaffolding.
Ask me what the feature should do before implementing.
```

### Usage:

```
/new-feature user-reviews
```

---

## Task 5: Debug Helper Command

Create a command that helps debug issues.

Create `.claude/commands/debug.md`:

```markdown
Help debug the issue described: $ARGUMENTS

Follow this debugging process:

1. **Understand the Problem**
   - What is the expected behavior?
   - What is the actual behavior?
   - When did it start happening?

2. **Gather Information**
   - Check relevant log files
   - Look at recent changes: `git log --oneline -10`
   - Check if tests pass: `pytest tests/ -v`

3. **Identify Root Cause**
   - Search for related code
   - Check for common issues:
     - Import errors
     - Type mismatches
     - Missing dependencies
     - Configuration issues

4. **Propose Solutions**
   - List possible fixes
   - Recommend the best approach
   - Explain trade-offs

If $ARGUMENTS is empty, ask me to describe the issue.
```

### Usage:

```
/debug cart total is calculating incorrectly
/debug tests failing with import error
```

---

## Task 6: Documentation Generator

Create a command that generates documentation.

Create `.claude/commands/document.md`:

```markdown
Generate documentation for: $ARGUMENTS

Analyze the specified file or module and create documentation:

1. **If it's a Python file:**
   - Add/update docstrings for all public functions
   - Add type hints if missing
   - Create a module-level docstring explaining purpose

2. **If it's an API route:**
   - Document the endpoint URL, method, and purpose
   - List all parameters with types and descriptions
   - Document response format with examples
   - Note any error responses

3. **If it's a JavaScript file:**
   - Add JSDoc comments to functions
   - Document event handlers
   - Explain state management

Format documentation following project conventions.
Show me the changes before applying them.
```

### Usage:

```
/document app/api/routes.py
/document static/js/cart.js
```

---

## Task 7: Git Workflow Commands

Create commands for common git operations.

### Create `.claude/commands/pr.md`:

```markdown
Help me create a pull request for the current branch.

1. **Check Current State**
   - Run `git status` to see changes
   - Run `git branch` to confirm current branch
   - Run `git log main..HEAD --oneline` to see commits

2. **Validate Before PR**
   - Ensure all tests pass
   - Ensure code is formatted
   - Check for any TODO comments that need addressing

3. **Generate PR Description**
   Create a PR description with:
   - Summary of changes
   - Type: (feature/bugfix/refactor/docs)
   - Testing done
   - Screenshots (if UI changes)

4. **Create PR**
   Use `gh pr create` with the generated description.

If there are issues preventing PR creation, list them.
```

### Create `.claude/commands/commit.md`:

```markdown
Help me create a well-formatted commit.

1. **Review Changes**
   - Run `git diff --staged` to see staged changes
   - If nothing staged, run `git diff` to see unstaged changes

2. **Generate Commit Message**
   Following conventional commits format:
   - feat: new feature
   - fix: bug fix
   - docs: documentation changes
   - test: adding/updating tests
   - refactor: code refactoring
   - style: formatting, no code change
   - chore: maintenance tasks

3. **Structure**
   ```
   <type>(<scope>): <short description>

   <longer description if needed>

   <footer with breaking changes or issue refs>
   ```

4. **Create the Commit**
   Stage changes if needed and create the commit.
```

---

## Task 8: Exploring Available Commands

You can see all available commands by typing `/` and pressing Tab, or by running:

```
/help
```

To see what's in a command before running it:

```bash
cat .claude/commands/<command-name>.md
```

---

## Advanced: Command Composition

Commands can reference concepts that chain together. For example, your `/pr` command could include:

```markdown
Before creating the PR:
1. Run the equivalent of /quality-check
2. Run the equivalent of /review
```

This creates powerful workflow automation!

---

## Checkpoint: Verify Your Progress

Before moving on, ensure you have created:

- [ ] `.claude/commands/` directory
- [ ] At least 3 custom commands
- [ ] A command that uses `$ARGUMENTS`
- [ ] Tested each command works correctly

Your commands directory should look like:

```
.claude/
└── commands/
    ├── quality-check.md
    ├── test.md
    ├── review.md
    ├── new-feature.md
    ├── debug.md
    ├── document.md
    ├── pr.md
    └── commit.md
```

---

## Key Takeaways

1. **Commands are just Markdown** - Easy to create and share
2. **$ARGUMENTS adds flexibility** - Make commands accept input
3. **Standardize team workflows** - Everyone uses the same process
4. **Build incrementally** - Start simple, add complexity as needed

---

## Practical Exercise

Create a custom command for your workflow. Ideas:

1. `/deploy` - Run deployment checklist
2. `/standup` - Summarize recent git activity
3. `/refactor` - Suggest refactoring for a file
4. `/security-check` - Audit code for vulnerabilities
5. `/api-test` - Test an API endpoint interactively

---

## Next Steps

Now that you can automate with commands, let's learn about **Skills** - reusable prompt templates that can be shared across projects.

Continue to: [04_skills.md](./04_skills.md)
