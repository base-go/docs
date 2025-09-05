#!/bin/bash

# Base Framework Documentation - Caprover Deployment Script
# Usage: ./deploy-caprover.sh [app-name]

set -e

APP_NAME=${1:-"base-docs"}
CAPROVER_URL=${CAPROVER_URL:-"https://captain.yourdomain.com"}

echo "🚀 Deploying Base Framework Documentation to Caprover..."
echo "App: $APP_NAME"
echo "Caprover: $CAPROVER_URL"

# Ensure we're in the docs directory
if [[ ! -f "captain-definition" ]]; then
    echo "❌ Error: captain-definition not found. Are you in the docs directory?"
    exit 1
fi

# Check if caprover CLI is installed
if ! command -v caprover &> /dev/null; then
    echo "❌ Caprover CLI not found. Installing..."
    npm install -g caprover
fi

# Build locally first (optional - can be done in container)
echo "🔨 Building documentation locally..."
if command -v bun &> /dev/null; then
    bun install
    bun run docs:build
else
    npm install
    npm run docs:build
fi

# Deploy to Caprover
echo "📦 Deploying to Caprover..."
caprover deploy -d

echo "✅ Deployment completed!"
echo "📖 Your documentation should be available at: https://$APP_NAME.yourdomain.com"
echo ""
echo "🔧 Post-deployment checklist:"
echo "  1. Verify clean URLs work: /docs/authentication"
echo "  2. Check .md redirects work: /docs/authentication.md → /docs/authentication"
echo "  3. Test OG images: /og/authentication.png"
echo "  4. Verify sitemap.xml is accessible"
echo "  5. Check robots.txt is served correctly"