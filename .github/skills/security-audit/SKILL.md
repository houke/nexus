---
name: security-audit
description: specific instructions for performing security audits on the codebase
---

# Security Audit Skill

Verify application security against Terra Quest security standards and OWASP best practices.

## Verification Criteria

### 1. Dependency Security

- Run `npm audit` (or pnpm/yarn equivalent)
- specific check for high/critical vulnerabilities
- Review peer dependency warnings

### 2. Data Security (Local-First)

- Verify SQLite / OPFS encryption settings if applicable
- Ensure no sensitive PII is logged to console
- Check LocalStorage usage (avoid for sensitive data, use IndexedDB/OPFS)

### 3. Code Security

- **Input Validation**: All user inputs sanitized/validated (Zod schemas)
- **Secrets**: No hardcoded API keys or secrets in source
- **CSP**: Content Security Policy headers configured in Vite/HTML
- **XSS Prevention**: React automatically escapes, but watch for `dangerouslySetInnerHTML`

### 4. Network Security

- HTTPS everywhere (enforced via headers/meta)
- Secure headers (HSTS, No-Sniff)

## Verification Checklist

```markdown
- [ ] `npm audit` passes without critical issues
- [ ] No `dangerouslySetInnerHTML` usage without strict justification
- [ ] No hardcoded secrets found
- [ ] Zod schemas used for all external inputs
- [ ] Sensitive local data is handled securely
```

## Commands

Run these to verify:

```bash
npm audit         # Check dependencies
# Manual grep for common secrets patterns if needed
# grep -r "API_KEY" .
```

## After Verification

> [!IMPORTANT]
> If vulnerabilities are found:
>
> 1. Assess severity
> 2. Update packages if patches exist
> 3. Document any unfixable issues/false positives
