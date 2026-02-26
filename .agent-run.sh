#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-startup-checks"

if [[ -f "/home/dotmac/projects/dotmac-platform/.env.agent-swarm" ]]; then
    set -a; source "/home/dotmac/projects/dotmac-platform/.env.agent-swarm"; set +a
fi
source "/home/dotmac/projects/dotmac-platform/scripts/json-lock.sh"

export OPENAI_API_KEY="${DEEPSEEK_API_KEY}"
export OPENAI_API_BASE="https://api.deepseek.com"

echo "=== Seabone Agent: add-startup-checks ==="
echo "Task: Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot"
echo "Branch: agent/add-startup-checks"
echo "Model: deepseek-chat"
echo "Started: $(date)"
echo "================================"

aider --model "openai/deepseek-chat"     --no-auto-commits     --yes-always     --no-show-model-warnings     --subtree-only     --message "Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot"     2>&1 | tee -a "/home/dotmac/projects/dotmac-platform/.seabone/logs/add-startup-checks.log"

AIDER_EXIT=$?

if [[ $AIDER_EXIT -eq 0 ]]; then
    cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-startup-checks"
    if git diff --quiet && git diff --cached --quiet; then
        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-startup-checks") | .status) = "no_changes"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "⚠️ *Seabone*: `add-startup-checks` — no changes made.
Task: Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot"
    else
        git add -A
        git commit -m "feat(add-startup-checks): Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot

Automated by Seabone (aider + deepseek-chat)"
        git push -u origin "agent/add-startup-checks"

        PR_URL=$(gh pr create             --title "[add-startup-checks] Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot"             --body "## Summary
Automated PR by Seabone agent swarm.

**Task:** Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot
**Model:** `deepseek-chat`
**Branch:** `agent/add-startup-checks`

---
🤖 Seabone Agent Swarm"             --head "agent/add-startup-checks" 2>&1) || PR_URL="PR creation failed"

        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-startup-checks") | .status) = "pr_created"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "✅ *Seabone*: `add-startup-checks` done!
Task: Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot
PR: $PR_URL"
    fi
else
    json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-startup-checks") | .status) = "failed"'
    "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "❌ *Seabone*: `add-startup-checks` failed (exit $AIDER_EXIT).
Task: Add a startup event in app/main.py lifespan that logs the app version, Python version, database connectivity status, and Redis connectivity status on application boot"
fi
