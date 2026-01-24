---
name: verify-code
description: Verify code quality, type safety, memory leaks, and coding standards. Use when reviewing code, checking for issues, or validating a PR.
---

# Code Verification Skill

Verify code quality against Terra Quest coding standards.

## Verification Criteria

### 1. Type Safety (TypeScript)

- No `any` types unless absolutely necessary
- Proper null checks and optional chaining
- Generic types used where appropriate
- Strict mode compliance

### 2. Memory Leak Prevention

- Event listeners removed in cleanup/useEffect return
- Subscriptions unsubscribed
- Timers cleared (setTimeout, setInterval)
- AbortController used for fetch requests

### 3. Coding Patterns

- **Early Returns**: Guard clauses reduce nesting
- **Single Responsibility**: Functions do one thing
- **Descriptive Naming**: Names reveal intent
- **Const by Default**: Use `const`, only `let` when needed

### 4. React Best Practices

- Side effects contained in useEffect
- Dependencies arrays are complete
- useMemo/useCallback used appropriately
- Keys are stable and unique (not array index)

## Verification Checklist

```markdown
- [ ] Type-safe (no implicit `any`)
- [ ] No potential memory leaks
- [ ] Uses early return pattern
- [ ] Descriptive variable naming
- [ ] React hooks used correctly
- [ ] Error boundaries for fallible code
```

## Commands

Run these to verify:

```bash
npm run lint          # ESLint checks
npm run typecheck     # TypeScript strict checks
npm run test          # All tests pass
```

## After Verification

> [!IMPORTANT]
> After verifying code, you MUST:
>
> 1. Run all verification commands
> 2. Fix ALL errors and warnings found
> 3. Ensure the codebase is clean before completing
