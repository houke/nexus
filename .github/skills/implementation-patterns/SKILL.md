---
name: implementation-patterns
description: TDD workflows, coding standards, debugging strategies, and production code patterns for Terra Quest development.
---

# Implementation Patterns Skill

This skill provides patterns for writing production-quality TypeScript/React code in Terra Quest.

## TDD Workflow

### Red-Green-Refactor Cycle

```
1. RED: Write a failing test that defines desired behavior
2. GREEN: Write minimal code to make the test pass
3. REFACTOR: Improve code quality while keeping tests green
```

### When to Use TDD

| Use TDD                           | Skip TDD                   |
| --------------------------------- | -------------------------- |
| Business logic                    | UI exploration/prototyping |
| Data transformations              | One-off scripts            |
| State machines                    | Trivial getters/setters    |
| Algorithm implementation          | Config files               |
| Bug fixes (regression test first) | Styling changes            |

## Implementation Checklist

### Before Starting

- [ ] Read and understand the requirement
- [ ] Identify existing patterns in codebase
- [ ] List edge cases to handle
- [ ] Determine test strategy

### During Implementation

- [ ] Write test first (if TDD)
- [ ] Implement minimal solution
- [ ] Handle error cases explicitly
- [ ] Add JSDoc for public APIs

### Before Completing

- [ ] All tests pass (`pnpm test`)
- [ ] No lint errors (`pnpm lint`)
- [ ] No type errors (`pnpm typecheck`)
- [ ] Code reviewed for clarity

## Debugging Strategy

### Systematic Approach

```
1. REPRODUCE: Create minimal reproduction case
2. ISOLATE: Binary search to find the cause
3. UNDERSTAND: Read code carefully, don't guess
4. FIX: Make the smallest possible change
5. VERIFY: Test fix and check for regressions
6. DOCUMENT: Update comments if behavior was unclear
```

### Debug Tools

```typescript
// Console debugging (remove before commit)
console.log('[DEBUG]', { variable, anotherVariable });

// Conditional breakpoints in DevTools
// Right-click breakpoint → "Edit breakpoint" → Add condition

// Performance debugging
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

## Common Patterns

### Service Pattern

```typescript
// src/features/example/services/example.service.ts
import type { ExampleRepository } from '../repositories/example.repository';

export interface ExampleService {
  doSomething(input: Input): Promise<Output>;
}

export function createExampleService(repo: ExampleRepository): ExampleService {
  return {
    async doSomething(input: Input): Promise<Output> {
      // Validate input
      if (!input.required) {
        throw new Error('Required field missing');
      }

      // Business logic
      const result = await repo.findById(input.id);

      // Transform and return
      return transformToOutput(result);
    },
  };
}
```

### React Hook Pattern

```typescript
// src/features/example/hooks/useExample.ts
import { useState, useCallback } from 'react';
import { useExampleStore } from '../stores/example.store';

export function useExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { data, setData } = useExampleStore();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await exampleService.getData();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [setData]);

  return { data, isLoading, error, fetchData };
}
```

### Error Handling Pattern

```typescript
// Define specific error types
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Use Result type for expected failures
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

// Handle errors explicitly
async function processData(input: unknown): Promise<Result<Output>> {
  const validated = validateInput(input);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  try {
    const result = await doWork(validated.value);
    return { ok: true, value: result };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
  }
}
```

### Component Pattern

```typescript
// src/features/example/components/ExampleCard.tsx
import type { FC } from 'react'
import styles from './ExampleCard.module.css'

interface ExampleCardProps {
  title: string
  description?: string
  onAction: () => void
  isDisabled?: boolean
}

export const ExampleCard: FC<ExampleCardProps> = ({
  title,
  description,
  onAction,
  isDisabled = false,
}) => {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      <button
        type="button"
        onClick={onAction}
        disabled={isDisabled}
        className={styles.button}
      >
        Take Action
      </button>
    </article>
  )
}
```

## Code Quality Checks

```bash
# Run before every commit
pnpm test        # Unit and integration tests
pnpm lint        # ESLint checks
pnpm typecheck   # TypeScript compiler

# Run periodically
pnpm test:e2e    # End-to-end tests
pnpm audit       # Security vulnerabilities
```

## After Implementation

> [!IMPORTANT]
> After implementing any feature, you MUST:
>
> 1. Run all tests: `pnpm test`
> 2. Run linting: `pnpm lint`
> 3. Run type checking: `pnpm typecheck`
> 4. Fix ALL errors and warnings
> 5. Verify the feature works manually
