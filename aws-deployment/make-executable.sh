#!/bin/bash
# Make all deployment scripts executable

echo "🔧 Making all deployment scripts executable..."

chmod +x *.sh

echo "✅ All scripts are now executable!"
echo ""
echo "📋 Available scripts:"
ls -la *.sh | awk '{print "   📄 " $9 " (" $1 ")"}'

echo ""
echo "🚀 Quick start with SQLite:"
echo "   bash setup-with-sqlite.sh"
echo ""
echo "🔍 Individual setup:"
echo "   bash setup-sqlite.sh        # Setup SQLite"
echo "   bash deploy.sh              # Deploy app"
echo "   bash monitor-sqlite.sh      # Monitor database"
