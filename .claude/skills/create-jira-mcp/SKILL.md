---
name: create-jira-mcp
description: Sets up Jira MCP server integration for Claude Code. Use when setting up Jira, connecting to Atlassian, configuring MCP for ticket management, or adding Jira capabilities.
allowed-tools: Bash, Read, Write, AskUserQuestion, Glob
---

# Create Jira MCP Integration

## Purpose

Guide users through setting up a Jira MCP server to enable Claude Code to interact with Jira for ticket management.

## Instructions

### 1. Check Prerequisites

Verify Node.js is installed (v18+ required):
```bash
node --version
```

### 2. Check Existing Configuration

First, check if Jira credentials exist in the project's root `.env` file:

```bash
[ -f ".env" ] && echo "Root .env file exists" || echo "Root .env file not found"
```

If it exists, verify the required Jira variables are configured (without exposing values):
```bash
grep -q "JIRA_HOST=" .env && echo "JIRA_HOST is set" || echo "JIRA_HOST is not set"
grep -q "JIRA_EMAIL=" .env && echo "JIRA_EMAIL is set" || echo "JIRA_EMAIL is not set"
grep -q "JIRA_API_TOKEN=" .env && echo "JIRA_API_TOKEN is set" || echo "JIRA_API_TOKEN is not set"
```

**Important**: Never echo the actual values. Only check if they exist.

If all three variables are configured in the root `.env`, skip to Step 4 (Create Local MCP Server Installation). The wrapper script will read directly from the root `.env` file.

### 3. Gather Jira Credentials (if not already set)

If credentials are missing from the root `.env` file, ask the user to add them. The required variables are:
- **JIRA_HOST**: Their Atlassian domain with https:// prefix (e.g., `https://your-domain.atlassian.net`)
- **JIRA_EMAIL**: Their Atlassian account email
- **JIRA_API_TOKEN**: Generated from https://id.atlassian.net/manage-profile/security/api-tokens
```

**Important**: Ensure `.env` is in `.gitignore` to avoid committing credentials.

### 4. Create Local MCP Server Installation

Create the MCP servers directory and install dependencies (including dotenv for `.env` support).

**Important**: Use a subshell to avoid changing the working directory, which would cause subsequent commands to run in the wrong location:

```bash
mkdir -p .mcp-servers/jira
(cd .mcp-servers/jira && npm init -y && npm install mcp-atlassian jsdom dotenv)
```

Add `.mcp-servers/` to `.gitignore` if not already present.

### 5. Create Wrapper Script

Create a wrapper script that loads credentials from the root `.env` file and starts the MCP server:

```bash
cat > .mcp-servers/jira/start.js << 'EOF'
const path = require('path');
const fs = require('fs');

// Load .env file with override to ensure fresh values
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath, override: true });
}

// Map JIRA_* variables to ATLASSIAN_* variables expected by mcp-atlassian
process.env.ATLASSIAN_BASE_URL = process.env.JIRA_HOST || process.env.ATLASSIAN_BASE_URL;
process.env.ATLASSIAN_EMAIL = process.env.JIRA_EMAIL || process.env.ATLASSIAN_EMAIL;
process.env.ATLASSIAN_API_TOKEN = process.env.JIRA_API_TOKEN || process.env.ATLASSIAN_API_TOKEN;

// Validate required variables before starting
const missing = [];
if (!process.env.ATLASSIAN_BASE_URL) missing.push('JIRA_HOST or ATLASSIAN_BASE_URL');
if (!process.env.ATLASSIAN_EMAIL) missing.push('JIRA_EMAIL or ATLASSIAN_EMAIL');
if (!process.env.ATLASSIAN_API_TOKEN) missing.push('JIRA_API_TOKEN or ATLASSIAN_API_TOKEN');

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  console.error('Please set these in your .env file at:', envPath);
  process.exit(1);
}

require('mcp-atlassian/dist/index.js');
EOF
```

This reads credentials from the project's root `.env` file, keeping all environment variables in one place.

### 6. Register the MCP Server

Add the Jira MCP server to Claude Code using the wrapper script:

```bash
claude mcp add-json jira '{
    "type": "stdio",
    "command": "node",
    "args": [".mcp-servers/jira/start.js"]
}' -s project
```

### 7. Display Restart Notice

**IMPORTANT**: After completing all setup steps, you MUST display this notice to the user:

```
================================================
  RESTART REQUIRED
================================================
  The Jira MCP server has been configured.

  Please restart Claude Code for the MCP
  server to be registered and available.

  After restarting:
  1. Run /mcp to verify the server is connected
  2. Test with: "List all Jira projects"
================================================
```

This notice is critical because MCP servers are only loaded when Claude Code starts.

## Output Format

Provide step-by-step guidance with commands the user can copy and run. After each step, confirm success before proceeding.

**Always end with the restart notice** - this is mandatory to ensure users know to restart Claude Code.

## Troubleshooting

**Authentication failed:**
- Verify JIRA_HOST in root `.env` includes `https://` (e.g., `https://your-domain.atlassian.net`)
- Check JIRA_EMAIL matches the Atlassian account email
- Regenerate the API token if unsure

**Node.js issues:**
- Ensure Node.js v18+ is installed
- Run `node --version` to verify

**MCP not connecting:**
- Restart Claude Code after adding the server
- Check `/mcp` shows the jira server as connected
- Verify `.mcp.json` exists in the project root (not in a subdirectory)
- Verify credentials exist in root `.env`: `grep JIRA_ .env`
- Test the wrapper script manually: `node .mcp-servers/jira/start.js`

## Best Practices

- Never commit API tokens to version control
- Keep `.env` in `.gitignore` to protect credentials
- Keep `.mcp-servers/` in `.gitignore` as well
- Always mark credential checks as sensitive output to avoid exposing values in logs
- Create a dedicated Jira service account for team use
- Test with read-only operations first (list projects, search issues)

## Example

**User**: "Set up Jira MCP for my project"

**Response**:
1. Verify Node.js v18+ is installed
2. Check if root `.env` exists with Jira credentials (JIRA_HOST, JIRA_EMAIL, JIRA_API_TOKEN)
3. If credentials are missing, ask user to add them to root `.env`
4. Run installation commands (including dotenv)
5. Create wrapper script (`start.js`) that reads from root `.env`
6. Register the MCP server
7. Display the RESTART REQUIRED notice prominently
