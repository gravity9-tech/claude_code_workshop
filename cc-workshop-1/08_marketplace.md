# Workshop 08: Plugin Marketplaces

**Duration: ~10 minutes**

## What You'll Learn

- Create a plugin marketplace for your team
- Install plugins from marketplaces
- Configure team-wide marketplace settings

---

## What is a Plugin Marketplace?

A marketplace is a **catalog for distributing Claude Code extensions**:

| Feature | Benefit |
|---------|---------|
| Centralized discovery | Team finds all tools in one place |
| Version tracking | Know what version everyone is using |
| Automatic updates | Keep plugins current |
| Multiple sources | Git repos, local paths, GitHub |

---

## Task 1: Install the Plugin Development Tools

First, install the official plugin-dev toolkit:

```bash
# In Claude Code
/plugin install anthropics/claude-code:plugin-dev
```

This gives you access to:
- `/plugin-dev:create-plugin` - 8-phase guided workflow
- Plugin validator agent
- Skills for hooks, MCP, commands, and more

---

## Task 2: Create a Plugin (Automated)

Use the guided workflow to scaffold a new plugin:

```bash
# In Claude Code
/plugin-dev:create-plugin
```

This walks you through an **8-phase process**:
1. Gather requirements (name, type, author)
2. Generate directory structure
3. Create `plugin.json` manifest
4. Add component templates (commands, agents, etc.)
5. Generate README and LICENSE
6. Validate structure
7. Test locally
8. Provide next steps

**Result:** A complete, production-ready plugin structure.

---

## Task 3: Test Your Plugin Locally

```bash
# Run Claude Code with your plugin loaded
claude --plugin-dir ./my-plugin

# Or validate the structure
/plugin validate ./my-plugin
```

---

## Understanding the Generated Structure

The automated process creates:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── commands/
│   └── my-command.md         # Slash commands
├── README.md
└── LICENSE
```

### Plugin Manifest (`plugin.json`)

```json
{
  "name": "my-plugin",
  "description": "Description of your plugin",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  },
  "commands": ["./commands/"],
  "keywords": ["your", "keywords"]
}
```

---

## Task 4: Create a Marketplace

A marketplace is a collection of plugins. Create `marketplace.json`:

```json
{
  "name": "my-team-plugins",
  "owner": {
    "name": "Your Team",
    "email": "[email protected]"
  },
  "metadata": {
    "description": "Internal tools for our development team",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "code-review",
      "source": "./plugins/code-review",
      "description": "Adds /review command for code reviews",
      "version": "1.0.0"
    }
  ]
}
```

### Directory Structure

```
my-team-marketplace/
├── .claude-plugin/
│   └── marketplace.json      # Marketplace manifest
└── plugins/
    ├── code-review/          # Plugin 1
    ├── deploy-helper/        # Plugin 2
    └── ...
```

### Plugin Sources

Plugins can come from different sources:

**Local (in same repo):**
```json
{ "source": "./plugins/my-plugin" }
```

**GitHub:**
```json
{ "source": { "source": "github", "repo": "owner/repo" } }
```

**Any Git URL:**
```json
{ "source": { "source": "url", "url": "https://gitlab.com/team/plugin.git" } }
```

---

## Task 5: Share Your Marketplace

Push your marketplace to GitHub, then team members can add it:

### From GitHub (Recommended)

```bash
# In Claude Code, use the slash command:
/plugin marketplace add your-org/team-marketplace
```

### From GitLab or Other Git Host

```bash
/plugin marketplace add https://gitlab.com/company/plugins.git
```

### From Local Path (for testing)

```bash
/plugin marketplace add ./path/to/marketplace
```

---

## Task 6: Install Plugins from Marketplace

Once the marketplace is added:

```bash
# Install a specific plugin
/plugin install code-review@my-team-plugins

# Update all marketplaces
/plugin marketplace update
```

---

## Task 7: Team-Wide Configuration

### Auto-Register Marketplace for All Team Members

Add to your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

### Pre-Enable Specific Plugins

```json
{
  "extraKnownMarketplaces": {
    "team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  },
  "enabledPlugins": {
    "code-review@team-tools": true,
    "deploy-helper@team-tools": true
  }
}
```

Now when team members clone the project, the marketplace and plugins are pre-configured.

---

## Advanced: Full Plugin Example

A plugin can include commands, agents, hooks, and MCP servers:

```json
{
  "name": "enterprise-tools",
  "description": "Enterprise workflow automation",
  "version": "2.0.0",
  "author": {
    "name": "Platform Team",
    "email": "[email protected]"
  },
  "homepage": "https://docs.company.com/claude-plugins",
  "license": "MIT",
  "keywords": ["enterprise", "workflow"],
  "commands": ["./commands/"],
  "agents": ["./agents/security-reviewer.md"],
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "company-db": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server"
    }
  }
}
```

---

## Validation

Before publishing, validate your marketplace:

```bash
# From CLI
claude plugin validate .

# Or in Claude Code
/plugin validate .
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Install plugin-dev tools | `/plugin install anthropics/claude-code:plugin-dev` |
| Create new plugin | `/plugin-dev:create-plugin` |
| Test plugin locally | `claude --plugin-dir ./my-plugin` |
| Validate plugin | `/plugin validate ./my-plugin` |
| Add marketplace | `/plugin marketplace add owner/repo` |
| Install plugin | `/plugin install name@marketplace` |
| Update marketplaces | `/plugin marketplace update` |

---

## Checkpoint

- [ ] Installed plugin-dev tools
- [ ] Created a plugin using `/plugin-dev:create-plugin`
- [ ] Understand marketplace structure
- [ ] Know how to share and install from marketplaces
- [ ] Can configure team-wide settings

---

## Workshop Complete!

You've learned:
- Context window management
- Project setup with `/init`
- Custom slash commands
- Skills for expertise
- Subagents for parallel work
- MCP for external tools
- Hooks for automation
- **Plugin marketplaces for team sharing**

Go build something great!
