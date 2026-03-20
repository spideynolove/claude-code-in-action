#!/usr/bin/env bash
set -euo pipefail

if [ -f package.json ] && jq -e '.scripts["storybook"]' package.json >/dev/null 2>&1; then
  echo "Storybook smoke hook placeholder: wire this to your actual CI or preview command."
fi
