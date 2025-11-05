# Multi-stage Dockerfile for building the NX monorepo and running the NestJS API
# Uses Debian-slim base to be compatible with Prisma and native modules

FROM node:20-bullseye-slim AS builder
WORKDIR /workspace

# Install dependencies (use package-lock for reproducible installs)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build the api app (nx build will also run prisma generate as configured)
COPY . .

# Build API
RUN npm run build:api --silent

# Use NX prune targets to generate a minimal package.json+lock for the api in dist
# This creates apps/api/dist/package.json and apps/api/dist/package-lock.json
RUN npx nx run @maple-plan/api:prune --silent || true


FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built API
COPY --from=builder /workspace/apps/api/dist ./dist

# Copy prisma schema and migrations so migrations can run inside the container
COPY --from=builder /workspace/apps/api/prisma ./prisma

# Copy the minimal package.json and lock created by the prune step (if present)
COPY --from=builder /workspace/apps/api/dist/package.json ./package.json
COPY --from=builder /workspace/apps/api/dist/package-lock.json ./package-lock.json

# If the prune step wasn't available (older NX), fall back to copying root package.json
# but prefer the pruned package when present
RUN if [ -f package.json ]; then echo "Using dist package.json"; else cp /workspace/package.json ./package.json; fi || true

# Install only production deps for the API package
RUN npm ci --production --silent || npm install --production --silent

# Copy entrypoint script and make it executable
COPY scripts/start-prod.sh /app/scripts/start-prod.sh
RUN chmod +x /app/scripts/start-prod.sh

# Expose port used by the API (falls back to 8080 in code)
EXPOSE 8080

# Default command: run migrations (if DATABASE_URL) then start the app
CMD ["/app/scripts/start-prod.sh"]
