# Workshop 01: Getting Started with Claude Code

## Learning Objectives

By the end of this workshop, you will:
- Understand what Claude Code is and how it differs from traditional AI assistants
- Initialize Claude Code in a project using `/init`
- Understand the CLAUDE.md memory system
- Run your first commands and understand the permission model

---

## What is Claude Code?

Claude Code is Anthropic's official CLI tool that brings Claude directly into your terminal. Unlike chat-based interfaces, Claude Code:

- **Operates in your codebase**: It can read, write, and execute code in your actual project
- **Maintains context**: Through CLAUDE.md files, it remembers project-specific information
- **Uses tools**: It can run bash commands, search files, make edits, and more
- **Works autonomously**: It can plan and execute multi-step tasks

---

## Task 1: Installing Claude Code (if not already installed)

If you haven't installed Claude Code yet, run:

```bash
npm install -g @anthropic-ai/claude-code
```

Verify the installation:

```bash
claude --version
```

---

## Task 2: Initialize Claude Code with `/init`

The `/init` command is your first step in any new project. It creates a `CLAUDE.md` file that serves as Claude's "memory" for your project.

### Step 1: Navigate to the project

```bash
cd claude_code_workshop
```

### Step 2: Start Claude Code

```bash
claude
```

### Step 3: Run the init command

Once inside the Claude Code interface, type:

```
/init
```

### What happens during `/init`?

Claude will:
1. Analyze your project structure
2. Read key configuration files (package.json, pyproject.toml, etc.)
3. Understand your tech stack
4. Generate a `CLAUDE.md` file with project context

### Expected Output

After running `/init`, you should see a new `CLAUDE.md` file in your project root. It will contain:

- Project overview
- Tech stack information
- Important commands (build, test, lint)
- Project structure
- Coding conventions

---

## Task 3: Explore the Generated CLAUDE.md

Open the generated `CLAUDE.md` file and examine its contents:

```bash
cat CLAUDE.md
```

### Understanding CLAUDE.md Structure

The file typically contains:

```markdown
# Project Name

## Overview
Brief description of what the project does

## Tech Stack
- Language: Python 3.11
- Framework: FastAPI
- Testing: Pytest

## Commands
- Run server: `python main.py`
- Run tests: `pytest tests/ -v`
- Lint: `./scripts/lint.sh`

## Project Structure
Key directories and their purposes

## Conventions
Coding standards and patterns used
```

### Why is this important?

Every time you start a new Claude Code session, Claude reads this file first. This means:
- Claude immediately understands your project
- You don't need to re-explain context
- Commands and conventions are consistent

---

## Task 4: Customize Your CLAUDE.md

The generated CLAUDE.md is a starting point. You should customize it!

### Add project-specific information:

Edit `CLAUDE.md` and add:

1. **Team conventions**:
   ```markdown
   ## Team Conventions
   - All API endpoints must have tests
   - Use type hints in Python code
   - Commit messages follow conventional commits
   ```

2. **Common gotchas**:
   ```markdown
   ## Gotchas
   - The mock_data.py file should not be modified directly
   - Always run tests before committing
   ```

3. **Preferred approaches**:
   ```markdown
   ## Preferences
   - Prefer composition over inheritance
   - Use Pydantic for all data validation
   - Keep functions under 20 lines when possible
   ```

---

## Task 5: Understanding the Permission Model

Claude Code operates with a permission system to keep you in control.

### Permission Levels

1. **Read operations**: Usually allowed automatically
   - Reading files
   - Searching code
   - Listing directories

2. **Write operations**: Requires approval
   - Creating files
   - Editing files
   - Deleting files

3. **Execute operations**: Requires approval
   - Running bash commands
   - Installing packages
   - Running tests

### Try it yourself

Ask Claude to do something and observe the permission prompt:

```
Show me the contents of app/main.py
```

Then try:

```
Add a comment to app/main.py explaining the app initialization
```

Notice how Claude asks for permission before making changes.

---

## Task 6: Basic Commands to Know

Here are essential commands you'll use regularly:

| Command | Description |
|---------|-------------|
| `/init` | Initialize/regenerate CLAUDE.md |
| `/help` | Show help and available commands |
| `/clear` | Clear conversation context |
| `/compact` | Summarize conversation to save context |
| `/cost` | Show token usage and cost |
| `/config` | View or modify settings |

### Try each command

1. Run `/help` to see all available commands
2. Run `/cost` to see your current usage
3. Run `/config` to see your settings

---

## Checkpoint: Verify Your Progress

Before moving to the next workshop, ensure you have:

- [ ] Claude Code installed and running
- [ ] Run `/init` in the workshop project
- [ ] A `CLAUDE.md` file exists in your project root
- [ ] You've examined the generated content
- [ ] You understand the permission model
- [ ] You've tried the basic commands

---

## Key Takeaways

1. **`/init` is your starting point** - Always run it in new projects
2. **CLAUDE.md is Claude's memory** - Customize it for better results
3. **Permissions keep you safe** - Claude asks before making changes
4. **Context matters** - The better your CLAUDE.md, the better Claude performs

---

## Next Steps

In the next workshop, you'll learn how to create **custom slash commands** to automate repetitive tasks specific to your workflow.

Continue to: [02_claude_memory.md](./02_claude_memory.md)
