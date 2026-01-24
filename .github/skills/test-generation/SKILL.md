---
name: test-generation
description: Generate robust test suites using Vitest, React Testing Library, and Playwright. Use when writing tests, improving test coverage, or creating E2E user flow tests.
---

# Test Generation Skill

Generate comprehensive test suites for the Terra Quest application.

## Philosophy

- **Behavior Driven**: Test what the user _does_, not implementation details
- **Isolation**: Unit tests mock sparingly; integration tests render the full tree
- **Coverage Target**: Aim for 80% minimum code coverage

## Tool Selection

| Scenario          | Tool                  | Import                                                    |
| ----------------- | --------------------- | --------------------------------------------------------- |
| Logic/Utils       | Vitest                | `import { describe, it, expect } from 'vitest'`           |
| Components        | React Testing Library | `import { render, screen } from '@testing-library/react'` |
| User Interactions | user-event            | `import userEvent from '@testing-library/user-event'`     |
| User Flows        | Playwright            | `import { test, expect } from '@playwright/test'`         |

## Test Structure

> [!TIP]
> Use the [test-template.tsx](./test-template.tsx) as a starting point.

```typescript
// [TestType]: [Description]
// Goal: Verify that X happens when Y

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentUnderTest } from './ComponentUnderTest';

describe('ComponentUnderTest', () => {
  it('should display error message on failed upload', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ComponentUnderTest />);

    // Act
    await user.click(screen.getByRole('button', { name: /upload/i }));

    // Assert
    expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
  });
});
```

## Edge Cases to Always Test

- Empty arrays and null values
- Network failures and timeouts
- Concurrent operations
- Boundary values (0, -1, MAX_INT)
- Unicode and special characters

## Commands

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run with coverage report
- `npm run test:e2e` - Run Playwright E2E tests

## After Test Generation

> [!IMPORTANT]
> After generating tests, you MUST:
>
> 1. Run all tests: `npm run test`
> 2. Ensure new tests pass
> 3. Check coverage hasn't decreased: `npm run test:coverage`
> 4. Fix ALL errors and warnings
