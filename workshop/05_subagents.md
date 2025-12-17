# Workshop 05: Mastering Subagents for Parallel Work

## Learning Objectives

By the end of this workshop, you will:
- Understand what subagents are and when to use them
- Create custom agent configurations
- Run multiple agents in parallel
- Build practical developer workflows using agents

---

## What Are Subagents?

Subagents are autonomous Claude instances that can:

- Work independently on specific tasks
- Run in parallel for maximum efficiency
- Have specialized capabilities (tools, focus areas)
- Return results to the main conversation

**Think of them as:** Spawning junior developers who go off, do research or work, and report back.

---

## Built-in Agent Types

Claude Code comes with several built-in agents:

| Agent Type | Purpose | Best For |
|------------|---------|----------|
| `Explore` | Codebase exploration | Finding files, understanding architecture |
| `Plan` | Implementation planning | Designing approaches, architecture decisions |
| `general-purpose` | Complex multi-step tasks | Research, multi-file changes |

---

## Task 1: Using the Explore Agent

The Explore agent is perfect for understanding codebases.

### Try these prompts:

```
Explore this codebase and explain the architecture
```

```
Find all files related to the shopping cart functionality
```

```
What patterns are used for API error handling?
```

### What happens behind the scenes:

1. Claude spawns an Explore agent
2. The agent searches files, reads code, traces relationships
3. Agent compiles findings
4. Results are returned to your conversation

---

## Task 2: Using the Plan Agent

The Plan agent helps design implementation strategies.

### Try these prompts:

```
Plan how I would add a user authentication system to this app
```

```
Create an implementation plan for adding product search with filters
```

### The Plan agent will:

1. Analyze existing code structure
2. Identify integration points
3. Design step-by-step implementation
4. Consider trade-offs and alternatives
5. Present a detailed plan for approval

---

## Task 3: Creating Custom Agent Configurations

Custom agents are defined in `.claude/agents/` directory.

### Step 1: Create the agents directory

```bash
mkdir -p .claude/agents
```

### Step 2: Create a Code Reviewer Agent

Create `.claude/agents/code-reviewer.md`:

```markdown
---
name: Code Reviewer
description: Performs thorough code reviews with security and performance focus
tools:
  - Read
  - Grep
  - Glob
model: sonnet
---

# Code Reviewer Agent

You are an expert code reviewer. Your task is to review code changes thoroughly.

## Review Process

1. **Understand Context**
   - Read the files being reviewed
   - Understand what the code is trying to accomplish
   - Check related files for consistency

2. **Security Review**
   - Look for injection vulnerabilities
   - Check authentication/authorization
   - Identify data exposure risks
   - Review input validation

3. **Performance Review**
   - Identify N+1 query patterns
   - Check for unnecessary computations
   - Look for memory leaks
   - Review async handling

4. **Code Quality**
   - Check naming conventions
   - Verify error handling
   - Assess test coverage
   - Review documentation

## Output Format

Provide findings as:

```
## Review Summary

**Files Reviewed**: [list]
**Risk Level**: [Low/Medium/High/Critical]
**Issues Found**: [count by severity]

## Critical Issues
[If any]

## Warnings
[List with file:line references]

## Suggestions
[Optional improvements]

## Approval
[Approved / Approved with suggestions / Needs changes]
```

Be constructive and specific. Always provide solutions, not just problems.
```

### Step 3: Create a Test Generator Agent

Create `.claude/agents/test-generator.md`:

```markdown
---
name: Test Generator
description: Generates comprehensive test suites for code
tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
model: sonnet
---

# Test Generator Agent

You are an expert test engineer. Your task is to generate comprehensive tests.

## Process

1. **Analyze the Code**
   - Read the file(s) to be tested
   - Identify all public functions/methods
   - Understand dependencies and side effects
   - Note edge cases and error conditions

2. **Design Test Cases**
   For each function, create tests for:
   - Happy path (normal operation)
   - Edge cases (empty, null, boundaries)
   - Error conditions (invalid input, failures)
   - Integration scenarios (if applicable)

3. **Generate Tests**
   Follow the project's testing conventions:
   - Use pytest for Python
   - Follow existing test file patterns
   - Use appropriate fixtures
   - Include docstrings explaining test purpose

## Test Naming Convention

```
test_<function>_<scenario>_<expected>

Examples:
- test_get_product_with_valid_id_returns_product
- test_get_product_with_invalid_id_raises_404
- test_add_to_cart_with_empty_cart_creates_item
```

## Output

Create test files following the pattern `tests/test_<module>.py`

Include:
- All necessary imports
- Fixtures at the top
- Tests grouped by function being tested
- Comments explaining non-obvious test logic
```

---

## Task 4: Running Parallel Agents

One of the most powerful features is running agents in parallel.

### Example: Comprehensive Code Analysis

Ask Claude:

```
I want you to run these agents in parallel:
1. Explore agent: Find all API endpoints and their handlers
2. Code reviewer: Review the routes.py file for security issues
3. Test generator: Generate tests for any untested endpoints
```

### Behind the scenes:

Claude will spawn multiple agents simultaneously:

```
[Agent 1: Explore] ─────> Mapping endpoints
[Agent 2: Review] ─────> Security analysis      } Running in parallel
[Agent 3: Tests]  ─────> Generating tests
```

Results are collected and presented together.

---

## Task 5: Create a Documentation Agent

Create `.claude/agents/doc-generator.md`:

