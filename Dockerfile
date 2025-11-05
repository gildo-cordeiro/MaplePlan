# Multi-stage Dockerfile for building the NX monorepo and running the NestJS API
# Uses Debian-slim base to be compatible with Prisma and native modules

FROM node:20-bookworm-slim AS builder
WORKDIR /workspace

# Ensure npm is a modern version (some runners have older npm that mishandles workspace flags)
RUN npm install -g npm@9 --silent

# Install OS build dependencies needed for native modules (argon2, sharp, etc.)
RUN apt-get update && \
	apt-get install -y --no-install-recommends python3 build-essential make g++ ca-certificates && \
	rm -rf /var/lib/apt/lists/*

# Install dependencies (use package-lock for reproducible installs)
COPY package.json package-lock.json ./
# Install dependencies using npm install (more tolerant than npm ci for lockfile drift inside container)
# --no-audit and --no-fund reduce noise; --legacy-peer-deps avoids peer dep failures in some setups
RUN npm install --no-audit --no-fund --legacy-peer-deps --loglevel=verbose

# Copy source and build the api app (nx build will also run prisma generate as configured)
COPY . .

# Build API
RUN npm run build:api --silent

# Use NX prune targets to generate a minimal package.json+lock for the api in dist
# This creates apps/api/dist/package.json and apps/api/dist/package-lock.json
RUN npx nx run @maple-plan/api:prune --silent || true


FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Ensure npm version is modern in the runtime image too (so npm ci / prune steps work if executed)
RUN npm install -g npm@9 --silent

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
