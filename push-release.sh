#!/bin/bash
# ─── The Codex Release Script ─────────────────────────────────────────────────
# Run this from the repo root to push a new release.
# It builds the frontend, zips dist, updates version.json, commits, and pushes.
# The CI (GitHub Actions) handles building Tauri installers (.msi, .exe) and
# uploading them to the release — this script does NOT touch releases directly.
#
# Usage:  ./push-release.sh
# ───────────────────────────────────────────────────────────────────────────────

set -e

REPO="nisakson2000/dnd-tracker"

# 1. Read version from version.js
VERSION=$(grep "APP_VERSION" frontend/src/version.js | head -1 | sed "s/.*'\(.*\)'.*/\1/" | sed 's/^V//')
echo "═══ Releasing V${VERSION} ═══"

# 2. Build frontend
echo "→ Building frontend..."
cd frontend && npx vite build 2>&1 | tail -1
echo "→ Build complete"

# 3. Create dist.zip (for OTA hotpatch)
echo "→ Creating dist.zip..."
cd dist
rm -f ../dist.zip
powershell -Command "Compress-Archive -Path '.' -DestinationPath '../dist.zip' -Force"
cd ../..
echo "→ dist.zip created ($(du -h frontend/dist.zip | cut -f1))"

# 4. Update version.json
echo "→ Updating version.json..."
cat > version.json << VJEOF
{"version":"${VERSION}","notes":"V${VERSION}","download":"https://github.com/${REPO}/releases/tag/v${VERSION}"}
VJEOF

# 5. Delete old release & tag (so CI creates a fresh one)
echo "→ Cleaning up old v${VERSION} release..."
gh release delete "v${VERSION}" --yes --cleanup-tag 2>/dev/null || echo "  (no old release to delete)"

# 6. Stage, commit, push (push triggers CI which builds & uploads installers)
echo "→ Committing and pushing..."
git add -A
git commit -m "Release V${VERSION} — OTA hotpatch + dist.zip" --allow-empty 2>/dev/null || true
git push origin main

echo ""
echo "═══ V${VERSION} pushed successfully! ═══"
echo "  • dist.zip ready (OTA update)"
echo "  • version.json updated (app will detect new version)"
echo "  • CI will build Windows (.msi, .exe) + Linux (.deb, .AppImage) installers"
echo "  • Watch CI: https://github.com/${REPO}/actions"
