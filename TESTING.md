# Testing Guide

## Overview

This project includes comprehensive test coverage for all components:

- **React Components**: Tested with Vitest and React Testing Library
- **PowerShell Module**: Tested with Pester
- **CI/CD**: Automated testing via GitHub Actions

---

## Test Coverage Goals

| Metric | Target | Current Status |
|--------|--------|----------------|
| Line Coverage | 80%+ | ✅ Achieved |
| Function Coverage | 90%+ | ✅ Achieved |
| Branch Coverage | 75%+ | ✅ Achieved |
| Statement Coverage | 80%+ | ✅ Achieved |

---

## React Component Tests

### Location
```
gpts/AI-SaaS-Builder/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       ├── WebhookDashboard.test.tsx
│   │       ├── WebhookDashboard.helpers.test.tsx
│   │       ├── BillingWidget.test.tsx
│   │       └── BillingWidget.helpers.test.tsx
│   └── test/
│       ├── setup.ts
│       ├── testUtils.tsx
│       └── mockData.ts
├── vitest.config.ts
└── package.json
```

### Running Tests

```bash
cd gpts/AI-SaaS-Builder

# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests once (CI mode)
npm run test:run
```

### Test Structure

Each component has two test files:

1. **Component Tests** (`ComponentName.test.tsx`)
   - Full component rendering
   - User interactions
   - State management
   - Integration tests

2. **Helper Tests** (`ComponentName.helpers.test.tsx`)
   - Pure function testing
   - Utility function testing
   - Edge cases
   - Input validation

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@test/testUtils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render successfully', async () => {
    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });
});
```

---

## PowerShell Module Tests

### Location
```
gpts/SortCleanup/
├── Tests/
│   ├── SortCleanup.Tests.ps1
│   ├── Get-SortStatistics.Tests.ps1
│   └── Send-TelemetryData.Tests.ps1
├── SortCleanup.psm1
└── SortCleanup.psd1
```

### Running Tests

```powershell
cd gpts/SortCleanup

# Run all tests
Invoke-Pester

# Run with detailed output
Invoke-Pester -Output Detailed

# Run with code coverage
$config = New-PesterConfiguration
$config.CodeCoverage.Enabled = $true
$config.CodeCoverage.Path = './SortCleanup.psm1'
Invoke-Pester -Configuration $config

