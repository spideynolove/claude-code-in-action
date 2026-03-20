#!/usr/bin/env bash
set -euo pipefail

if [ -f package.json ]; then
  if jq -e '.scripts.typecheck' package.json >/dev/null 2>&1; then
    npm run typecheck
    exit 0
  fi

  if jq -e '.scripts.build' package.json >/dev/null 2>&1; then
    npm run build
    exit 0
  fi
fi

exit 0
