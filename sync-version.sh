#!/bin/bash
# sync-version.sh — Reads app + DM versions and pushes both to the Gist manifest.
# Run this after bumping either version, or hook it into your release flow.
#
# Usage:
#   ./sync-version.sh                              # Sync both versions
#   ./sync-version.sh "App notes" "DM notes"       # Sync with release notes
#   ./sync-version.sh "Notes" "DM notes" "https://download-url"

set -euo pipefail

GIST_ID="ca61bfa2b0eadf1f1e57108cbd881152"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION_JSON="$SCRIPT_DIR/version.json"
VERSION_JS="$SCRIPT_DIR/frontend/src/version.js"

# Read app version from version.json
if [ ! -f "$VERSION_JSON" ]; then
  echo "Error: version.json not found"
  exit 1
fi

APP_VERSION=$(python3 -c "import json; print(json.load(open('$VERSION_JSON'))['version'])" 2>/dev/null \
  || node -e "console.log(JSON.parse(require('fs').readFileSync('$VERSION_JSON','utf8')).version)" 2>/dev/null)

# Read DM version from version.js
DM_VERSION=""
if [ -f "$VERSION_JS" ]; then
  DM_VERSION=$(grep -oP "DM_MODE_VERSION\s*=\s*'V?([^']+)'" "$VERSION_JS" | grep -oP "[\d]+\.[\d]+\.[\d]+" || echo "")
fi

if [ -z "$APP_VERSION" ]; then
  echo "Error: Could not read app version"
  exit 1
fi

if [ -z "$DM_VERSION" ]; then
  echo "Warning: Could not read DM version, using 0.0.0"
  DM_VERSION="0.0.0"
fi

APP_NOTES="${1:-}"
DM_NOTES="${2:-}"
DOWNLOAD="${3:-}"

# Check gh auth
if ! gh auth status &>/dev/null; then
  echo "Error: gh CLI not authenticated. Run 'gh auth login' first."
  exit 1
fi

# Build and push manifest
MANIFEST=$(python3 -c "
import json
print(json.dumps({
    'version': '$APP_VERSION',
    'dm_version': '$DM_VERSION',
    'notes': '''$APP_NOTES''',
    'dm_notes': '''$DM_NOTES''',
    'download': '$DOWNLOAD'
}, indent=2))
" 2>/dev/null || node -e "
console.log(JSON.stringify({
    version: '$APP_VERSION',
    dm_version: '$DM_VERSION',
    notes: \`$APP_NOTES\`,
    dm_notes: \`$DM_NOTES\`,
    download: '$DOWNLOAD'
}, null, 2))
" 2>/dev/null)

echo "$MANIFEST" | gh gist edit "$GIST_ID" -f version.json -

echo ""
echo "Gist updated successfully!"
echo "  App version: $APP_VERSION"
echo "  DM version:  $DM_VERSION"
echo ""
echo "Manifest:"
echo "$MANIFEST"
