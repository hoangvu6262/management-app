#!/bin/bash
# Script để untrack files đã được tracked nhưng nên được ignored

echo "🧹 Removing tracked files that should be ignored..."

# Stop tracking specific file types mà thường bị miss
echo "Removing common files that should be ignored..."

# Node.js files
git rm -r --cached node_modules/ 2>/dev/null || echo "node_modules not tracked"
git rm --cached package-lock.json 2>/dev/null || echo "package-lock.json not tracked"
git rm --cached client-app/.env 2>/dev/null || echo "client-app/.env not tracked"
git rm --cached client-app/.env.local 2>/dev/null || echo "client-app/.env.local not tracked"
git rm --cached client-app/.env.development 2>/dev/null || echo "client-app/.env.development not tracked"
git rm --cached client-app/.env.production 2>/dev/null || echo "client-app/.env.production not tracked"
git rm -r --cached client-app/.next/ 2>/dev/null || echo "client-app/.next not tracked"
git rm -r --cached client-app/node_modules/ 2>/dev/null || echo "client-app/node_modules not tracked"

# .NET files
git rm -r --cached server-app/bin/ 2>/dev/null || echo "server-app/bin not tracked"
git rm -r --cached server-app/obj/ 2>/dev/null || echo "server-app/obj not tracked"
git rm --cached server-app/management.db 2>/dev/null || echo "management.db not tracked"
git rm --cached server-app/appsettings.Production.json 2>/dev/null || echo "Production settings not tracked"

# Docker files that shouldn't be tracked
git rm --cached docker-compose.override.yml 2>/dev/null || echo "docker-compose.override.yml not tracked"

# AWS and deployment files
git rm --cached aws-deployment/.env 2>/dev/null || echo "aws-deployment/.env not tracked"
git rm -r --cached .aws/ 2>/dev/null || echo ".aws not tracked"

# OS files
git rm --cached .DS_Store 2>/dev/null || echo ".DS_Store not tracked"
find . -name ".DS_Store" -exec git rm --cached {} \; 2>/dev/null || true

# Log files
git rm -r --cached logs/ 2>/dev/null || echo "logs not tracked"
find . -name "*.log" -exec git rm --cached {} \; 2>/dev/null || true

echo ""
echo "✅ Finished removing tracked files"
echo "💡 Now run: git commit -m 'Remove tracked files that should be ignored'"
echo "🔍 Check status: git status"
