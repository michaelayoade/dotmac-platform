#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-instance-search"

if [[ -f "/home/dotmac/projects/dotmac-platform/.env.agent-swarm" ]]; then
    set -a; source "/home/dotmac/projects/dotmac-platform/.env.agent-swarm"; set +a
fi
source "/home/dotmac/projects/dotmac-platform/scripts/json-lock.sh"

export OPENAI_API_KEY="${DEEPSEEK_API_KEY}"
export OPENAI_API_BASE="https://api.deepseek.com"

echo "=== Seabone Agent: add-instance-search ==="
echo "Task: Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike"
echo "Branch: agent/add-instance-search"
echo "Model: deepseek-chat"
echo "Started: $(date)"
echo "================================"

aider --model "openai/deepseek-chat"     --no-auto-commits     --yes-always     --no-show-model-warnings     --subtree-only     --message "Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike"     2>&1 | tee -a "/home/dotmac/projects/dotmac-platform/.seabone/logs/add-instance-search.log"

AIDER_EXIT=$?

if [[ $AIDER_EXIT -eq 0 ]]; then
    cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-instance-search"
    if git diff --quiet && git diff --cached --quiet; then
        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-instance-search") | .status) = "no_changes"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "⚠️ *Seabone*: `add-instance-search` — no changes made.
Task: Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike"
    else
        git add -A
        git commit -m "feat(add-instance-search): Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike

Automated by Seabone (aider + deepseek-chat)"
        git push -u origin "agent/add-instance-search"

        PR_URL=$(gh pr create             --title "[add-instance-search] Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike"             --body "## Summary
Automated PR by Seabone agent swarm.

**Task:** Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike
**Model:** `deepseek-chat`
**Branch:** `agent/add-instance-search`

---
🤖 Seabone Agent Swarm"             --head "agent/add-instance-search" 2>&1) || PR_URL="PR creation failed"

        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-instance-search") | .status) = "pr_created"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "✅ *Seabone*: `add-instance-search` done!
Task: Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike
PR: $PR_URL"
    fi
else
    json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-instance-search") | .status) = "failed"'
    "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "❌ *Seabone*: `add-instance-search` failed (exit $AIDER_EXIT).
Task: Add a search/filter query parameter to the GET /api/v1/instances endpoint in app/api/instances.py that filters instances by name substring match using SQLAlchemy ilike"
fi
