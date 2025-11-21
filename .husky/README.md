# Husky Git Hooks

This directory contains Git hooks managed by Husky to ensure code quality.

## Available Hooks

### pre-commit
Runs before each commit to:
- Execute all React component tests
- Verify code passes all test suites
- Prevent commits if tests fail

## Setup

To enable Husky hooks after cloning the repository:

```bash
# For React components
cd gpts/AI-SaaS-Builder
npm install
npx husky install
```

## Bypassing Hooks

In rare cases where you need to bypass the pre-commit hook:

```bash
git commit --no-verify -m "your message"
```

**Note:** Use this sparingly and only when absolutely necessary!

## Customization

To modify the pre-commit hook behavior, edit `.husky/pre-commit`.

## PowerShell Tests

PowerShell tests are not run in pre-commit hooks due to cross-platform compatibility.
They are automatically run in CI/CD on Windows runners.
