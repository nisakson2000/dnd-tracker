#!/bin/bash
# ─── The Codex Release Script ─────────────────────────────────────────────────
# Run this from the repo root to push a new release.
# It builds the frontend, zips dist, updates version.json,
# deletes old GitHub releases, creates a new one, and pushes everything.
#
# Usage:  ./push-release.sh
# ───────────────────────────────────────────────────────────────────────────────

set -e

GH="/c/Program Files/GitHub CLI/gh.exe"
REPO="nisakson2000/dnd-tracker"

# 1. Read version from version.js
VERSION=$(grep "APP_VERSION" frontend/src/version.js | head -1 | sed "s/.*'\(.*\)'.*/\1/" | sed 's/^V//')
echo "═══ Releasing V${VERSION} ═══"

# 2. Build frontend
echo "→ Building frontend..."
cd frontend && npx vite build 2>&1 | tail -1
echo "→ Build complete"

# 3. Create dist.zip
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

# 5. Stage, commit, push
echo "→ Committing and pushing..."
git add -A
git commit -m "Release V${VERSION} — OTA hotpatch + dist.zip" --allow-empty 2>/dev/null || true
git push origin main

# 6. Delete ALL old releases (keep only the new one)
echo "→ Cleaning old releases..."
OLD_TAGS=$("$GH" release list --repo "$REPO" --limit 50 2>/dev/null | awk '{print $NF}' | grep -v "^$" || true)
for tag in $OLD_TAGS; do
    # Extract the tag from the last column
    TAG=$(echo "$tag" | grep -oP 'v[\d.]+' || true)
    if [ -n "$TAG" ]; then
        "$GH" release delete "$TAG" --repo "$REPO" --yes 2>/dev/null || true
        git push origin --delete "$TAG" 2>/dev/null || true
        git tag -d "$TAG" 2>/dev/null || true
    fi
done

# 7. Create fresh release
echo "→ Creating release v${VERSION}..."
"$GH" release create "v${VERSION}" \
    --repo "$REPO" \
    --title "V${VERSION} — The Codex" \
    --latest \
    --notes "Release V${VERSION}. See MASTERUPDATELIST.md for full changelog."

echo ""
echo "═══ V${VERSION} released successfully! ═══"
echo "  • dist.zip pushed (OTA update ready)"
echo "  • version.json updated (app will detect new version)"
echo "  • GitHub release: https://github.com/${REPO}/releases/tag/v${VERSION}"
echo "  • All old releases deleted"
