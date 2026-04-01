#!/bin/bash
FILE="${CLAUDE_TOOL_INPUT_FILE:-}"
[ -z "$FILE" ] && exit 0

case "$FILE" in
    *.cs|*.ts|*.tsx|*.js|*.jsx|*.py|*.go|*.rs|*.php|*.rb|*.java|*.kt|*.swift|*.dart) ;;
    *) exit 0 ;;
esac

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

HAS_SPEC=0
if find "$PROJECT_DIR" -name "*.spec.md" -mtime -14 -type f -print -quit 2>/dev/null | grep -q .; then
  HAS_SPEC=1
fi

if [ "$HAS_SPEC" -eq 0 ]; then
    echo "" >&2
    echo "PLAN GATE: No recent spec found (.spec.md modified in last 14 days)." >&2
    echo "Consider creating a specification before implementing. (Warning only)" >&2
    echo "" >&2
fi

exit 0