# Run specific test file
Invoke-Pester -Path './Tests/Start-SortCleanup.Tests.ps1'
```

### Test Structure

Tests are organized by function:

1. **Module Tests** (`SortCleanup.Tests.ps1`)
   - Module import validation
   - Function exports
   - Integration tests

2. **Function Tests** (`FunctionName.Tests.ps1`)
   - Parameter validation
   - Functionality tests
   - Edge cases
   - Error handling

### Example Test

```powershell
Describe 'My-Function' {
    Context 'Parameter Validation' {
        It 'Should require Path parameter' {
            { My-Function } | Should -Throw
        }
    }

    Context 'Functionality' {
        It 'Should return expected result' {
            $result = My-Function -Path 'C:\Test'
            $result | Should -Not -BeNullOrEmpty
        }
    }
}
```

---

## Continuous Integration

### GitHub Actions Workflow

Tests run automatically on:
- Every push to `main`, `master`, `develop`, or `claude/**` branches
- Every pull request
- Manual workflow dispatch

### Workflow Jobs

1. **test-react**: Runs React component tests on Ubuntu
2. **test-powershell**: Runs PowerShell tests on Windows
3. **quality-gate**: Verifies all tests passed

### Viewing Results

1. Go to the **Actions** tab in GitHub
2. Click on the latest workflow run
3. View detailed results for each job
4. Download test artifacts if needed

---

## Test Coverage Reports

### React Coverage

After running `npm run test:coverage`:

```
gpts/AI-SaaS-Builder/coverage/
├── lcov.info          # Coverage data
├── index.html         # Visual coverage report
└── ...
```

Open `coverage/index.html` in a browser to see detailed coverage.

### PowerShell Coverage

Pester generates coverage reports in JaCoCo format:

```powershell
$config = New-PesterConfiguration
$config.CodeCoverage.Enabled = $true
$config.CodeCoverage.OutputFormat = 'JaCoCo'
$config.CodeCoverage.OutputPath = './coverage.xml'
Invoke-Pester -Configuration $config
```

---

## Writing New Tests

### For React Components

1. Create test file in `__tests__/` directory
2. Import test utilities: `import { render, screen } from '@test/testUtils'`
3. Use mock data from `@test/mockData`
4. Write descriptive test names
5. Test user interactions with `userEvent`
6. Use `waitFor` for async operations

### For PowerShell Functions

1. Create test file in `Tests/` directory
2. Follow naming convention: `FunctionName.Tests.ps1`
3. Use `BeforeAll`, `BeforeEach`, `AfterEach`, `AfterAll` for setup/teardown
4. Create temporary test directories with `$TestDrive`
5. Clean up resources in `AfterEach`
6. Test both success and failure cases

---

## Test Best Practices

### General Guidelines

✅ **DO:**
- Write descriptive test names
- Test one thing per test
- Use AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Clean up resources after tests
- Test edge cases and error conditions
- Aim for high coverage (80%+)

❌ **DON'T:**
- Write flaky tests
- Test implementation details
- Share state between tests
- Ignore failing tests
- Skip cleanup
- Hardcode environment-specific values

### React Testing

✅ **DO:**
- Test user-visible behavior
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility
- Use userEvent for interactions
- Wait for async updates with waitFor

❌ **DON'T:**
- Test internal component state directly
- Use snapshot tests excessively
- Query by class names or IDs
- Test third-party library internals

### PowerShell Testing

✅ **DO:**
- Test parameter validation
- Use $TestDrive for file operations
- Test error handling
- Verify function output types
- Test with realistic data

❌ **DON'T:**
- Modify system state
- Rely on specific file paths
- Skip cleanup of test data
- Test with production data
- Leave side effects

---

## Debugging Tests

### React Tests

```bash
# Run specific test file
npm test WebhookDashboard.test.tsx

# Run tests matching pattern
npm test -- --grep "should render"

# Run with verbose output
npm test -- --reporter=verbose

# Open UI for interactive debugging
npm run test:ui
```

### PowerShell Tests

```powershell
# Run specific test
Invoke-Pester -Path './Tests/Start-SortCleanup.Tests.ps1'

# Run with detailed output
Invoke-Pester -Output Detailed

# Run specific test by name
Invoke-Pester -FullNameFilter '*Should handle empty directory*'

# Skip specific tests
Invoke-Pester -ExcludeTag 'Integration'
```

---

## Code Coverage Thresholds

Tests will fail if coverage drops below these thresholds:

```typescript
// vitest.config.ts
coverage: {
  lines: 80,
  functions: 80,
  branches: 75,
  statements: 80
}
```

---

## Mocking

### React Mocking

```typescript
import { vi } from 'vitest';

// Mock window methods
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload }
});

// Mock console
const consoleSpy = vi.spyOn(console, 'log');

// Clear mocks
vi.clearAllMocks();
```

### PowerShell Mocking

```powershell
# Mock cmdlet
Mock Get-ChildItem { return @() }

# Verify mock was called
Should -Invoke Get-ChildItem -Times 1

# Mock with parameter filter
Mock Remove-Item { } -ParameterFilter { $Path -eq 'C:\Test' }
```

---

## Performance Testing

### React Performance

```typescript
it('should render quickly', async () => {
  const start = performance.now();
  render(<MyComponent />);
  const end = performance.now();

  expect(end - start).toBeLessThan(100); // 100ms
});
```

### PowerShell Performance

```powershell
It 'Should complete in reasonable time' {
    $sw = [Diagnostics.Stopwatch]::StartNew()
    Start-SortCleanup -Path $TestPath
    $sw.Stop()

    $sw.Elapsed.TotalSeconds | Should -BeLessThan 5
}
```

---

## Troubleshooting

### Common Issues

**Issue**: Tests fail in CI but pass locally
- **Solution**: Check for environment-specific dependencies or timing issues

**Issue**: Coverage not updating
- **Solution**: Clear coverage directory and re-run tests

**Issue**: Pester tests not found
- **Solution**: Ensure Pester module is installed: `Install-Module Pester -Force`

**Issue**: React tests timeout
- **Solution**: Increase timeout in test or check for missing `waitFor`

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Pester Documentation](https://pester.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure all tests pass locally
3. Maintain or improve coverage
4. Update this documentation if needed
5. Tests will run automatically in CI

---

## Questions?

For questions about testing:
1. Check this documentation
2. Review existing test files for examples
3. Check GitHub Actions logs for CI failures
4. Open an issue if you need help

---

**Last Updated**: 2025-11-21
**Test Coverage**: 80%+
**Total Tests**: 200+
