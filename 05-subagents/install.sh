#!/bin/bash
# Symlink ~/.claude portable files from this dotfiles repo
# Run once on each new machine after cloning

REPO_DIR="$(cd "$(dirname "$0")" && pwd)/.claude"
TARGET="$HOME/.claude"

mkdir -p "$TARGET/agents" "$TARGET/hooks" "$TARGET/skills"

# Agents
for f in "$REPO_DIR/agents/"*.md; do
  ln -sf "$f" "$TARGET/agents/$(basename "$f")"
  echo "linked agents/$(basename "$f")"
done

# Skills
for skill_dir in "$REPO_DIR/skills/"*/; do
  skill_name=$(basename "$skill_dir")
  mkdir -p "$TARGET/skills/$skill_name"
  ln -sf "$skill_dir/SKILL.md" "$TARGET/skills/$skill_name/SKILL.md"
  echo "linked skills/$skill_name/SKILL.md"
done

# Hooks
for f in "$REPO_DIR/hooks/"*; do
  ln -sf "$f" "$TARGET/hooks/$(basename "$f")"
  chmod +x "$f"
  echo "linked hooks/$(basename "$f")"
done

# CLAUDE.md
ln -sf "$REPO_DIR/CLAUDE.md" "$TARGET/CLAUDE.md"
echo "linked CLAUDE.md"

echo ""
echo "Done. settings.json NOT symlinked — copy and edit manually:"
echo "  cp $REPO_DIR/settings.json $TARGET/settings.json"
echo "  Then update absolute paths for this machine."
