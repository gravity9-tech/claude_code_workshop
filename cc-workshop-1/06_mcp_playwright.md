# Workshop 05: MCP Servers & Playwright Testing

**Duration: ~12 minutes**

## What You'll Learn

- What MCP (Model Context Protocol) is
- How to add MCP servers to Claude Code
- Set up Playwright MCP for browser automation
- Test this application using Playwright MCP

---

## What is MCP?

**Model Context Protocol (MCP)** is an open standard for connecting AI tools to external services. MCP servers give Claude Code new capabilities:

- Browser automation (Playwright)
- Database access
- API integrations
- File system operations
- And much more

Think of MCP servers as **plugins** that extend what Claude can do.

---

## How MCP Works

```
┌─────────────┐     MCP Protocol     ┌─────────────────┐
│ Claude Code │ ◄──────────────────► │   MCP Server    │
└─────────────┘                      │  (Playwright)   │
                                     └────────┬────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │    Browser      │
                                     └─────────────────┘
```

MCP servers run as separate processes and communicate with Claude Code via:
- **stdio** - Local process (most common)
- **SSE** - Server-sent events
- **HTTP** - Remote servers

---

## Task 1: Check Current MCP Servers

First, see what MCP servers are available:

```bash
claude mcp list
```

This shows all configured MCP servers.

---

## Task 2: Add Playwright MCP Server

Add the Playwright MCP server to your project:

```bash
claude mcp add playwright --scope project -- npx @playwright/mcp@latest
```

**Flags explained:**
- `playwright` - Name for this server
- `--scope project` - Saves to `.mcp.json` (shared with team)
- `--` - Separates claude args from the command
- `npx @playwright/mcp@latest` - The official Microsoft Playwright MCP server

### Important: Restart Claude Code

After adding the MCP server, you need to:

1. **Start (or restart) Claude Code:**
   ```bash
   claude
   ```

2. **Accept the MCP server** when prompted. You'll see a permission prompt asking to allow the new MCP server - accept it.

3. **Verify with `/mcp`** inside Claude Code to confirm the server is connected.

### Scope Options

| Scope | Location | Use Case |
|-------|----------|----------|
| `local` | `~/.claude.json` | Personal, not shared |
| `project` | `.mcp.json` | Team-shared, version controlled |
| `user` | `~/.claude.json` | Personal, all projects |

---

## Task 3: Verify Installation

Check the server was added in the Terminal:

```bash
claude mcp list
```

You should see `playwright` in the list.

Get details:

```bash
claude mcp get playwright
```

---

## Task 4: Understanding the .mcp.json File

After adding with `--scope project`, a `.mcp.json` file is created:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

This file should be committed to version control so your team shares the same MCP setup.

---

## Task 5: Start the Application

Before testing, start the Pandora application:

**Terminal 1:**
```bash
python main.py
```

The app runs at `http://localhost:8000`

---

## Task 6: Test with Playwright MCP

**Terminal 2:** Start Claude Code:

```bash
claude
```

Check MCP status:
```
/mcp
```

Now try browser automation:

### Test 1: Basic Navigation

```
Navigate to http://localhost:8000 and describe what you see
```

### Test 2: Take a Screenshot

```
Take a screenshot of the homepage at http://localhost:8000
```

### Test 3: Test Product Filtering

```
Go to http://localhost:8000, click on the "Rings" category filter, and verify only rings are displayed
```

### Test 4: Test Shopping Cart

```
Navigate to http://localhost:8000, add the first product to the cart, and verify the cart shows 1 item
```

### Test 5: Mobile Responsiveness

```
Take a screenshot of http://localhost:8000 in mobile viewport (375px wide)
```

---

## Task 7: Create an E2E Test Command

Combine MCP with slash commands!

Create `.claude/commands/e2e-test.md`:

```markdown
---
description: Run E2E tests on the application using Playwright
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
```

**Use it:**
```
/e2e-test
/e2e-test checkout flow
```

---

## Task 8: Useful MCP Commands

```bash
# List all MCP servers
claude mcp list

# Get server details
claude mcp get playwright

# Remove a server
claude mcp remove playwright

# Check status in Claude Code
/mcp
```

---

## Playwright MCP Capabilities

The Playwright MCP provides tools for:

| Capability | Description |
|------------|-------------|
| Navigation | Visit URLs, go back/forward, reload |
| Interaction | Click, type, fill forms, submit |
| Screenshots | Capture full page or elements |
| Content | Read page text, HTML, titles |
| Viewport | Set desktop/mobile/tablet views |
| Waiting | Wait for elements or conditions |

---

## Your .mcp.json

After this workshop, your project should have:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

---

## Checkpoint

- [ ] Added Playwright MCP server
- [ ] Verified with `claude mcp list`
- [ ] Tested navigation to localhost:8000
- [ ] Took a screenshot with Playwright
- [ ] Created an e2e-test command

---

## Troubleshooting

**Server not starting:**
```bash
# Check if npx works
npx @playwright/mcp@latest --help
```

**App not running:**
```bash
# Make sure the app is started first
python main.py
```

**MCP tools not appearing:**
```
# In Claude Code, check MCP status
/mcp
```

---

## What You've Learned

1. **MCP** extends Claude Code with external capabilities
2. **Playwright MCP** enables browser automation
3. **Project scope** shares config with your team via `.mcp.json`
4. **Combine features** - Use MCP with commands for powerful workflows

---

## Next Up

Continue to: [07_hooks.md](./07_hooks.md)
