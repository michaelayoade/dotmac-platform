# DotMac Platform — Frappe Cloud Feature Parity Roadmap

## Current State Summary

DotMac already has strong coverage across core areas:

| Category | DotMac Status | Parity |
|---|---|---|
| Sites (instances) | Full lifecycle, domains, SSL, deploy pipeline | ~90% |
| Servers | CRUD, SSH pool, health checks | ~70% |
| Backups/DR | Scheduled, retention, restore, test | ~85% |
| Notifications | In-app + webhooks | ~50% |
| Auth/Teams/RBAC | JWT, MFA, roles, permissions, orgs | ~85% |
| Monitoring | Health polling, alerts, usage, OTel | ~70% |
| Security | Audit, secret rotation, SSH keys, CSRF | ~80% |
| Deployment | 10-step pipeline, batch, rolling, canary | ~90% |
| Dev Tools | Log viewer, SSH keys | ~30% |
| CI/CD (Git) | Git repos, releases | ~40% |
| Billing/Marketplace | Plans + usage metering (no payments) | ~20% |
| Server Scaling | Single-server only | ~10% |

---

## Phase 1 — CI/CD & Auto-Deploy (High Impact, Builds on Existing)

DotMac has `GitRepository` and `AppRelease` models but lacks the deploy-on-push loop.

| Feature | Description |
|---|---|
| **GitHub webhook receiver** | Endpoint to receive push events, validate HMAC signature |
| **Auto-deploy triggers** | Match branch to instance, queue `deploy_instance` task on push |
| **Branch-based deployments** | Per-instance branch pinning with UI selector |
| **Deploy status callbacks** | POST deploy result back to GitHub commit status API |
| **Build log streaming** | Already exists — wire into webhook notification on completion |

**Files to create/modify**: new `app/api/github_webhook.py`, modify `deploy_service.py`, `git_repo_service.py`, new Celery task

---

## Phase 2 — Multi-Channel Notifications (Quick Win)

DotMac has `Notification` model and `WebhookEndpoint` but no Slack/Telegram/email preference system.

| Feature | Description |
|---|---|
| **NotificationChannel model** | Store per-user channel configs (email, Slack webhook URL, Telegram bot) |
| **Notification preferences** | Per-user settings: which events go to which channels |
| **Slack integration** | Send formatted messages via Slack incoming webhooks |
| **Telegram integration** | Send messages via Telegram Bot API |
| **Email notifications** | Extend existing `email.py` service for notification dispatch |
| **Notification dispatcher** | Route `Notification` records to configured channels |

**Files to create/modify**: new model `NotificationChannel`, new `notification_dispatch_service.py`, extend `notification_service.py`

---

## Phase 3 — Billing & Payments (Revenue Critical)

DotMac has `Plan`, `UsageRecord`, and `SignupRequest` but no payment processing.

| Feature | Description |
|---|---|
| **Stripe integration** | Customer creation, subscription management, payment methods |
| **Invoice model & generation** | Monthly invoice generation from usage records |
| **Plan upgrade/downgrade** | Proration logic, immediate vs end-of-cycle |
| **Usage-to-invoice pipeline** | Celery task: aggregate `UsageRecord` → generate invoice |
| **Payment webhooks** | Stripe webhook handler for payment success/failure |
| **Dunning flow** | Failed payment → email reminder → suspend after grace period |
| **Trial management** | Enhance existing trial expiry with upgrade prompts, trial extensions |
| **Billing dashboard (web)** | Invoice history, payment methods, current plan, usage vs limits |

**Files to create/modify**: new models `Invoice`, `Payment`, `Subscription`; new `billing_service.py`, `stripe_service.py`; new web routes + templates

---

## Phase 4 — Dev Tools & Console Access (Developer UX)

DotMac has log streaming but no interactive access.

| Feature | Description |
|---|---|
| **Web terminal (xterm.js)** | Browser-based terminal via WebSocket → SSH to container |
| **Database console** | `psql` access via web terminal with read-only option |
| **Redis console** | `redis-cli` access via web terminal |
| **Time-limited SSH certificates** | Generate short-lived certs (6hr like Frappe) instead of permanent keys |
| **Container process viewer** | `docker ps` / `docker stats` output in UI |
| **Environment variable editor** | Edit instance `.env` config from the UI with validation |

**Files to create/modify**: new WebSocket endpoint, new `console_service.py`, xterm.js frontend, modify `ssh_service.py`

---

## Phase 5 — Site Analytics & Dashboards (Visibility)

DotMac has `HealthCheck` and `UsageRecord` but no request-level analytics.

| Feature | Description |
|---|---|
| **Request log ingestion** | Parse nginx/caddy access logs, store request metrics |
| **RequestMetric model** | Path, method, status, duration, CPU time per request |
| **Request dashboard** | Volume/min, p50/p95/p99 latency, error rates (Chart.js) |
| **Slow query log** | Ingest PostgreSQL slow query log from instances |
| **Background job analytics** | Celery task duration/failure rate dashboards |
| **CPU budget visualization** | Daily CPU time vs plan limit chart (like Frappe) |
| **Storage breakdown** | DB size, file storage, log size per instance |

