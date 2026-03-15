#!/bin/bash
# PostToolUse: Auto-format written/edited files with Biome

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only format relevant file types
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx|json)$ ]]; then
  # Find biome in the project
  BIOME_BIN=""

  # Check common locations
  if [ -f "backend/node_modules/.bin/biome" ]; then
    BIOME_BIN="backend/node_modules/.bin/biome"
  elif [ -f "frontend/node_modules/.bin/biome" ]; then
    BIOME_BIN="frontend/node_modules/.bin/biome"
  elif command -v bunx &>/dev/null; then
    BIOME_BIN="bunx biome"
  fi

  if [ -n "$BIOME_BIN" ]; then
    $BIOME_BIN format --write "$FILE_PATH" 2>/dev/null || true
  fi
fi

exit 0
