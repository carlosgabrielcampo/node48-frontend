#!/usr/bin/env bash
set -euo pipefail

echo "▶ Deploying to Vercel"

# --- Auth resolution ---------------------------------------------------------

if [[ -n "${VERCEL_OIDC_TOKEN:-}" ]]; then
  echo "▶ Using OIDC token (CI)"
  VERCEL_AUTH_TOKEN="$VERCEL_OIDC_TOKEN"
elif [[ -n "${VERCEL_TOKEN:-}" ]]; then
  echo "▶ Using classic Vercel token (local)"
  VERCEL_AUTH_TOKEN="$VERCEL_TOKEN"
else
  echo "❌ Missing auth token."
  echo "Set one of:"
  echo "  - VERCEL_OIDC_TOKEN (CI only)"
  echo "  - VERCEL_TOKEN (local dev)"
  exit 1
fi

: "${VERCEL_ORG_ID:?Missing VERCEL_ORG_ID}"
: "${VERCEL_PROJECT_ID:?Missing VERCEL_PROJECT_ID}"

# --- Build -------------------------------------------------------------------

npm ci
npm run build

# --- Deploy ------------------------------------------------------------------

npx vercel pull \
  --yes \
  --environment=production \
  --token="$VERCEL_AUTH_TOKEN"

npx vercel deploy \
  --prebuilt \
  --prod \
  --token="$VERCEL_AUTH_TOKEN"

echo "✅ Vercel deployment complete"