```markdown
---
name: Documentation Generator
description: Generates comprehensive documentation for code
tools:
  - Read
  - Grep
  - Glob
  - Write
model: haiku
---

# Documentation Generator Agent

You generate clear, comprehensive documentation.

## Documentation Types

### API Documentation
For each endpoint:
- HTTP method and URL
- Description of purpose
- Request parameters (path, query, body)
- Response format with examples
- Error responses
- Authentication requirements

### Code Documentation
For modules/classes:
- Purpose and responsibility
- Public interface
- Usage examples
- Dependencies

### README Updates
- Feature descriptions
- Setup instructions
- Configuration options

## Output Format

Generate documentation in Markdown format:

```markdown
## Endpoint: GET /api/products

Retrieves a list of products.

### Parameters

| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| category | string | query | No | Filter by category |

### Response

\`\`\`json
{
  "products": [
    {
      "id": 1,
      "name": "Diamond Ring",
      "price": 2999.99
    }
  ]
}
\`\`\`

### Errors

| Status | Description |
|--------|-------------|
| 400 | Invalid category |
```
```

---

## Task 6: Create a Migration Agent

Create `.claude/agents/migration-planner.md`:

```markdown
---
name: Migration Planner
description: Plans safe database and code migrations
tools:
  - Read
  - Grep
  - Glob
model: sonnet
---

# Migration Planner Agent

You are an expert at planning safe migrations.

## Migration Types

### Database Migrations
- Schema changes
- Data migrations
- Index additions/removals

### Code Migrations
- API version upgrades
- Dependency updates
- Refactoring large changes

## Planning Process

1. **Impact Analysis**
   - What files/tables are affected?
   - What depends on the changed components?
   - What could break?

2. **Risk Assessment**
   - Data loss potential
   - Downtime requirements
   - Rollback complexity

3. **Step-by-Step Plan**
   - Pre-migration checks
   - Backup procedures
   - Migration steps
   - Verification steps
   - Rollback plan

## Output Format

```markdown
## Migration Plan: [Description]

### Impact Assessment
- **Affected Files**: [list]
- **Risk Level**: [Low/Medium/High]
- **Estimated Downtime**: [if any]

### Pre-Migration Checklist
- [ ] Backup database
- [ ] Notify stakeholders
- [ ] Verify staging environment

### Migration Steps
1. [Step with command/action]
2. [Verification check]
...

### Rollback Plan
1. [How to undo if things go wrong]

### Post-Migration Verification
- [ ] Run test suite
- [ ] Verify critical paths
- [ ] Monitor error rates
```
```

---

## Task 7: Practical Developer Workflows

### Workflow 1: Feature Development

```
I'm starting work on a new feature: product reviews.

Run these agents in parallel:
1. Explore: Find existing patterns for new features in this codebase
2. Plan: Design the implementation for product reviews (model, API, UI)
```

### Workflow 2: Bug Investigation

```
Users report the cart total is sometimes wrong.

Run these agents:
1. Explore: Find all code related to cart total calculation
2. Code reviewer: Review the cart calculation code for bugs
```

### Workflow 3: Pre-PR Checklist

```
I'm about to create a PR. Run in parallel:
1. Code reviewer: Review all changed files
2. Test generator: Ensure new code has tests
3. Doc generator: Update API docs if endpoints changed
```

### Workflow 4: Onboarding

```
I'm new to this project. Help me understand it by running:
1. Explore: Map the overall architecture
2. Explore: Identify the main entry points
3. Explore: Find the testing strategy
```

---

## Task 8: Agent Best Practices

### DO:

- **Use specific prompts**: Tell agents exactly what you want
- **Run in parallel**: When tasks are independent, parallelize
- **Match agent to task**: Use Explore for research, Plan for design
- **Check results**: Agents are helpful but verify important findings

### DON'T:

- **Chain dependent tasks**: If task B needs task A's output, run sequentially
- **Spawn too many agents**: 2-4 parallel is usually optimal
- **Expect perfection**: Agents may miss things or make mistakes
- **Ignore context**: Agents work best with clear context

### Model Selection

- **haiku**: Fast, cheap - good for simple tasks, documentation
- **sonnet**: Balanced - good for most tasks, code review
- **opus**: Most capable - complex analysis, architecture decisions

---

## Checkpoint: Verify Your Progress

Ensure you have:

- [ ] Created `.claude/agents/` directory
- [ ] Created at least 2 custom agents
- [ ] Run the Explore agent successfully
- [ ] Run the Plan agent successfully
- [ ] Tested running agents in parallel
- [ ] Understand when to use each agent type

Your agents directory should look like:

```
.claude/
├── commands/
├── skills/
└── agents/
    ├── code-reviewer.md
    ├── test-generator.md
    ├── doc-generator.md
    └── migration-planner.md
```

---

## Key Takeaways

1. **Agents are autonomous workers** - They complete tasks independently
2. **Parallel execution is powerful** - Multiple agents can work simultaneously
3. **Right tool for the job** - Match agent type to your task
4. **Custom agents specialize** - Create agents for your specific workflows

---

## Practical Exercise

Create an agent for your workflow:

1. **Performance Agent**: Analyzes code for performance issues
2. **Security Agent**: Scans for security vulnerabilities
3. **Dependency Agent**: Checks for outdated/vulnerable dependencies
4. **Accessibility Agent**: Reviews UI code for a11y issues

Test your agent on the workshop codebase.

---

## Next Steps

In the final workshop, we'll combine everything: commands, skills, and agents into powerful automated workflows.

Continue to: [06_advanced_workflows.md](./06_advanced_workflows.md)
