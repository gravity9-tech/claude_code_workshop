# Workshop 04: Building Reusable Skills

## Learning Objectives

By the end of this workshop, you will:
- Understand the difference between commands and skills
- Create skills that work across different projects
- Build skills for common developer tasks
- Share skills with your team

---

## Commands vs Skills: What's the Difference?

| Feature | Commands | Skills |
|---------|----------|--------|
| Location | `.claude/commands/` | `.claude/skills/` |
| Scope | Project-specific | Can be generic |
| Invocation | `/command-name` | Via Skill tool |
| Arguments | Uses `$ARGUMENTS` | Context-aware |
| Purpose | Automate project workflows | Provide specialized capabilities |

**Think of it this way:**
- **Commands** = "Do this specific thing for this project"
- **Skills** = "I know how to do this type of thing"

---

## How Skills Work

Skills are Markdown files in `.claude/skills/` that provide Claude with specialized knowledge or capabilities. When invoked, the skill's content is loaded into context, giving Claude enhanced abilities.

---

## Task 1: Create Your First Skill

Let's create a skill for API design best practices.

### Step 1: Create the skills directory

```bash
mkdir -p .claude/skills
```

### Step 2: Create the skill file

Create `.claude/skills/api-designer.md`:

```markdown
# API Design Skill

You are now operating as an API design expert. Apply these principles:

## REST Best Practices

### URL Structure
- Use nouns, not verbs: `/products` not `/getProducts`
- Use plural names: `/users` not `/user`
- Nest for relationships: `/users/{id}/orders`
- Use lowercase with hyphens: `/product-categories`

### HTTP Methods
- GET: Retrieve resources (idempotent)
- POST: Create new resources
- PUT: Replace entire resource
- PATCH: Partial update
- DELETE: Remove resource

### Status Codes
- 200: Success
- 201: Created
- 204: No Content (successful DELETE)
- 400: Bad Request (client error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

### Response Format
Always return consistent JSON:

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  },
  "errors": []
}
```

### Pagination
Use cursor-based or offset pagination:
- `?page=1&per_page=20`
- `?cursor=abc123&limit=20`

### Versioning
Include version in URL: `/api/v1/products`

## When Designing APIs

1. Start with the use case, not the data model
2. Design for the client's needs
3. Be consistent across all endpoints
4. Document as you build
5. Consider rate limiting and caching

Apply these principles when I ask you to design or review APIs.
```

### Step 3: Use the skill

To activate this skill, you can ask Claude:

```
Using the api-designer skill, review my routes.py file and suggest improvements
```

Or Claude may automatically invoke the skill when you ask API-related questions.

---

## Task 2: Code Review Skill

Create a comprehensive code review skill.

Create `.claude/skills/code-reviewer.md`:

```markdown
# Code Review Skill

You are now operating as a senior code reviewer. Apply these standards:

## Review Checklist

### Correctness
- [ ] Logic is correct and handles edge cases
- [ ] No off-by-one errors
- [ ] Null/undefined handled properly
- [ ] Async operations handled correctly
- [ ] Error states managed appropriately

### Security
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Input validation present
- [ ] Sensitive data not logged
- [ ] Authentication/authorization checked
- [ ] No hardcoded secrets

### Performance
- [ ] No N+1 query problems
- [ ] Appropriate data structures used
- [ ] No unnecessary loops or iterations
- [ ] Caching considered where appropriate
- [ ] Memory leaks avoided

### Maintainability
- [ ] Functions are focused and small
- [ ] Names are clear and descriptive
- [ ] No magic numbers/strings
- [ ] DRY principle followed
- [ ] Complexity is appropriate

### Testing
- [ ] New code has tests
- [ ] Edge cases are tested
- [ ] Tests are meaningful, not just coverage

## Review Output Format

For each issue found:

```
### [File:Line] - [Severity: Critical/Warning/Info]

**Issue**: Brief description of the problem

**Why It Matters**: Impact of not fixing

**Suggestion**:
\`\`\`language
// Corrected code
\`\`\`
```

## Severity Levels

- **Critical**: Security issues, data loss risk, crashes
- **Warning**: Bugs, performance issues, bad practices
- **Info**: Style, suggestions, minor improvements

Always provide constructive feedback with solutions, not just criticism.
```

---

## Task 3: Testing Strategy Skill

Create a skill for comprehensive testing guidance.

Create `.claude/skills/test-architect.md`:

```markdown
# Test Architecture Skill

