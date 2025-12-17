---
description: Run E2E tests using Playwright MCP
argument-hint: [test scenario]
---

Run end-to-end tests on http://localhost:8000 using Playwright MCP.

Test scenario: $ARGUMENTS

If no scenario specified, run these default tests:
1. Navigate to homepage and verify it loads
2. Test category filtering (click each category, verify products filter)
3. Test add to cart functionality
4. Test cart total calculation
5. Take screenshots of key pages

For each test:
- Describe what you're testing
- Perform the action
- Verify the expected result
- Report pass/fail

Summarize results at the end.
