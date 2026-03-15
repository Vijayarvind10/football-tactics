#!/bin/bash
# PreToolUse: Block destructive bash commands

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

BLOCKED_PATTERNS=(
  "rm -rf"
  "rm -fr"
  "DROP TABLE"
  "DROP DATABASE"
  "TRUNCATE TABLE"
  "reset --hard"
  "push --force"
  "push -f"
  "--no-verify"
  "git clean -f"
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qF "$pattern"; then
    jq -n \
      --arg reason "Blocked: command contains '$pattern'. Review carefully before running this manually." \
      '{
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: $reason
        }
      }'
    exit 0
  fi
done

exit 0
