#!/usr/bin/env bash
# Build-free local gate: serves dist/pages under the same base path Pages uses, then runs the
# route gate against it. The base path matters -- a build packaged for /deepgrid-dr-silicon-v3/
# served at / fails every link check for the wrong reason.
set -euo pipefail

BASE_PATH="${PAGES_BASE:-/deepgrid-dr-silicon-v3/}"
SLUG="$(echo "$BASE_PATH" | tr -d '/')"
PORT="${PORT:-8768}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$ROOT/dist/pages/index.html" ]; then
  echo "dist/pages/index.html is missing. Run: npm run build:pages" >&2
  exit 1
fi

SRV="$(mktemp -d)"
ln -s "$ROOT/dist/pages" "$SRV/$SLUG"
python3 "$ROOT/scripts/serve-dist.py" "$PORT" "$SRV" >/dev/null 2>&1 &
SERVER=$!
cleanup() { kill "$SERVER" 2>/dev/null || true; rm -rf "$SRV"; }
trap cleanup EXIT

until curl -sf -o /dev/null "http://127.0.0.1:$PORT/$SLUG/"; do sleep 1; done
node "$ROOT/scripts/verify-routes.mjs" "http://127.0.0.1:$PORT/$SLUG/" "${1:-verify-shots}"