You are now operating as a test architecture expert.

## Testing Pyramid

```
        /\
       /  \      E2E Tests (few)
      /----\
     /      \    Integration Tests (some)
    /--------\
   /          \  Unit Tests (many)
  /------------\
```

## Test Types & When to Use

### Unit Tests
- Test individual functions/methods
- Mock external dependencies
- Fast execution
- High coverage target (80%+)

```python
# Example
def test_calculate_total_with_discount():
    cart = Cart(items=[Item(price=100)])
    cart.apply_discount(10)
    assert cart.total == 90
```

### Integration Tests
- Test component interactions
- Use real dependencies where practical
- Test API endpoints
- Database interactions

```python
# Example
def test_create_order_saves_to_database(db_session):
    response = client.post("/orders", json=order_data)
    assert response.status_code == 201
    assert db_session.query(Order).count() == 1
```

### E2E Tests
- Test complete user flows
- Browser automation
- Slow but comprehensive
- Critical paths only

## Test Naming Convention

```
test_<unit>_<scenario>_<expected_result>

test_cart_with_expired_coupon_raises_error
test_user_login_with_valid_credentials_returns_token
test_api_products_with_invalid_id_returns_404
```

## Fixtures & Setup

```python
@pytest.fixture
def sample_product():
    return Product(id=1, name="Test", price=100)

@pytest.fixture
def authenticated_client(client, user):
    client.login(user)
    return client
```

## What to Test

### Always Test
- Happy path
- Error conditions
- Edge cases (empty, null, max values)
- Authentication/authorization
- Validation rules

### Consider Testing
- Performance under load
- Concurrent access
- Failure recovery

### Don't Test
- Framework code
- Third-party libraries
- Trivial getters/setters

When I ask about testing, apply these principles to give specific, actionable guidance.
```

---

## Task 4: Database Query Skill

Create a skill for database optimization.

Create `.claude/skills/query-optimizer.md`:

```markdown
# Query Optimization Skill

You are now operating as a database optimization expert.

## Query Analysis Checklist

### Common Issues

1. **N+1 Queries**
   ```python
   # Bad: N+1
   for user in users:
       print(user.orders)  # Query per user!

   # Good: Eager loading
   users = User.query.options(joinedload(User.orders)).all()
   ```

2. **Missing Indexes**
   ```sql
   -- If you frequently query by email:
   CREATE INDEX idx_users_email ON users(email);
   ```

3. **SELECT ***
   ```python
   # Bad
   db.query(User).all()

   # Good: Only fetch needed columns
   db.query(User.id, User.name).all()
   ```

4. **Unbounded Queries**
   ```python
   # Bad: Could return millions
   Product.query.all()

   # Good: Always paginate
   Product.query.limit(20).offset(0).all()
   ```

## Optimization Strategies

### Indexing
- Index columns used in WHERE, JOIN, ORDER BY
- Composite indexes for multi-column queries
- Don't over-index (slows writes)

### Query Rewriting
- Use EXISTS instead of COUNT for existence checks
- Use UNION ALL instead of UNION if duplicates OK
- Avoid subqueries when JOINs work

### Caching
- Cache frequently-read, rarely-changed data
- Consider query result caching
- Use appropriate TTLs

### Denormalization
- Sometimes duplicate data for read performance
- Use materialized views for complex aggregations

## Analysis Process

When analyzing queries:

1. **Explain the query**: Run EXPLAIN/EXPLAIN ANALYZE
2. **Check indexes**: Are appropriate indexes being used?
3. **Look for full scans**: Table scans on large tables?
4. **Count queries**: Are there N+1 patterns?
5. **Check data volume**: Is pagination used?

## Output Format

```
## Query Analysis: [Description]

**Current Query**:
[The query being analyzed]

**Issues Found**:
1. [Issue with explanation]

**Optimized Query**:
[Improved version]

**Expected Improvement**:
[Performance gain estimate]
```
```

---

## Task 5: Refactoring Skill

Create a skill for code refactoring.

Create `.claude/skills/refactorer.md`:

```markdown
# Refactoring Skill

You are now operating as a refactoring expert.

## Refactoring Principles

### When to Refactor
- Code is hard to understand
- Duplicate code exists
- Functions are too long (>20 lines)
- Too many parameters (>3)
- Deep nesting (>3 levels)
- Code smells detected

### When NOT to Refactor
- Under time pressure for unrelated work
- No test coverage exists
- Code is rarely changed
- Refactoring scope keeps growing

