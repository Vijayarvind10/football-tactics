#!/bin/bash
# PreToolUse: Block editing .env files directly

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Check if the file is a .env file (but allow .env.example)
BASENAME=$(basename "$FILE_PATH")

if [[ "$BASENAME" == ".env" ]] || [[ "$BASENAME" =~ ^\.env\.[a-zA-Z]+$ && "$BASENAME" != ".env.example" ]]; then
  jq -n \
    --arg path "$FILE_PATH" \
    --arg reason "Blocked: Do not edit '$path' directly. Set environment variables via Railway dashboard (production) or create a .env.local file (local dev). Never commit real secrets." \
    '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: $reason
      }
    }'
  exit 0
fi

exit 0
