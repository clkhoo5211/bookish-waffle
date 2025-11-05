#!/bin/bash
set -e

echo "🏗️  Building Next.js app for static export..."
echo ""

NEXT_PUBLIC_BASE_PATH=/bookish-waffle npm run build

if [ -d "out" ]; then
  echo ""
  echo "✅ Static export created in ./out directory"
  ls -lah out/ | head -10
else
  echo ""
  echo "❌ ERROR: out directory not created!"
  echo "Build may have failed or export not configured correctly"
  exit 1
fi
