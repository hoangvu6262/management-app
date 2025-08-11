#!/bin/bash
# Quick Setup for SQLite Production
# Run as: bash quick-setup-sqlite.sh

set -e

echo "🚀 Quick SQLite Production Setup"
echo "==============================="

# Check if we're in the right directory
if [ ! -f "setup-sqlite.sh" ]; then
    echo "❌ Please run this script from the aws-deployment directory"
    echo "   cd ManagementApp/aws-deployment"
    echo "   bash quick-setup-sqlite.sh"
    exit 1
fi

# Make all scripts executable first
echo "🔧 Making scripts executable..."
chmod +x *.sh

# Run SQLite setup
echo ""
echo "🗄️ Step 1: Setting up SQLite..."
bash setup-sqlite.sh

# Test the setup
echo ""
echo "🧪 Step 2: Testing setup..."
bash health-check-sqlite.sh

# Show summary
echo ""
echo "📋 Step 3: Setup Summary"
echo "======================="

# Check if database directory exists
if [ -d "/home/ubuntu/ManagementApp/data/database" ]; then
    echo "✅ Database directory created"
else
    echo "⚠️  Database directory not found (will be created on first run)"
fi

# Check if scripts exist
SCRIPTS=("backup-sqlite.sh" "restore-sqlite.sh" "maintain-sqlite.sh" "monitor-sqlite.sh" "health-check-sqlite.sh")
echo "✅ Management scripts created:"
for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo "   📜 $script"
    else
        echo "   ❌ $script (missing)"
    fi
done

# Check configuration files
echo ""
echo "📄 Configuration files:"
if [ -f "../server-app/appsettings.Production.json" ]; then
    echo "   ✅ appsettings.Production.json (with optimized SQLite settings)"
else
    echo "   ❌ appsettings.Production.json (missing)"
fi

echo ""
echo "🎯 Quick Commands:"
echo "================="
echo "🚀 Deploy app:        bash deploy.sh"
echo "📊 Monitor database:   bash monitor-sqlite.sh"
echo "💾 Backup database:   bash backup-sqlite.sh"
echo "🏥 Health check:      bash health-check-sqlite.sh"
echo "🔧 Maintenance:       bash maintain-sqlite.sh"

echo ""
echo "✅ SQLite setup completed! Ready to deploy! 🎉"
