#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"

WORKTREE_DIR="/home/dotmac/projects/dotmac-platform/.worktrees/add-startup-checks"
PROJECT_DIR="/home/dotmac/projects/dotmac-platform"
SCRIPT_DIR="/home/dotmac/projects/dotmac-platform/scripts"
ACTIVE_FILE="/home/dotmac/projects/dotmac-platform/.seabone/active-tasks.json"
LOG_FILE="/home/dotmac/projects/dotmac-platform/.seabone/logs/add-startup-checks.log"
TASK_ID="add-startup-checks"
DESCRIPTION="Fix the startup health checks in app/main.py lifespan function. The current code has these specific bugs that must be fixed: 1) DUPLICATE DATABASE SESSION - the code creates a new db = SessionLocal() for the health check, but the existing lifespan already opens a session. Remove the duplicate SessionLocal() call and reuse the existing db session from the lifespan. 2) IMPORT ORDERING - the logging import was added at line 68 after app imports. Move it to the top of the file with other stdlib imports. 3) Use getattr(settings, VERSION, unknown) directly instead of the hasattr+getattr pattern. Keep the startup logging of app version, Python version, database connectivity status, and Redis connectivity status."
BRANCH="agent/add-startup-checks"
MODEL="deepseek-chat"
EVENT_LOG="/home/dotmac/projects/dotmac-platform/.seabone/logs/events.log"
CONFIG_FILE="/home/dotmac/projects/dotmac-platform/.seabone/config.json"
PROJECT_NAME="/home/dotmac/projects/dotmac-platform_NAME"

if [[ -f "$PROJECT_DIR/.env.agent-swarm" ]]; then
    set -a
    source "$PROJECT_DIR/.env.agent-swarm"
    set +a
fi

source "$SCRIPT_DIR/json-lock.sh"

log_event() {
    local event="$1"
    local status="$2"
    local detail="$3"
    local ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf '%s\n' "$(jq -n --arg ts "$ts" --arg project "$PROJECT_NAME" --arg task_id "$TASK_ID" --arg event "$event" --arg status "$status" --arg detail "$detail" '{ts:$ts,project:$project,task_id:$task_id,event:$event,status:$status,detail:$detail}')" >> "$EVENT_LOG"
}

set_status() {
    local status="$1"
    json_update "$ACTIVE_FILE" "(.[] | select(.id == \"$TASK_ID\") | .status) = \"$status\""
    json_update "$ACTIVE_FILE" "(.[] | select(.id == \"$TASK_ID\") | .last_heartbeat) = \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\""
    log_event "status" "$status" "updated"
}

run_quality_gates() {
    local gates
    local changed_files

    changed_files="$(git diff --name-only)"
    if [[ -z "$(printf '%s' "$changed_files" | tr -d '[:space:]')" ]]; then
        return 0
    fi

    gates="$(jq -c '.quality_gates // []' "$CONFIG_FILE")"
    if [[ "$gates" == "null" || "$gates" == "[]" ]]; then
        return 0
    fi

    while true; do
        for gate_cmd in $(echo "$gates" | jq -r '.[]'); do
            if ! SEABONE_CHANGED_FILES="$changed_files" bash -lc "$gate_cmd" >> "$LOG_FILE" 2>&1; then
                return 1
            fi
        done
        return 0
    done
}

cd "$WORKTREE_DIR"

echo "=== Seabone Agent: $TASK_ID ==="
echo "Task: $DESCRIPTION"
echo "Branch: $BRANCH"
echo "Model: $MODEL"

aider --model "openai/$MODEL" \
    --no-auto-commits \
    --yes-always \
    --no-show-model-warnings \
    --no-detect-urls \
    --subtree-only \
    --map-tokens 1024 \
    --message "$DESCRIPTION" \
    2>&1 | tee -a "$LOG_FILE"
AIDER_EXIT=${PIPESTATUS[0]}

if [[ $AIDER_EXIT -ne 0 ]]; then
    set_status failed
    log_event "aider" "failed" "exit-$AIDER_EXIT"
    "$SCRIPT_DIR/notify-telegram.sh" "❌ *Seabone Agent*: \`$TASK_ID\` failed (exit $AIDER_EXIT)." 2>/dev/null || true
    exit 1
fi

if git diff --quiet && git diff --cached --quiet; then
    set_status no_changes
    log_event "completion" "no_changes" "No diff produced"
    "$SCRIPT_DIR/notify-telegram.sh" "⚠️ *Seabone Agent*: \`$TASK_ID\` finished with no changes." 2>/dev/null || true
    exit 0
fi

if ! run_quality_gates; then
    set_status quality_failed
    log_event "completion" "quality_failed" "Quality gates failed"
    "$SCRIPT_DIR/notify-telegram.sh" "🔴 *Seabone Agent*: \`$TASK_ID\` quality gates failed." 2>/dev/null || true
    exit 2
fi

git add -A

git commit -m "feat($TASK_ID): $DESCRIPTION\n\nAutomated by Seabone agent swarm (aider + $MODEL)"

git push -u origin "$BRANCH"

PR_URL=$(gh pr create \
    --title "[$TASK_ID] $DESCRIPTION" \
    --body "## Summary\nAutomated PR created by Seabone agent swarm.\n\n**Task:** $DESCRIPTION\n**Model:** $MODEL\n**Branch:** \`$BRANCH\`" \
    --head "$BRANCH" 2>&1) || PR_URL="PR creation failed"

if [[ "$PR_URL" == "PR creation failed" ]]; then
    set_status failed
    log_event "completion" "failed" "pr creation failed"
    "$SCRIPT_DIR/notify-telegram.sh" "❌ *Seabone Agent*: \`$TASK_ID\` PR creation failed." 2>/dev/null || true
    exit 1
fi

set_status pr_created
log_event "completion" "pr_created" "$PR_URL"
"$SCRIPT_DIR/notify-telegram.sh" "✅ *Seabone Agent*: \`$TASK_ID\` completed\nPR: $PR_URL" 2>/dev/null || true
exit 0
