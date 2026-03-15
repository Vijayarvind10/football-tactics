#!/bin/bash
# PostToolUse: Remind to run drizzle-kit after schema changes

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

if [[ "$FILE_PATH" == */db/schema.ts ]]; then
  echo "" >&2
  echo "📋 Schema changed — create a new migration:" >&2
  echo "  cd backend && bunx drizzle-kit generate" >&2
  echo "  cd backend && bunx drizzle-kit migrate" >&2
  echo "" >&2
fi

exit 0
