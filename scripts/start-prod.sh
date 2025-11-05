#!/bin/sh
set -e

echo "Starting container: running migrations if DATABASE_URL present..."

if [ -n "${DATABASE_URL}" ]; then
  echo "DATABASE_URL found — running Prisma migrations"
  # Use the prisma cli installed in node_modules (prisma must be a dependency)
  npx prisma migrate deploy --schema=/app/prisma/schema.prisma || {
    echo "Prisma migrate deploy failed" >&2
    exit 1
  }
else
  echo "DATABASE_URL not set — skipping migrations"
fi

echo "Starting NestJS app"
exec node dist/main.js
