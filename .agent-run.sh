#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/home/dotmac/projects/dotmac-platform/.worktrees/test-healthcheck"

if [[ -f "/home/dotmac/projects/dotmac-platform/.env.agent-swarm" ]]; then
    set -a; source "/home/dotmac/projects/dotmac-platform/.env.agent-swarm"; set +a
fi
source "/home/dotmac/projects/dotmac-platform/scripts/json-lock.sh"

export OPENAI_API_KEY="${DEEPSEEK_API_KEY}"
export OPENAI_API_BASE="https://api.deepseek.com"

echo "=== Seabone Agent: test-healthcheck ==="
echo "Task: Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check"
echo "Branch: agent/test-healthcheck"
echo "Model: deepseek-chat"
echo "Started: $(date)"
echo "================================"

aider --model "openai/deepseek-chat"     --no-auto-commits     --yes-always     --no-show-model-warnings     --subtree-only     --message "Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check"     2>&1 | tee -a "/home/dotmac/projects/dotmac-platform/.seabone/logs/test-healthcheck.log"

AIDER_EXIT=$?

if [[ $AIDER_EXIT -eq 0 ]]; then
    cd "/home/dotmac/projects/dotmac-platform/.worktrees/test-healthcheck"
    if git diff --quiet && git diff --cached --quiet; then
        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "test-healthcheck") | .status) = "no_changes"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "⚠️ *Seabone*: `test-healthcheck` — no changes made.
Task: Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check"
    else
        git add -A
        git commit -m "feat(test-healthcheck): Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check

Automated by Seabone (aider + deepseek-chat)"
        git push -u origin "agent/test-healthcheck"

        PR_URL=$(gh pr create             --title "[test-healthcheck] Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check"             --body "## Summary
Automated PR by Seabone agent swarm.

**Task:** Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check
**Model:** `deepseek-chat`
**Branch:** `agent/test-healthcheck`

---
🤖 Seabone Agent Swarm"             --head "agent/test-healthcheck" 2>&1) || PR_URL="PR creation failed"

        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "test-healthcheck") | .status) = "pr_created"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "✅ *Seabone*: `test-healthcheck` done!
Task: Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check
PR: $PR_URL"
    fi
else
    json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "test-healthcheck") | .status) = "failed"'
    "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "❌ *Seabone*: `test-healthcheck` failed (exit $AIDER_EXIT).
Task: Add a /health endpoint in app/api/health.py that returns JSON with status ok, timestamp, and database connectivity check"
fi
