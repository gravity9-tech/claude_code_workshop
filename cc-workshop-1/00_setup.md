# Workshop 00: Project Setup

**Duration: ~5 minutes**

## What You'll Do

- Create a workshop directory
- Clone the workshop repository
- Open the project in your editor

---

## Prerequisites

Before starting, ensure you have:

- **Git** installed
- **Node.js** (v18+) for MCP servers
- **Claude Code** installed:
  ```bash
  npm install -g @anthropic-ai/claude-code
  ```
- A code editor (VS Code, Cursor, Vim, etc.)

---

## Step 1: Create a Workshop Directory

Create a dedicated folder for the workshop on your Desktop:

```bash
# Navigate to Desktop
cd ~/Desktop

# Create workshop directory
mkdir g9-workshop

# Enter the directory
cd g9-workshop
```

---

## Step 2: Clone the Workshop Repository

Clone the project from GitHub:

```bash
git clone https://github.com/gravity9-tech/claude_code_workshop.git
```

This creates a `claude_code_workshop` folder containing all workshop materials.

---

## Step 3: Enter the Project

```bash
cd claude_code_workshop
```
---

## Step 4: Open in Your Editor

**VS Code:**
```bash
code .
```

**Cursor:**
```bash
cursor .
```

**Other editors:**
```bash
# Sublime Text
subl .

# Vim/Neovim
nvim .

# Or open manually via your editor's File > Open Folder
```

---

## Step 5: Verify Claude Code Installation

Test that Claude Code is installed:

```bash
claude --version
```

You should see version output like `claude 1.x.x`.

---

## Checkpoint

Before continuing, verify:

- [ ] Workshop directory created (`~/Desktop/g9-workshop/`)
- [ ] Repository cloned successfully
- [ ] Project opened in your editor
- [ ] `claude --version` works

---

## Next Up

Continue to: [01_context_window.md](./01_context_window.md) - Understanding the Context Window
