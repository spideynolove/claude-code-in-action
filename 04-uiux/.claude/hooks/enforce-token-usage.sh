#!/usr/bin/env bash
set -euo pipefail

changed_files="$(git diff --name-only --cached 2>/dev/null || true)"
[ -z "$changed_files" ] && changed_files="$(git diff --name-only 2>/dev/null || true)"

target_files="$(printf "%s\n" "$changed_files" | grep -E '\.(tsx|ts|jsx|js|css)$' || true)"
[ -z "$target_files" ] && exit 0

failed=0

while IFS= read -r file; do
  [ -f "$file" ] || continue

  if grep -nE '#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b' "$file" >/dev/null; then
    echo "Token enforcement failed in $file: raw hex color detected"
    failed=1
  fi

  if grep -nE '\b(round(ed)?-\[[^]]+\]|p[trblxy]?-\[[^]]+\]|m[trblxy]?-\[[^]]+\]|gap-\[[^]]+\]|shadow-\[[^]]+\])' "$file" >/dev/null; then
    echo "Token enforcement warning in $file: arbitrary Tailwind value detected"
    failed=1
  fi
done <<< "$target_files"

if [ "$failed" -ne 0 ]; then
  echo "Use semantic tokens or approved scale values instead of raw one-off styling."
  exit 2
fi
