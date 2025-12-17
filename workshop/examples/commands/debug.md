Help debug the issue described: $ARGUMENTS

Follow this debugging process:

1. **Understand the Problem**
   - What is the expected behavior?
   - What is the actual behavior?
   - When did it start happening?

2. **Gather Information**
   - Check relevant log files
   - Look at recent changes: `git log --oneline -10`
   - Check if tests pass: `pytest tests/ -v`

3. **Identify Root Cause**
   - Search for related code
   - Check for common issues:
     - Import errors
     - Type mismatches
     - Missing dependencies
     - Configuration issues

4. **Propose Solutions**
   - List possible fixes
   - Recommend the best approach
   - Explain trade-offs

If $ARGUMENTS is empty, ask me to describe the issue.
