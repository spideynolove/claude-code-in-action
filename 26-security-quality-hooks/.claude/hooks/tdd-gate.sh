#!/bin/bash
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=""

case "$TOOL" in
  Edit|MultiEdit|Write)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    ;;
  *) exit 0 ;;
esac

[ -z "$FILE_PATH" ] && exit 0

EXT="${FILE_PATH##*.}"
case "$EXT" in
  cs|py|ts|tsx|js|jsx|go|rs|rb|php|java|kt|swift|dart) ;;
  *) exit 0 ;;
esac

BASENAME=$(basename "$FILE_PATH")
case "$BASENAME" in
  *Test.${EXT}|*Tests.${EXT}|*_test.${EXT}|test_*.${EXT}) exit 0 ;;
  *.test.${EXT}|*.spec.${EXT}|*Spec.${EXT}|*Specs.${EXT}) exit 0 ;;
  *Migration*|*migration*|*.dto.*|*DTO*) exit 0 ;;
  *.d.ts|*.config.ts|*.config.js|tsconfig*|package.json) exit 0 ;;
  *.md|*.txt|*.json|*.xml|*.html|*.css|*.scss) exit 0 ;;
esac

case "$FILE_PATH" in
  */test/*|*/tests/*|*/Test/*|*/Tests/*|*/__tests__/*) exit 0 ;;
  */spec/*|*/specs/*|*/fixtures/*|*/mocks/*|*/config/*|*/scripts/*) exit 0 ;;
esac

NAME_NO_EXT="${BASENAME%.*}"
FILE_DIR=$(dirname "$FILE_PATH")
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")

TESTS_FOUND=$(find "$FILE_DIR" "$FILE_DIR/../test" "$FILE_DIR/../tests" "$FILE_DIR/../__tests__" -maxdepth 2 -type f \( \
  -name "${NAME_NO_EXT}Test.*" -o \
  -name "${NAME_NO_EXT}Tests.*" -o \
  -name "${NAME_NO_EXT}.test.*" -o \
  -name "${NAME_NO_EXT}.spec.*" -o \
  -name "${NAME_NO_EXT}_test.*" -o \
  -name "test_${NAME_NO_EXT}.*" \
  \) 2>/dev/null | head -1)

if [ -z "$TESTS_FOUND" ]; then
  TESTS_FOUND=$(find "$PROJECT_ROOT" -maxdepth 6 -type f \( \
    -name "${NAME_NO_EXT}Test.*" -o \
    -name "${NAME_NO_EXT}Tests.*" -o \
    -name "${NAME_NO_EXT}.test.*" -o \
    -name "${NAME_NO_EXT}.spec.*" -o \
    -name "${NAME_NO_EXT}_test.*" -o \
    -name "test_${NAME_NO_EXT}.*" \
    \) 2>/dev/null | head -1)
fi

if [ -z "$TESTS_FOUND" ]; then
  echo "TDD GATE: No tests found for '$BASENAME'. Write tests BEFORE implementing production code." >&2
  echo "Create: ${NAME_NO_EXT}.test.${EXT} or ${NAME_NO_EXT}Test.${EXT}" >&2
  exit 2
fi

exit 0
