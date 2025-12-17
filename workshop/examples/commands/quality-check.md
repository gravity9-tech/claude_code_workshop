---
description: Run linter, formatter, and tests
allowed-tools: Bash(./scripts/*), Bash(pytest:*)
---

Run a comprehensive quality check on this project:

1. Run the linter: `./scripts/lint.sh`
2. Run the formatter: `./scripts/format.sh`
3. Run all tests: `pytest tests/ -v`

Report any issues found in a clear format. If everything passes, confirm the codebase is healthy.
