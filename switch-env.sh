#!/bin/bash

# Environment Switcher Script
# Usage: ./switch-env.sh [local|prod|status]

case "$1" in
  "local")
    if [ -f ".env.local" ]; then
      cp .env.local .env
      echo "✅ Switched to LOCAL environment"
      echo "📡 API URL: http://localhost:4000"
      echo "🔧 Make sure your local backend is running on port 4000"
    else
      echo "❌ .env.local file not found"
      echo "📝 Creating .env.local template..."
      cat > .env.local << EOF
# Local Development Environment
VITE_API_URL=http://localhost:4000
VITE_DEV_MODE=true
VITE_DEBUG_API=true
EOF
      echo "✅ Created .env.local template. Please configure it and run again."
    fi
    ;;
  "prod")
    echo "VITE_API_URL=https://market-whales.onrender.com" > .env
    echo "VITE_DEV_MODE=false" >> .env
    echo "✅ Switched to PRODUCTION environment"
    echo "📡 API URL: https://market-whales.onrender.com"
    ;;
  "status")
    if [ -f ".env" ]; then
      echo "📊 Current Environment Status:"
      echo "================================"
      current_url=$(grep VITE_API_URL .env | cut -d'=' -f2)
      if [[ "$current_url" == *"localhost"* ]]; then
        echo "🏠 Environment: LOCAL"
        echo "📡 API URL: $current_url"
        echo "🔧 Backend: Local development server"
      else
        echo "🌐 Environment: PRODUCTION"
        echo "📡 API URL: $current_url"
        echo "☁️ Backend: Remote production server"
      fi
      echo "================================"
    else
      echo "❌ No .env file found"
      echo "Run './switch-env.sh local' or './switch-env.sh prod' to set up environment"
    fi
    ;;
  *)
    echo "🔧 Environment Switcher for MarketWhales Dashboard"
    echo "=================================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  local     Switch to local development environment (localhost:4000)"
    echo "  prod      Switch to production environment (market-whales.onrender.com)"
    echo "  status    Show current environment configuration"
    echo ""
    echo "Examples:"
    echo "  $0 local    # Switch to local backend"
    echo "  $0 prod     # Switch to production backend"
    echo "  $0 status   # Check current environment"
    echo ""
    echo "NPM Scripts (alternative):"
    echo "  npm run env:local   # Switch to local"
    echo "  npm run env:prod    # Switch to production"
    echo "  npm run env:status  # Check status"
    ;;
esac
