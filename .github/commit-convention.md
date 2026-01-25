# Commit Convention Guide

This repository uses [Conventional Commits](https://www.conventionalcommits.org/) for automated semantic versioning and release generation.

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types and Version Bumps

| Type       | Version Bump | Description                           | Example                             |
| ---------- | ------------ | ------------------------------------- | ----------------------------------- |
| `feat`     | **MINOR**    | New feature                           | `feat: add user authentication`     |
| `fix`      | **PATCH**    | Bug fix                               | `fix: resolve login redirect issue` |
| `perf`     | **PATCH**    | Performance improvement               | `perf: optimize database queries`   |
| `docs`     | **PATCH**    | Documentation changes                 | `docs: update API reference`        |
| `style`    | **PATCH**    | Code style changes (formatting, etc.) | `style: apply prettier formatting`  |
| `refactor` | **PATCH**    | Code refactoring                      | `refactor: simplify auth logic`     |
| `test`     | **PATCH**    | Add or update tests                   | `test: add unit tests for auth`     |
| `build`    | **PATCH**    | Build system changes                  | `build: update webpack config`      |
| `ci`       | **PATCH**    | CI/CD changes                         | `ci: add release workflow`          |
| `chore`    | **NONE**     | Maintenance tasks (no release)        | `chore: update dependencies`        |
| `revert`   | **PATCH**    | Revert previous commit                | `revert: undo feature X`            |

## Breaking Changes → MAJOR Version Bump

Add `BREAKING CHANGE:` in the footer or use `!` after type:

```bash
feat!: redesign authentication API

BREAKING CHANGE: Authentication now requires OAuth 2.0 tokens
```

## Examples

### Feature (Minor bump: 1.0.0 → 1.1.0)

```bash
feat(auth): add social login support

Implemented OAuth login for Google, GitHub, and Microsoft accounts.
```

### Bug Fix (Patch bump: 1.1.0 → 1.1.1)

```bash
fix(api): handle null responses in user endpoint

Added null checks to prevent crashes when user data is incomplete.
```

### Breaking Change (Major bump: 1.1.1 → 2.0.0)

```bash
feat(api)!: remove legacy REST endpoints

BREAKING CHANGE: All v1 REST endpoints have been removed.
Migrate to GraphQL API documented at /docs/api/graphql
```

### No Release

```bash
chore: update README with installation steps
```

## Scopes (Optional)

Use scopes to identify the area of change:

- `(auth)` - authentication
- `(api)` - API changes
- `(ui)` - user interface
- `(db)` - database
- `(docs)` - documentation
- `(workflow)` - GitHub Actions workflows

## How Releases Work

1. **Push to main** → GitHub Actions workflow triggers
2. **Analyze commits** → semantic-release determines version bump
3. **Generate changelog** → Creates/updates CHANGELOG.md
4. **Create release** → GitHub release with version tag
5. **Commit changelog** → Commits CHANGELOG.md back to repo

## Release Rules Summary

- `feat:` → Minor version (1.0.0 → 1.1.0)
- `fix:` → Patch version (1.0.0 → 1.0.1)
- `BREAKING CHANGE:` → Major version (1.0.0 → 2.0.0)
- `chore:` → No release

## First Release

If no previous releases exist, semantic-release will create `1.0.0`.

## Tips

- Use descriptive commit messages
- One logical change per commit
- Reference issues with `fixes #123` or `closes #456`
- Keep breaking changes rare and well-documented