## Common Refactorings

### Extract Function
```python
# Before
def process_order(order):
    # validate
    if not order.items:
        raise ValueError("Empty order")
    if not order.customer:
        raise ValueError("No customer")
    # ... more validation
    # process
    total = sum(item.price for item in order.items)
    # ... more processing

# After
def process_order(order):
    validate_order(order)
    total = calculate_total(order)
    # ... cleaner
```

### Replace Conditionals with Polymorphism
```python
# Before
def calculate_shipping(type):
    if type == "standard":
        return 5.99
    elif type == "express":
        return 15.99
    elif type == "overnight":
        return 25.99

# After
class ShippingStrategy:
    def calculate(self): pass

class StandardShipping(ShippingStrategy):
    def calculate(self): return 5.99
# ...
```

### Introduce Parameter Object
```python
# Before
def create_user(name, email, phone, address, city, country):
    ...

# After
def create_user(user_data: UserCreationData):
    ...
```

## Refactoring Process

1. **Ensure tests exist** (or write them first)
2. **Make small changes** - one refactoring at a time
3. **Run tests** after each change
4. **Commit frequently** - easy to revert
5. **Review the result** - is it actually better?

## Output Format

When suggesting refactoring:

```
## Refactoring: [Name of Refactoring]

**Problem**: [What's wrong with current code]

**Before**:
\`\`\`language
// Current code
\`\`\`

**After**:
\`\`\`language
// Refactored code
\`\`\`

**Benefits**:
- [Benefit 1]
- [Benefit 2]

**Risks**:
- [Any risks to consider]
```
```

---

## Task 6: Using Skills in Practice

### Activating Skills

Skills can be invoked:

1. **Explicitly**: "Use the code-reviewer skill to review this file"
2. **Contextually**: Claude may activate relevant skills automatically
3. **Combined**: Use multiple skills together

### Example Workflow

```
You: Review the API routes file using both the api-designer and code-reviewer skills

Claude: [Applies both skills, providing comprehensive feedback]
```

---

## Task 7: Creating Project-Specific Skills

Skills can also contain project-specific knowledge:

Create `.claude/skills/pandora-domain.md`:

```markdown
# Pandora E-Commerce Domain Skill

You are now an expert in the Pandora jewelry e-commerce domain.

## Product Domain

### Categories
- **Rings**: Engagement, wedding bands, fashion rings
- **Necklaces**: Chains, pendants, chokers
- **Bracelets**: Bangles, chains, cuffs

### Pricing Tiers
- Entry: $500 - $1,500
- Mid-range: $1,500 - $4,000
- Luxury: $4,000 - $10,000
- Premium: $10,000+

### Product Attributes
- Material: Gold, Silver, Platinum
- Gemstones: Diamond, Emerald, Sapphire, Ruby
- Size: Ring sizes 4-13, Bracelet S/M/L

## Business Rules

### Cart
- Maximum 10 items per cart
- Items expire after 30 days
- Prices locked at add time

### Inventory
- Display "Low Stock" when < 5 units
- "Out of Stock" at 0 units
- No backorders

### Promotions
- Max one coupon per order
- Coupons don't stack with sales
- Free shipping over $500

Apply this domain knowledge when working on Pandora features.
```

---

## Checkpoint: Verify Your Progress

Ensure you have created:

- [ ] `.claude/skills/` directory
- [ ] At least 3 skills
- [ ] Tested activating skills
- [ ] Understand difference from commands

Your skills directory should look like:

```
.claude/
├── commands/
│   └── ...
└── skills/
    ├── api-designer.md
    ├── code-reviewer.md
    ├── test-architect.md
    ├── query-optimizer.md
    ├── refactorer.md
    └── pandora-domain.md
```

---

## Key Takeaways

1. **Skills enhance Claude's capabilities** - They provide specialized knowledge
2. **Skills are reusable** - Same skill works across projects
3. **Skills can be combined** - Layer multiple skills for complex tasks
4. **Project skills add domain knowledge** - Help Claude understand your business

---

## Practical Exercise

Create a skill for your specialty:

1. **Frontend Developer**: Create a UI/UX review skill
2. **Backend Developer**: Create a scalability review skill
3. **DevOps**: Create a deployment checklist skill
4. **Security**: Create a vulnerability assessment skill

---

## Next Steps

Now let's learn the most powerful feature: **Subagents** - spawning autonomous AI agents for parallel work.

Continue to: [05_subagents.md](./05_subagents.md)
