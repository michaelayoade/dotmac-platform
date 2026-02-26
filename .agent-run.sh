#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-org-member-count"

if [[ -f "/home/dotmac/projects/dotmac-platform/.env.agent-swarm" ]]; then
    set -a; source "/home/dotmac/projects/dotmac-platform/.env.agent-swarm"; set +a
fi
source "/home/dotmac/projects/dotmac-platform/scripts/json-lock.sh"

export OPENAI_API_KEY="${DEEPSEEK_API_KEY}"
export OPENAI_API_BASE="https://api.deepseek.com"

echo "=== Seabone Agent: add-org-member-count ==="
echo "Task: Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery"
echo "Branch: agent/add-org-member-count"
echo "Model: deepseek-chat"
echo "Started: $(date)"
echo "================================"

aider --model "openai/deepseek-chat"     --no-auto-commits     --yes-always     --no-show-model-warnings     --subtree-only     --message "Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery"     2>&1 | tee -a "/home/dotmac/projects/dotmac-platform/.seabone/logs/add-org-member-count.log"

AIDER_EXIT=$?

if [[ $AIDER_EXIT -eq 0 ]]; then
    cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-org-member-count"
    if git diff --quiet && git diff --cached --quiet; then
        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-org-member-count") | .status) = "no_changes"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "⚠️ *Seabone*: `add-org-member-count` — no changes made.
Task: Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery"
    else
        git add -A
        git commit -m "feat(add-org-member-count): Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery

Automated by Seabone (aider + deepseek-chat)"
        git push -u origin "agent/add-org-member-count"

        PR_URL=$(gh pr create             --title "[add-org-member-count] Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery"             --body "## Summary
Automated PR by Seabone agent swarm.

**Task:** Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery
**Model:** `deepseek-chat`
**Branch:** `agent/add-org-member-count`

---
🤖 Seabone Agent Swarm"             --head "agent/add-org-member-count" 2>&1) || PR_URL="PR creation failed"

        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-org-member-count") | .status) = "pr_created"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "✅ *Seabone*: `add-org-member-count` done!
Task: Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery
PR: $PR_URL"
    fi
else
    json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-org-member-count") | .status) = "failed"'
    "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "❌ *Seabone*: `add-org-member-count` failed (exit $AIDER_EXIT).
Task: Add a member_count computed field to the organization list endpoint response in app/api/organizations.py that returns the count of organization members using a subquery"
fi
