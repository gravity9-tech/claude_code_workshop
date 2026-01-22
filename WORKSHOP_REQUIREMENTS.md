# Workshop Requirements

Complete these setup steps **before** the workshop to ensure you're ready to participate without delays.

## Required Software

| Software | Minimum Version | Verification Command |
|----------|-----------------|---------------------|
| Python | 3.12+ | `python3 --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | Any recent | `git --version` |
| Make | Any | `make --version` |
| Claude Code | 2.1+ | `claude --version` |

## Setup Checklist

### 1. Python 3.12+

- **macOS**: `brew install python@3.12`
- **Windows**: Download from [python.org](https://www.python.org/downloads/) or `choco install python --version=3.12`
- **Linux**: `sudo apt install python3.12` (Ubuntu/Debian) or equivalent

### 2. Node.js 18+

- **All platforms**: Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- **macOS**: `brew install node`
- **Windows**: `choco install nodejs-lts`

### 3. Git

- **macOS**: Pre-installed or `brew install git`
- **Windows**: Download from [git-scm.com](https://git-scm.com/)
- **Linux**: `sudo apt install git`

### 4. Make

- **macOS**: Pre-installed with Xcode Command Line Tools (`xcode-select --install`)
- **Windows**: `choco install make` or use WSL2
- **Linux**: `sudo apt install build-essential`

### 5. Claude Code 2.1+

Install Claude Code CLI:

```bash
npm install -g @anthropic-ai/claude-code
```

Verify installation:

```bash
claude --version
# Should show 2.1.x or higher
```

If you have an older version, update with:

```bash
npm update -g @anthropic-ai/claude-code
```

### 6. JIRA Account Setup (Required)

You will need a JIRA account with API access for the workshop exercises.

#### Create a Free JIRA Account

1. Go to [https://www.atlassian.com/software/jira/free](https://www.atlassian.com/software/jira/free)
2. Click "Get it free" and create an account
3. Create a new project (any template works - Kanban recommended)
4. Note your JIRA instance URL (e.g., `https://your-name.atlassian.net`)

#### Generate an API Token

1. Go to [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "Workshop Token")
4. Copy and save the token securely - you won't be able to see it again

#### Information You'll Need During the Workshop

Have these ready:

- **JIRA Instance URL**: `https://your-name.atlassian.net`
- **Email**: The email you used to create the account
- **API Token**: The token you generated above
- **Project Key**: The short code for your project (e.g., "DEMO", "TEST")

## Optional (Recommended)

- **VS Code** with extensions:
  - Python
  - Angular Language Service
  - Tailwind CSS IntelliSense
- **Chrome or Chromium** browser (for Angular testing)

## Verify Your Setup

Run all verification commands:

```bash
python3 --version    # 3.12.x or higher
node --version       # v18.x or higher
npm --version        # 9.x or higher
git --version        # Any version
make --version       # Any version
claude --version     # 2.1.x or higher
```

## Quick Test

Clone the repository and verify everything works:

```bash
git clone https://github.com/gravity9-tech/claude_code_workshop
cd claude_code_workshop
make install         # Should complete without errors
make dev             # Should start both servers
```

Visit http://localhost:4321 - you should see the Tea Store application.

## Troubleshooting

### Python version issues
If `python3` points to an older version, you may need to use `python3.12` explicitly or update your PATH.

### Permission errors on npm global install
Use `sudo npm install -g` or configure npm to use a different directory for global packages.

### Make not found on Windows
Consider using WSL2 (Windows Subsystem for Linux) for the best experience, or install Make via Chocolatey.

### Claude Code authentication
Run `claude` and follow the prompts to authenticate before the workshop.

---

**Questions?** Contact the workshop organizer before the session.
