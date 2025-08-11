#!/bin/bash
# Complete Setup with SQLite
# Run as: bash setup-with-sqlite.sh

set -e

echo "🚀 Complete ManagementApp Setup with SQLite"
echo "============================================"

# Check directory
if [ ! -f "setup-sqlite.sh" ]; then
    echo "❌ Please run from aws-deployment directory"
    exit 1
fi

# Check if running as ubuntu user
if [ "$(whoami)" != "ubuntu" ]; then
    echo "⚠️  Recommended to run as ubuntu user"
    echo "   Current user: $(whoami)"
fi

echo ""
echo "📁 Step 1: Project Structure Setup"
echo "=================================="
bash setup-project.sh

echo ""
echo "🗄️ Step 2: SQLite Database Setup"
echo "================================"
bash setup-sqlite.sh

echo ""
echo "🚀 Step 3: Application Deployment"
echo "================================="
bash deploy.sh

echo ""
echo "⏰ Step 4: Automation Setup"
echo "=========================="
bash setup-cron.sh

echo ""
echo "💾 Step 5: Initial Backup"
echo "========================"
bash backup-sqlite.sh

echo ""
echo "🎉 Complete Setup Finished!"
echo "==========================="

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

echo ""
echo "📍 Your Application:"
echo "  🌐 Frontend: http://$EC2_PUBLIC_IP"
echo "  🔗 API: http://$EC2_PUBLIC_IP/api"
echo "  ❤️ Health: http://$EC2_PUBLIC_IP/health"

echo ""
echo "🛠️ SQLite Management:"
echo "  📊 Monitor: bash monitor-sqlite.sh"
echo "  💾 Backup: bash backup-sqlite.sh"
echo "  🔧 Maintain: bash maintain-sqlite.sh"
echo "  🏥 Health: bash health-check-sqlite.sh"

echo ""
echo "📋 Database Info:"
echo "  📁 Location: /home/ubuntu/ManagementApp/data/database/management.db"
echo "  🔄 Mode: WAL (Write-Ahead Logging)"
echo "  📈 Optimized for: 1-50 concurrent users"
echo "  💾 Good for: <5GB data, <1M records"

echo ""
echo "🔮 Future Migration:"
echo "  When you need more scale:"
echo "  • PostgreSQL RDS (~$15-25/month)"
echo "  • Automated migration scripts available"
echo "  • Contact for upgrade assistance"

echo ""
echo "🎊 Happy coding with your production SQLite setup!"
