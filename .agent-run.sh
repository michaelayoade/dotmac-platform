#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-request-id"

if [[ -f "/home/dotmac/projects/dotmac-platform/.env.agent-swarm" ]]; then
    set -a; source "/home/dotmac/projects/dotmac-platform/.env.agent-swarm"; set +a
fi
source "/home/dotmac/projects/dotmac-platform/scripts/json-lock.sh"

export OPENAI_API_KEY="${DEEPSEEK_API_KEY}"
export OPENAI_API_BASE="https://api.deepseek.com"

echo "=== Seabone Agent: add-request-id ==="
echo "Task: Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context"
echo "Branch: agent/add-request-id"
echo "Model: deepseek-reasoner"
echo "Started: $(date)"
echo "================================"

aider --model "openai/deepseek-reasoner"     --no-auto-commits     --yes-always     --no-show-model-warnings     --subtree-only     --message "Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context"     2>&1 | tee -a "/home/dotmac/projects/dotmac-platform/.seabone/logs/add-request-id.log"

AIDER_EXIT=$?

if [[ $AIDER_EXIT -eq 0 ]]; then
    cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-request-id"
    if git diff --quiet && git diff --cached --quiet; then
        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-request-id") | .status) = "no_changes"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "⚠️ *Seabone*: `add-request-id` — no changes made.
Task: Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context"
    else
        git add -A
        git commit -m "feat(add-request-id): Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context

Automated by Seabone (aider + deepseek-reasoner)"
        git push -u origin "agent/add-request-id"

        PR_URL=$(gh pr create             --title "[add-request-id] Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context"             --body "## Summary
Automated PR by Seabone agent swarm.

**Task:** Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context
**Model:** `deepseek-reasoner`
**Branch:** `agent/add-request-id`

---
🤖 Seabone Agent Swarm"             --head "agent/add-request-id" 2>&1) || PR_URL="PR creation failed"

        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-request-id") | .status) = "pr_created"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "✅ *Seabone*: `add-request-id` done!
Task: Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context
PR: $PR_URL"
    fi
else
    json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-request-id") | .status) = "failed"'
    "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "❌ *Seabone*: `add-request-id` failed (exit $AIDER_EXIT).
Task: Add a middleware in app/main.py that generates a UUID X-Request-ID header for every request and includes it in all log output via logging context"
fi
