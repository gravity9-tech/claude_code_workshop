# Workshop 02: Mastering Claude's Memory System

## Learning Objectives

By the end of this workshop, you will:
- Understand the hierarchy of CLAUDE.md files
- Know when to use project vs user-level memory
- Create effective memory files that improve Claude's responses
- Use memory to enforce team standards and conventions

---

## The Memory Hierarchy

Claude Code reads memory files from multiple locations, merged in order of precedence:

```
~/.claude/CLAUDE.md          # User-level (your personal preferences)
    ↓
./CLAUDE.md                  # Project root (team-wide settings)
    ↓
./src/CLAUDE.md              # Directory-specific (module context)
    ↓
Current conversation         # Immediate context
```

Each level can override or extend the previous ones.

---

## Task 1: Understanding Memory Scope

### User-Level Memory (`~/.claude/CLAUDE.md`)

This file contains YOUR personal preferences that apply to ALL projects:

```markdown
# Personal Claude Preferences

## Coding Style
- I prefer explicit over implicit
- Always include type hints in Python
- Use descriptive variable names

## Communication
- Be concise in explanations
- Show code examples when explaining concepts
- Ask before making large changes

## Tools I Use
- pytest for Python testing
- git for version control
- VS Code as my editor
```

### Create your user-level memory:

```bash
mkdir -p ~/.claude
touch ~/.claude/CLAUDE.md
```

Edit it with your preferences.

---

## Task 2: Project-Level Memory Deep Dive

Your project's `CLAUDE.md` should contain everything Claude needs to work effectively on THIS project.

### Essential Sections

#### 1. Project Identity

```markdown
# Pandora E-Commerce Workshop

## What This Is
A FastAPI-based e-commerce PWA for luxury jewelry.
This is a learning project for the Claude Code workshop.

## What This Is NOT
- Not a production application
- Not connected to real payment systems
- Not using a real database (mock data only)
```

#### 2. Development Commands

```markdown
## Development Commands

### Running the App
```bash
python main.py
# Server starts at http://localhost:8000
```

### Running Tests
```bash
# All tests
pytest tests/ -v

# Specific test file
pytest tests/test_api.py -v

# With coverage
pytest tests/ -v --cov=app
```

### Code Quality
```bash
# Format code
./scripts/format.sh

# Run linter
./scripts/lint.sh

# Full quality check
./scripts/quality.sh
```
```

#### 3. Architecture Decisions

```markdown
## Architecture

### Why FastAPI?
- Async support for high performance
- Automatic OpenAPI documentation
- Pydantic integration for validation

### Data Flow
1. Request hits FastAPI route in `app/api/routes.py`
2. Route handler uses mock data from `app/mock_data.py`
3. Response validated via Pydantic models in `app/models.py`
4. JSON returned to client

### Frontend Architecture
- Vanilla JavaScript (no framework)
- Local storage for cart persistence
- Service worker for PWA features
```

---

## Task 3: Directory-Specific Memory

For larger projects, you can add `CLAUDE.md` files to specific directories:

### Example: `tests/CLAUDE.md`

Create this file:

```markdown
# Test Directory Context

## Testing Framework
Using pytest with fixtures defined in conftest.py

## Test Naming Convention
- test_<feature>_<scenario>_<expected_result>
- Example: test_get_product_with_valid_id_returns_product

## Running Specific Tests
```bash
# Run only API tests
pytest tests/test_api.py -v

# Run tests matching pattern
pytest tests/ -v -k "product"

# Run with print statements visible
pytest tests/ -v -s
```

## Mock Data
Tests use the same mock data as the application.
Do not modify mock_data.py for tests - use fixtures instead.

## Coverage Requirements
- New features must have >80% test coverage
- API endpoints must have happy path + error tests
```

### Create it:

```bash
touch tests/CLAUDE.md
```

---

## Task 4: Memory for Team Standards

Use CLAUDE.md to enforce consistent practices across your team.

### Add to your project CLAUDE.md:

```markdown
## Code Review Checklist

When reviewing or writing code, ensure:

### Python Code
- [ ] Type hints on all function signatures
- [ ] Docstrings on public functions
- [ ] No hardcoded values (use constants or config)
- [ ] Error handling for external calls

### API Endpoints
- [ ] Proper HTTP status codes
- [ ] Consistent response format
- [ ] Input validation via Pydantic
- [ ] Tests for success and failure cases

### JavaScript Code
- [ ] No console.log in production code
- [ ] Event listeners properly cleaned up
- [ ] Error handling for fetch calls

## Git Workflow

### Branch Naming
- feature/<description>
- bugfix/<description>
- refactor/<description>

### Commit Messages
Follow conventional commits:
- feat: new feature
- fix: bug fix
- docs: documentation
- test: adding tests
- refactor: code refactoring
```

---

## Task 5: Dynamic Context with Memory

Your CLAUDE.md can include context that helps Claude make better decisions:

### Add troubleshooting guides:

```markdown
## Common Issues & Solutions

### Port 8000 Already in Use
```bash
# Find process using port
lsof -i :8000
# Kill it
kill -9 <PID>
```

### Tests Failing with Import Errors
Ensure you're in the project root and have installed dependencies:
```bash
pip install -r requirements.txt
```

### Static Files Not Loading
The app must be run from project root for static file paths to work:
```bash
python main.py  # Correct
cd app && python main.py  # Wrong!
```
```

### Add known limitations:

```markdown
## Known Limitations

### Mock Data
- Product IDs are 1-15
- Categories: rings, necklaces, bracelets
- No pagination implemented

### No Authentication
- No user accounts
- Cart is browser-local only
- No order persistence

### PWA Limitations
- Service worker caches may need manual clearing during development
- Run `navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))` in console to clear
```

---

## Task 6: Testing Your Memory Setup

Let's verify Claude is reading your memory files correctly.

### Test 1: Ask about project structure

```
What tech stack does this project use?
```

Claude should reference information from CLAUDE.md.

### Test 2: Ask about conventions

```
What testing conventions should I follow?
```

Claude should mention your documented conventions.

### Test 3: Ask about commands

```
How do I run the linter?
```

Claude should provide the exact command from your documentation.

---

## Task 7: Memory Best Practices

### DO:
- Keep memory files focused and organized
- Update them when project conventions change
- Include examples where helpful
- Document the "why" not just the "what"

### DON'T:
- Include sensitive information (secrets, API keys)
- Make them too long (Claude has context limits)
- Duplicate information across files
- Include temporary or outdated information

### Recommended Length:
- User-level: 50-100 lines
- Project-level: 100-300 lines
- Directory-level: 20-50 lines

---

## Checkpoint: Verify Your Progress

Before moving on, ensure you have:

- [ ] Created `~/.claude/CLAUDE.md` with personal preferences
- [ ] Enhanced project `CLAUDE.md` with detailed context
- [ ] Created at least one directory-specific `CLAUDE.md`
- [ ] Tested that Claude reads and uses the memory
- [ ] Documented at least 3 team conventions

---

## Key Takeaways

1. **Memory is hierarchical** - User → Project → Directory → Conversation
2. **Be specific** - The more detail, the better Claude performs
3. **Keep it current** - Outdated memory causes confusion
4. **Team alignment** - CLAUDE.md can enforce standards across developers

---

## Practical Exercise

Update your project's `CLAUDE.md` to include:

1. A "Quick Start" section for new developers
2. At least 5 coding conventions
3. Common commands with explanations
4. One architecture decision with rationale

---

## Next Steps

Now that Claude understands your project, let's create **custom slash commands** to automate your workflow.

Continue to: [03_slash_commands.md](./03_slash_commands.md)
