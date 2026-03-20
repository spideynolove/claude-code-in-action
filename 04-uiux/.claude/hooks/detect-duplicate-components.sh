#!/usr/bin/env bash
set -euo pipefail

new_components="$(git diff --name-only --cached 2>/dev/null | grep -E 'src/.*/components/.*\.(tsx|ts)$' || true)"
[ -z "$new_components" ] && exit 0

echo "Duplicate component check placeholder:"
echo "Review whether newly added components duplicate existing catalog patterns."
