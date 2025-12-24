# Workshop 07: Hooks

**Duration: ~8 minutes**

## What You'll Learn

- What hooks are and when they trigger
- Configure hooks in settings
- Create simple automation hooks

---

## What Are Hooks?

Hooks are shell commands that run automatically when Claude Code events occur. Use them to:

- Log tool usage
- Run validation before commands
- Trigger notifications
- Enforce project rules

---

## Hook Events

| Event | When It Fires |
|-------|---------------|
| `PreToolUse` | Before a tool runs |
| `PostToolUse` | After a tool completes |
| `Notification` | When Claude sends a notification |
| `Stop` | When Claude stops working |

---

## Configuration

Hooks live in settings files:

- **Project:** `.claude/settings.json`
- **User:** `~/.claude/settings.json`

### Basic Format

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Running bash command'"
          }
        ]
      }
    ]
  }
}
```

---

## Task 1: Create Settings File

```bash
mkdir -p .claude
touch .claude/settings.json
```

---

## Task 2: Log All Bash Commands

Create `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date +%H:%M:%S)] Bash command\" >> .claude/tool.log"
          }
        ]
      }
    ]
  }
}
```

**Test it:**
```bash
claude
# Ask Claude to run any bash command
# Check: cat .claude/tool.log
```

---

## Task 3: Notification Sound

Add a sound when Claude finishes a task:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

*Note: `afplay` is macOS. Use `paplay` on Linux or omit on Windows.*

---

## Matcher Patterns

| Pattern | Matches |
|---------|---------|
| `"Bash"` | Bash tool only |
| `"Read"` | Read tool only |
| `""` | All tools (empty string) |

---

## Your Structure

```
.claude/
├── commands/
├── skills/
├── agents/
└── settings.json    # Hooks config
```

---

## Checkpoint

- [ ] Created `.claude/settings.json`
- [ ] Added at least one hook
- [ ] Tested the hook fires correctly

---

## Next Up

Continue to: [08_marketplace.md](./08_marketplace.md)
