#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-backup-retention"

if [[ -f "/home/dotmac/projects/dotmac-platform/.env.agent-swarm" ]]; then
    set -a; source "/home/dotmac/projects/dotmac-platform/.env.agent-swarm"; set +a
fi
source "/home/dotmac/projects/dotmac-platform/scripts/json-lock.sh"

export OPENAI_API_KEY="${DEEPSEEK_API_KEY}"
export OPENAI_API_BASE="https://api.deepseek.com"

echo "=== Seabone Agent: add-backup-retention ==="
echo "Task: Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged"
echo "Branch: agent/add-backup-retention"
echo "Model: deepseek-chat"
echo "Started: $(date)"
echo "================================"

aider --model "openai/deepseek-chat"     --no-auto-commits     --yes-always     --no-show-model-warnings     --subtree-only     --message "Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged"     2>&1 | tee -a "/home/dotmac/projects/dotmac-platform/.seabone/logs/add-backup-retention.log"

AIDER_EXIT=$?

if [[ $AIDER_EXIT -eq 0 ]]; then
    cd "/home/dotmac/projects/dotmac-platform/.worktrees/add-backup-retention"
    if git diff --quiet && git diff --cached --quiet; then
        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-backup-retention") | .status) = "no_changes"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "⚠️ *Seabone*: `add-backup-retention` — no changes made.
Task: Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged"
    else
        git add -A
        git commit -m "feat(add-backup-retention): Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged

Automated by Seabone (aider + deepseek-chat)"
        git push -u origin "agent/add-backup-retention"

        PR_URL=$(gh pr create             --title "[add-backup-retention] Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged"             --body "## Summary
Automated PR by Seabone agent swarm.

**Task:** Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged
**Model:** `deepseek-chat`
**Branch:** `agent/add-backup-retention`

---
🤖 Seabone Agent Swarm"             --head "agent/add-backup-retention" 2>&1) || PR_URL="PR creation failed"

        json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-backup-retention") | .status) = "pr_created"'
        "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "✅ *Seabone*: `add-backup-retention` done!
Task: Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged
PR: $PR_URL"
    fi
else
    json_update "/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json" '(.[] | select(.id == "add-backup-retention") | .status) = "failed"'
    "/home/dotmac/projects/dotmac-platform/scripts/notify-telegram.sh" "❌ *Seabone*: `add-backup-retention` failed (exit $AIDER_EXIT).
Task: Add a purge_old_backups method to app/services/backup_service.py that deletes backup records older than a configurable retention_days parameter default 30 and logs how many were purged"
fi
