#!/usr/bin/env bash
set -euo pipefail

# deploy_to_render.sh
# Usage: rely on these environment variables provided by the GH Actions step that calls this script:
#   RENDER_API_KEY, RENDER_SERVICE_ID, RENDER_DEPLOY_HOOK, IMAGE_TAG

echo "[deploy] starting deploy_to_render.sh"

update_render_api() {
  echo "[deploy] updating Render service ${RENDER_SERVICE_ID} -> ${IMAGE_TAG} via API"
  resp=$(curl -sS -w "%{http_code}" -X PATCH "https://api.render.com/v1/services/${RENDER_SERVICE_ID}" \
    -H "Authorization: Bearer ${RENDER_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"dockerImage\":{\"image\":\"${IMAGE_TAG}\"}}" ) || true

  http="${resp: -3}"
  body="${resp:: -3}"
  echo "[deploy] HTTP: ${http:-N/A}"
  echo "[deploy] Body: ${body:-<empty>}"

  if [ -n "$http" ] 2>/dev/null && [ "$http" -ge 200 ] 2>/dev/null && [ "$http" -lt 300 ] 2>/dev/null; then
    return 0
  fi
  return 1
}

# Try API update first when credentials are present
if [ -n "${RENDER_API_KEY:-}" ] && [ -n "${RENDER_SERVICE_ID:-}" ]; then
  if update_render_api; then
    echo "[deploy] Render service updated; waiting briefly for deploy to start"
    sleep 3
    echo "[deploy] done"
    exit 0
  else
    echo "[deploy] Render API update did not return success; falling back to Deploy Hook" >&2
  fi
fi

# Fallback to deploy hook if provided
if [ -n "${RENDER_DEPLOY_HOOK:-}" ]; then
  echo "[deploy] Triggering Render deploy via Deploy Hook"
  http=$(curl -sS -o render-deploy-response.json -w "%{http_code}" -X POST "${RENDER_DEPLOY_HOOK}" || echo "000")
  echo "[deploy] Deploy hook HTTP: ${http:-N/A}"
  cat render-deploy-response.json || true
  if [ "$http" -ge 200 ] 2>/dev/null && [ "$http" -lt 300 ] 2>/dev/null; then
    echo "[deploy] Deploy hook triggered successfully"
    echo "[deploy] done"
    exit 0
  else
    echo "[deploy] Deploy hook failed (HTTP ${http:-N/A})" >&2
    exit 1
  fi
fi

echo "[deploy] No Render deploy method available. Set RENDER_API_KEY+RENDER_SERVICE_ID or RENDER_DEPLOY_HOOK secrets." >&2
exit 1
