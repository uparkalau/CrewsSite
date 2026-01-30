#!/usr/bin/env bash
set -e

echo "🔍 Verifying Firebase environment variables"

REQUIRED=(
  VITE_FIREBASE_API_KEY
  VITE_FIREBASE_AUTH_DOMAIN
  VITE_FIREBASE_PROJECT_ID
  VITE_FIREBASE_STORAGE_BUCKET
  VITE_FIREBASE_MESSAGING_SENDER_ID
  VITE_FIREBASE_APP_ID
)

MISSING=()

for v in "${REQUIRED[@]}"; do
  if ! grep -q "^${v}=" .env.local 2>/dev/null; then
    MISSING+=("$v")
  fi
done

if [ ${#MISSING[@]} -ne 0 ]; then
  echo "❌ Missing environment variables in .env.local: ${MISSING[*]}"
  exit 1
fi

echo "✅ All required Firebase env vars present in .env.local"
echo "You can now run: npm run dev"
