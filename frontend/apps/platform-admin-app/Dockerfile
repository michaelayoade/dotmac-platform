# syntax=docker/dockerfile:1.5
#
# Frontend Dockerfile for Split Repository Structure
#
# Build context should be the split-staging parent directory:
#   docker build -f dotmac-platform/frontend/apps/platform-admin-app/Dockerfile .
#
# The build expects:
#   - dotmac-platform/frontend/apps/platform-admin-app/ (this app)
#   - dotmac-shared/frontend/packages/ (shared UI packages)

ARG PNPM_VERSION=9.12.3

FROM node:20-alpine AS builder
ARG PNPM_VERSION
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8001
# Internal API URL for server-side rewrites (container-to-container)
ARG INTERNAL_API_URL=http://platform-backend:8000
ARG NEXT_PUBLIC_PRODUCT_NAME="DotMac Platform Admin"
ARG NEXT_PUBLIC_PRODUCT_TAGLINE="Control plane for multi-tenant ISPs"
ARG NEXT_PUBLIC_FAVICON=/favicon.ico
ARG NEXT_PUBLIC_MOCK_API=false
ARG NEXT_PUBLIC_USE_MOCK_DATA=false
ARG NEXT_PUBLIC_APP_TYPE=platform-admin
ARG NEXT_PUBLIC_PORTAL_TYPE=admin
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    JWT_SECRET="build-time-jwt-secret-not-used-in-production" \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL} \
    INTERNAL_API_URL=${INTERNAL_API_URL} \
    NEXT_PUBLIC_PRODUCT_NAME=${NEXT_PUBLIC_PRODUCT_NAME} \
    NEXT_PUBLIC_PRODUCT_TAGLINE=${NEXT_PUBLIC_PRODUCT_TAGLINE} \
    NEXT_PUBLIC_FAVICON=${NEXT_PUBLIC_FAVICON} \
    NEXT_PUBLIC_MOCK_API=${NEXT_PUBLIC_MOCK_API} \
    NEXT_PUBLIC_USE_MOCK_DATA=${NEXT_PUBLIC_USE_MOCK_DATA} \
    NEXT_PUBLIC_APP_TYPE=${NEXT_PUBLIC_APP_TYPE} \
    NEXT_PUBLIC_PORTAL_TYPE=${NEXT_PUBLIC_PORTAL_TYPE}

RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate

# Create pnpm workspace structure for split repos
# Copy workspace config from platform app (should define workspace packages)
COPY dotmac-platform/frontend/apps/platform-admin-app/pnpm-workspace.yaml ./
COPY dotmac-platform/frontend/apps/platform-admin-app/package.json ./
COPY dotmac-platform/frontend/apps/platform-admin-app/pnpm-lock.yaml* ./
COPY dotmac-platform/frontend/apps/platform-admin-app/.npmrc* ./

# Copy app package.json
COPY dotmac-platform/frontend/apps/platform-admin-app/package.json apps/platform-admin-app/

# Copy shared packages from dotmac-shared
COPY dotmac-shared/frontend/packages/graphql/package.json shared/packages/graphql/
COPY dotmac-shared/frontend/packages/headless/package.json shared/packages/headless/
COPY dotmac-shared/frontend/packages/primitives/package.json shared/packages/primitives/
COPY dotmac-shared/frontend/packages/providers/package.json shared/packages/providers/
COPY dotmac-shared/frontend/packages/rbac/package.json shared/packages/rbac/
COPY dotmac-shared/frontend/packages/ui/package.json shared/packages/ui/
COPY dotmac-shared/frontend/packages/features/package.json shared/packages/features/
COPY dotmac-shared/frontend/packages/eslint-config/package.json shared/packages/eslint-config/
COPY dotmac-shared/frontend/packages/eslint-plugin/package.json shared/packages/eslint-plugin/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy the rest of the source code
COPY dotmac-platform/frontend/apps/platform-admin-app ./apps/platform-admin-app
COPY dotmac-shared/frontend/packages ./shared/packages

# Copy any root config files needed for build
COPY dotmac-platform/frontend/apps/platform-admin-app/tsconfig.json ./tsconfig.json 2>/dev/null || true
COPY dotmac-platform/frontend/apps/platform-admin-app/postcss.config.js ./postcss.config.js 2>/dev/null || true
COPY dotmac-platform/frontend/apps/platform-admin-app/tailwind.config.ts ./tailwind.config.ts 2>/dev/null || true

# Build the platform admin app from its directory
WORKDIR /app/apps/platform-admin-app
RUN pnpm build

# Reset workdir for runner stage
WORKDIR /app

FROM node:20-alpine AS runner
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_PRODUCT_NAME
ARG NEXT_PUBLIC_PRODUCT_TAGLINE
ARG NEXT_PUBLIC_FAVICON
ARG NEXT_PUBLIC_MOCK_API
ARG NEXT_PUBLIC_USE_MOCK_DATA
ARG NEXT_PUBLIC_APP_TYPE
ARG NEXT_PUBLIC_PORTAL_TYPE
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL} \
    NEXT_PUBLIC_PRODUCT_NAME=${NEXT_PUBLIC_PRODUCT_NAME} \
    NEXT_PUBLIC_PRODUCT_TAGLINE=${NEXT_PUBLIC_PRODUCT_TAGLINE} \
    NEXT_PUBLIC_FAVICON=${NEXT_PUBLIC_FAVICON} \
    NEXT_PUBLIC_MOCK_API=${NEXT_PUBLIC_MOCK_API} \
    NEXT_PUBLIC_USE_MOCK_DATA=${NEXT_PUBLIC_USE_MOCK_DATA} \
    NEXT_PUBLIC_APP_TYPE=${NEXT_PUBLIC_APP_TYPE} \
    NEXT_PUBLIC_PORTAL_TYPE=${NEXT_PUBLIC_PORTAL_TYPE}

RUN addgroup -g 1001 nodejs && adduser -D -G nodejs nodejs

# Copy the standalone build output
COPY --from=builder /app/apps/platform-admin-app/.next/standalone ./
COPY --from=builder /app/apps/platform-admin-app/.next/static ./apps/platform-admin-app/.next/static
COPY --from=builder /app/apps/platform-admin-app/public ./apps/platform-admin-app/public

USER nodejs

EXPOSE 3000

CMD ["node", "apps/platform-admin-app/server.js"]
