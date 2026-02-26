#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-api-rate-limit-headers"

if [[ -f "/home/dotmac/projects/dotmac-platform/.env.agent-swarm" ]]; then
    set -a; source "/home/dotmac/projects/dotmac-platform/.env.agent-swarm"; set +a
fi
source "/home/dotmac/projects/dotmac-platform/scripts/json-lock.sh"

export OPENAI_API_KEY="${DEEPSEEK_API_KEY}"
export OPENAI_API_BASE="https://api.deepseek.com"

echo "=== Seabone Agent: add-api-rate-limit-headers ==="
echo "Task: Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module"
echo "Branch: agent/add-api-rate-limit-headers"
echo "Model: deepseek-chat"
echo "Started: $(date)"
echo "================================"

aider --model "openai/deepseek-chat"     --no-auto-commits     --yes-always     --no-show-model-warnings     --subtree-only     --message "Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module"     2>&1 | tee -a "/home/dotmac/projects/dotmac-platform/.seabone/logs/add-api-rate-limit-headers.log"

AIDER_EXIT=$?

if [[ $AIDER_EXIT -eq 0 ]]; then
    cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-api-rate-limit-headers"
    if git diff --quiet && git diff --cached --quiet; then
        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-api-rate-limit-headers") | .status) = "no_changes"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "⚠️ *Seabone*: `add-api-rate-limit-headers` — no changes made.
Task: Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module"
    else
        git add -A
        git commit -m "feat(add-api-rate-limit-headers): Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module

Automated by Seabone (aider + deepseek-chat)"
        git push -u origin "agent/add-api-rate-limit-headers"

        PR_URL=$(gh pr create             --title "[add-api-rate-limit-headers] Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module"             --body "## Summary
Automated PR by Seabone agent swarm.

**Task:** Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module
**Model:** `deepseek-chat`
**Branch:** `agent/add-api-rate-limit-headers`

---
🤖 Seabone Agent Swarm"             --head "agent/add-api-rate-limit-headers" 2>&1) || PR_URL="PR creation failed"

        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-api-rate-limit-headers") | .status) = "pr_created"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "✅ *Seabone*: `add-api-rate-limit-headers` done!
Task: Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module
PR: $PR_URL"
    fi
else
    json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-api-rate-limit-headers") | .status) = "failed"'
    "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "❌ *Seabone*: `add-api-rate-limit-headers` failed (exit $AIDER_EXIT).
Task: Add X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset response headers to the auth login endpoint in app/api/auth.py using the existing rate_limit module"
fi
