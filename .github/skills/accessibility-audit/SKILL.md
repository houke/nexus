---
name: accessibility-audit
description: Perform comprehensive WCAG accessibility audits on web components. Use when auditing accessibility, checking a11y compliance, or reviewing UI for keyboard/screen reader support.
---

# Accessibility Audit Skill

Perform a comprehensive WCAG accessibility check on web components.

## Checklist

1. **Semantic HTML**
   - Are buttons `<button>`, links `<a>`, and headings `<h1>`-`<h6>` in order?
   - Are forms using proper `<label>` and `<input>` associations?

2. **Keyboard Navigation**
   - Can you reach every interactive element using `Tab`?
   - Can you activate it with `Enter`/`Space`?
   - Is there a visible focus indicator?

3. **Color Contrast**
   - Do text colors meet WCAG AA (4.5:1 for normal text, 3:1 for large text)?
   - Is information conveyed by color alone?

4. **Screen Readers**
   - Do images have descriptive `alt` text?
   - Do icon-only buttons have `aria-label`?
   - Do dynamic updates use `aria-live` regions?
   - Are modals using proper focus trapping?

5. **Motion & Animation**
   - Is `prefers-reduced-motion` respected?
   - Are animations under 5 seconds or pauseable?

## Audit Output Format

When asked to "audit accessibility", output a report:

```markdown
**Scope:** [File/Component Name]
**Compliance:** [Pass/Fail/Warn]

**Issues:**
- [ ] Line X: Description of issue

**Recommended Fixes:**
```diff
- <div onClick={...}>
+ <button onClick={...}>
```
```

## Tools

Run these commands for automated checks:
- `pnpm run test:a11y` - Run axe-core accessibility tests
- `pnpm run lighthouse` - Run Lighthouse accessibility audit

## After Audit

> [!IMPORTANT]
> After completing the audit, you MUST:
> 1. Fix all identified accessibility issues
> 2. Run tests: `pnpm test`
> 3. Fix ALL errors and warnings
