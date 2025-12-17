Run tests based on the provided scope.

Arguments provided: $ARGUMENTS

Based on the arguments:
- If empty: run all tests with `pytest tests/ -v`
- If "api": run only API tests with `pytest tests/test_api.py -v`
- If "models": run only model tests with `pytest tests/test_models.py -v`
- If a specific test name: run `pytest tests/ -v -k "$ARGUMENTS"`

Show the test output and summarize the results.
