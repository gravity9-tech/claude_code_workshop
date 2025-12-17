---
description: Run tests with optional scope filter
argument-hint: [scope]
allowed-tools: Bash(pytest:*)
---

Run tests based on the provided scope.

Arguments: $ARGUMENTS

- If empty: run `pytest tests/ -v`
- If "api": run `pytest tests/test_api.py -v`
- If "models": run `pytest tests/test_models.py -v`
- Otherwise: run `pytest tests/ -v -k "$ARGUMENTS"`

Summarize the results.
