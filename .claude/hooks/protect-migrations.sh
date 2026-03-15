#!/bin/bash
# PreToolUse: Warn when editing migration files directly

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

if [[ "$FILE_PATH" == */migrations/*.sql ]]; then
  echo "WARNING: You are editing a migration file directly: $FILE_PATH" >&2
  echo "Migration files should not be edited manually." >&2
  echo "To create a new migration: cd backend && bunx drizzle-kit generate" >&2
  echo "To apply migrations: cd backend && bunx drizzle-kit migrate" >&2
fi

exit 0