**Files to create/modify**: new model `RequestMetric`, new `analytics_service.py`, new Celery ingestion tasks, new dashboard templates

---

## Phase 6 — Server Scaling & Multi-Region (Infrastructure)

DotMac is single-server-per-instance today.

| Feature | Description |
|---|---|
| **Server plans/tiers** | Define resource tiers (CPU, RAM, storage) per server |
| **Vertical scaling** | Change server plan, trigger resize operation |
| **Instance migration** | Move instance between servers (backup → restore → DNS switch) |
| **Region model** | Group servers by region, region-aware instance creation |
| **Multi-server deployments** | Deploy same instance to multiple app servers behind load balancer |
| **Auto-scaling (stretch)** | CPU-triggered secondary server start/stop |

**Files to create/modify**: new models `Region`, `ServerPlan`; modify `server_service.py`, `deploy_service.py`, `server_selection.py`

---

## Phase 7 — App Marketplace (Platform Play)

DotMac has `AppCatalogItem` but no third-party publishing.

| Feature | Description |
|---|---|
| **App listing model** | Publisher, description, screenshots, pricing, license |
| **Publisher onboarding** | GitHub connect, app submission, review workflow |
| **App installation flow** | One-click install to instance from marketplace |
| **App ratings & reviews** | User ratings with moderation |
| **Revenue sharing** | Track installs, calculate payouts, integrate with billing |
| **Marketplace UI** | Browse, search, filter, install — public-facing pages |

**Files to create/modify**: new models `MarketplaceApp`, `AppReview`, `PublisherAccount`; new services + web routes

---

## Phase 8 — Security Hardening (Enterprise)

| Feature | Description |
|---|---|
| **IP allowlisting** | Per-instance and per-server IP restrictions |
| **Backup encryption** | Fernet/AES encryption for backup files at rest |
| **2FA enforcement** | Org-level policy to require MFA for all members |
| **Session geofencing** | Alert/block logins from unusual locations |
| **Vulnerability scanning** | Periodic container image scanning (Trivy integration) |
| **Compliance dashboard** | ISO 27001 / SOC 2 control status overview |

---

## Priority Matrix

```
Impact ↑
         │  P3 Billing ●          P1 CI/CD ●
         │
         │  P6 Scaling ●    P5 Analytics ●
         │
         │  P7 Marketplace ●   P4 Dev Tools ●
         │
         │  P8 Security ●    P2 Notifications ●
         │
         └──────────────────────────────────→ Effort
              Low                        High
```

**Recommended order**: P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8

- **P1 (CI/CD)** — Highest leverage, builds on existing git infra, essential for developer adoption
- **P2 (Notifications)** — Quick win, small scope, improves ops immediately
- **P3 (Billing)** — Revenue-critical, required before scaling users
- **P4 (Dev Tools)** — Key differentiator, developers expect console access
- **P5 (Analytics)** — Visibility drives trust and upgrades
- **P6 (Scaling)** — Infrastructure investment, needed for growth
- **P7 (Marketplace)** — Platform play, requires ecosystem maturity first
- **P8 (Security)** — Incremental hardening, DotMac already has strong foundations

---

## Frappe Cloud Reference

Key Frappe Cloud specs used for benchmarking:

- **Sites**: Wizard creation, 5 lifecycle states (active/inactive/suspended/deactivated/archived), unlimited custom domains, auto-SSL, site config editor
- **Servers**: Shared/private bench/dedicated/unified tiers, AWS EC2 + OCI, hybrid (BYOS), auto-scaling (beta)
- **Backups**: Daily automated, onsite (physical) + offsite (S3), tiered retention (7 daily / 4 weekly / 12 monthly / 10 yearly), opt-in Fernet encryption
- **Notifications**: Email, Slack, Telegram, in-app, webhooks; per-user channel preferences; tiered delivery
- **Dev Tools**: SSH (6hr certs, private bench only), bench console, MariaDB console, Redis console, supervisor, GitHub auto-deploy
- **Billing**: CPU-time metering (not per-user), Stripe + PayPal, monthly invoicing, dunning, 14-day trials
- **Teams**: Deny-by-default RBAC, resource-level access (sites, benches, servers), role-based permissions (beta)
- **Monitoring**: Request volume/CPU/latency per site, background job analytics, slow query analysis, uptime pings every 3min, storage breakdown
- **CI/CD**: GitHub integration, branch selection, auto-deploy on push, deploy stage visibility
- **Security**: Auto-SSL, 4096-bit certs on request, VPC isolation, certificate-based SSH, IP allowlisting, ISO 27001 + SOC 2 certified
- **Marketplace**: 150+ apps, open-source only, 80/20 revenue split after $500, app ratings
- **Scale**: 600+ servers, 21k+ sites, 13 global clusters, ~$390k MRR
