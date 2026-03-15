# Version Bump Checklist

Read this file before pushing any release. Every item must be updated or the versions will fall out of sync.

---

## Files to Update (all must match)

| # | File | Field / Line | Example |
|---|------|-------------|---------|
| 1 | `frontend/src/version.js` | `APP_VERSION` (source of truth) | `'V0.8.0'` |
| 2 | `package.json` (root) | `"version"` | `"0.8.0"` |
| 3 | `frontend/package.json` | `"version"` | `"0.8.0"` |
| 4 | `src-tauri/tauri.conf.json` | `"version"` | `"0.8.0"` |
| 5 | `src-tauri/Cargo.toml` | `version = "..."` | `"0.8.0"` |

## Changelogs to Update

| # | File | What to do |
|---|------|-----------|
| 6 | `frontend/src/data/changelog.js` | Add new entry at top of `CHANGELOG` array (this is what shows in-app) |
| 7 | `MASTERUPDATELIST.md` | Add new version section at top below the header |
| 8 | `README.md` | Update `**Current Version: V0.X.X**` on line 3 |

## Release (GitHub)

| # | Action | Details |
|---|--------|---------|
| 9 | `version.json` (repo root) | Update `"version"` — this is what the in-app update checker reads |
| 10 | GitHub Release | Tag and title must match the new version |

## Steps

1. Decide the new version number
2. Update all 5 version files (#1-5)
3. Write the changelog entry in `changelog.js` (#6)
4. Copy/expand the changelog into `MASTERUPDATELIST.md` (#7)
5. Update `README.md` version line (#8)
6. Update `version.json` (#9)
7. Test the app — confirm Updates tab shows the correct version
8. Commit locally
9. Only push + create GitHub Release (#10) when explicitly ready

## Rules

- Do NOT bump version for every small push — only for big updates or accumulated bug fixes
- Never include sensitive info (passwords, passphrases, keys) in changelogs
- The in-app Updates tab shows only the current version; full history lives in MASTERUPDATELIST.md
