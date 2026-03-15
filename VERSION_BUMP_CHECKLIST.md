# Version Bump Checklist

Read this file before pushing any release. Every item must be updated or the versions will fall out of sync.
**CI enforces this** — the build will fail if any of these are out of sync.

---

## Files to Update (all must match)

| # | File | Field / Line | Example |
|---|------|-------------|---------|
| 1 | `frontend/src/version.js` | `APP_VERSION` (source of truth) | `'V0.8.0'` |
| 2 | `package.json` (root) | `"version"` | `"0.8.0"` |
| 3 | `frontend/package.json` | `"version"` | `"0.8.0"` |
| 4 | `src-tauri/tauri.conf.json` | `"version"` | `"0.8.0"` |
| 5 | `src-tauri/Cargo.toml` | `version = "..."` | `"0.8.0"` |
| 6 | `version.json` (repo root) | `"version"` — the in-app update checker reads this | `"0.8.0"` |

## Changelogs to Update

| # | File | What to do |
|---|------|-----------|
| 7 | `frontend/src/data/changelog.js` | Add new entry at top of `CHANGELOG` array — **this is what "What's New" shows in-app** |
| 8 | `MASTERUPDATELIST.md` | Add new version section at top below the header |
| 9 | `README.md` | Update `**Current Version: V0.X.X**` on line 3 |

## Release (GitHub)

| # | Action | Details |
|---|--------|---------|
| 10 | GitHub Release | CI creates this automatically on push — tag and title match the version |

## Steps

1. Decide the new version number
2. Update all 6 version files (#1-6)
3. Write the changelog entry in `changelog.js` (#7) — **the app's "What's New" reads this, it will show stale content if you skip it**
4. Copy/expand the changelog into `MASTERUPDATELIST.md` (#8)
5. Update `README.md` version line (#9)
6. Test the app — confirm the Updates tab shows the correct version AND the correct "What's New" content
7. Commit locally
8. Only push when explicitly ready — CI builds and creates the GitHub Release (#10) automatically

## Rules

- Do NOT bump version for every small push — only for big updates or accumulated bug fixes
- Never include sensitive info (passwords, passphrases, keys) in changelogs
- The in-app Updates tab shows only the current version; full history lives in MASTERUPDATELIST.md
