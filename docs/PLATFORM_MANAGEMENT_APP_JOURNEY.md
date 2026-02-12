# DotMac Platform Management App Journey
## Platform Control Plane - User Documentation

---

## Table of Contents

1. [Authentication & Access](#1-authentication--access)
2. [Landing & Navigation](#2-landing--navigation)
3. [Dashboard](#3-dashboard)
4. [Instances](#4-instances)
5. [Servers](#5-servers)
6. [Catalog](#6-catalog)
7. [Domains](#7-domains)
8. [People](#8-people)
9. [RBAC](#9-rbac)
10. [Secrets & SSH Keys](#10-secrets--ssh-keys)
11. [Git Repositories](#11-git-repositories)
12. [Webhooks](#12-webhooks)
13. [Alerts & Notifications](#13-alerts--notifications)
14. [Audit & Observability](#14-audit--observability)
15. [DR & Drift](#15-dr--drift)
16. [Approvals](#16-approvals)
17. [Scheduler](#17-scheduler)
18. [Maintenance](#18-maintenance)
19. [Usage & Billing](#19-usage--billing)
20. [Platform Settings](#20-platform-settings)

---

## 1. Authentication & Access

### Login (`/login`)
The user arrives at a branded login page with organization name and logo.

**Fields:**
- Username or email address
- Password

**Flow:**
1. User enters credentials and submits
2. System authenticates via `POST /login`
3. On success, access/refresh cookies are set (HTTP-only)
4. User is redirected to the dashboard

**Additional screens:**
- **Forgot Password** (`/auth/password-reset-request`) - request a reset link
- **Reset Password** (`/auth/reset-password`) - set a new password via token link

---

## 2. Landing & Navigation

### Landing (`/`)
Public landing page summarizing the control plane and providing a sign-in CTA.

### Global Navigation
- Authenticated users are routed to the dashboard
- Sidebar navigation groups operational areas (instances, servers, settings, etc.)
- Header exposes quick access to notifications and user actions

---

## 3. Dashboard

### Dashboard (`/dashboard`)
Operational snapshot of the platform and instances.

**Common content:**
- Health/availability stats
- Instance status table
- Quick actions (create new instance)

---

## 4. Instances

### Instance List (`/instances`)
- Search and filter instance inventory
- Status and health indicators
- Navigate to instance details

### Create/Update Instance (`/instances/new`, `/instances/{id}`)
- Configure instance settings
- Associate repositories and deployment configuration

### Instance Detail & Deploy Logs (`/instances/{id}`, `/instances/{id}/deploy-log`)
- Status, configuration summary, and activity
- Streaming or paged deploy output

---

## 5. Servers

### Server List (`/servers`)
- Inventory of registered server hosts

### Add Server (`/servers/new`)
- Register a new host and connection parameters

### Server Detail (`/servers/{id}`)
- Host metadata, status, and related instances

---

## 6. Catalog

### Catalog (`/catalog`)
- Curated templates or blueprints for provisioning
- Launch new instances from a catalog item

---

## 7. Domains

### Domains (`/domains`)
- Manage tenant domains and routing
- Configure domain mappings and status

---

## 8. People

### People List (`/people`)
- Directory of users and operators

### Person Detail (`/people/{id}`)
- Role assignments and account metadata

---

## 9. RBAC

### RBAC (`/rbac`)
- Manage roles and permissions
- Assign privileges aligned to platform operations

---

## 10. Secrets & SSH Keys

### Secrets (`/secrets`)
- Encrypted secrets management for deployments and integrations

### SSH Keys (`/ssh-keys`)
- Upload and manage keys for server/instance access

---

## 11. Git Repositories

### Git Repos (`/git-repos`)
- Configure repositories used for builds and deployments

---

## 12. Webhooks

### Webhooks (`/webhooks`)
- Configure outbound webhooks for platform events

### Deliveries (`/webhooks/deliveries`)
- Inspect webhook delivery history and status

---

## 13. Alerts & Notifications

### Alerts (`/alerts`)
- Operational alerts and system warnings

### Notifications (`/notifications`)
- User-facing notifications panel

---

## 14. Audit & Observability

### Audit Log (`/audit`)
- Audit trail of sensitive changes

### Audit Detail (`/audit/{id}`)
- Actor, action, and payload inspection

### Logs (`/observability`)
- Instance logs and operational diagnostics

---

## 15. DR & Drift

### DR (`/dr`)
- Disaster recovery status and snapshots

### Drift (`/drift`)
- Configuration drift detection and reports

---

## 16. Approvals

### Approvals (`/approvals`)
- Two-person approval workflow for sensitive operations

---

## 17. Scheduler

### Scheduler (`/scheduler`)
- Scheduled jobs and execution status

---

## 18. Maintenance

### Maintenance (`/maintenance`)
- Maintenance windows and system operations

---

## 19. Usage & Billing

### Usage (`/usage`)
- Per-instance usage metrics and billing summaries

---

## 20. Platform Settings

### Settings (`/settings`)
- Platform-level configuration
- Security and operational defaults

