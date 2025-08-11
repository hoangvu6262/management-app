#!/bin/bash
# Complete Backup & Logging Setup
# Run as: bash setup-backup-logging.sh

set -e

echo "🛡️ Complete Backup & Logging Setup for SQLite Production"
echo "======================================================="

# Check if in correct directory
if [ ! -f "setup-sqlite.sh" ]; then
    echo "❌ Please run from aws-deployment directory"
    exit 1
fi

echo ""
echo "📚 What this script will setup:"
echo "==============================="
echo "✅ Enhanced backup system with verification"
echo "✅ Comprehensive logging (app, db, security, performance)"
echo "✅ Automated log rotation and cleanup"
echo "✅ Daily summaries and reporting"
echo "✅ Cron jobs for automation"
echo "✅ S3 backup support (optional)"
echo ""

read -p "🤔 Continue with setup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🗄️ Step 1: Setting up SQLite (if not already done)"
echo "================================================="
if [ ! -f "/home/ubuntu/ManagementApp/server-app/appsettings.Production.json" ]; then
    echo "📋 SQLite not configured, setting up now..."
    bash setup-sqlite.sh
else
    echo "✅ SQLite already configured"
fi

echo ""
echo "📊 Step 2: Setting up Enhanced Logging"
echo "======================================"
bash setup-logging.sh

echo ""
echo "💾 Step 3: Testing Enhanced Backup"
echo "=================================="
chmod +x enhanced-backup.sh

# Test backup
echo "🧪 Testing backup system..."
if [ -f "/home/ubuntu/ManagementApp/data/database/management.db" ]; then
    echo "Database exists, testing backup..."
    bash enhanced-backup.sh
else
    echo "⚠️ Database doesn't exist yet (will be created on first app run)"
    echo "Backup system configured and ready"
fi

echo ""
echo "⏰ Step 4: Updating Automated Maintenance"
echo "========================================="

# Create comprehensive maintenance script
cat > comprehensive-maintenance.sh << 'EOF'
#!/bin/bash
# Comprehensive Maintenance Script

echo "🔧 Starting comprehensive maintenance - $(date)"

# 1. Database maintenance
echo "🗄️ Database maintenance..."
bash maintain-sqlite.sh

# 2. Enhanced backup
echo "💾 Creating enhanced backup..."
bash enhanced-backup.sh

# 3. Log aggregation
echo "📊 Aggregating logs..."
bash aggregate-logs.sh

# 4. Log rotation
echo "🔄 Rotating logs..."
bash rotate-logs.sh

# 5. System cleanup
echo "🧹 System cleanup..."
docker system prune -f

# 6. Health check
echo "🏥 Final health check..."
bash health-check-sqlite.sh

echo "✅ Comprehensive maintenance completed - $(date)"
EOF

chmod +x comprehensive-maintenance.sh

# Update cron for comprehensive maintenance
echo "📅 Setting up comprehensive maintenance schedule..."

# Create new cron configuration
cat > /tmp/comprehensive_cron << EOF
# Health check every 5 minutes
*/5 * * * * cd /home/ubuntu/ManagementApp/aws-deployment && bash health-check-sqlite.sh >> /home/ubuntu/ManagementApp/data/logs/system/health.log 2>&1

# Performance logging every 10 minutes
*/10 * * * * cd /home/ubuntu/ManagementApp/aws-deployment && bash log-performance.sh

# Security logging every 30 minutes
*/30 * * * * cd /home/ubuntu/ManagementApp/aws-deployment && bash log-security.sh

# Daily restart at 3 AM
0 3 * * * cd /home/ubuntu/ManagementApp/aws-deployment && docker-compose -f docker-compose.prod.yml restart

# Daily log aggregation at 11:59 PM
59 23 * * * cd /home/ubuntu/ManagementApp/aws-deployment && bash aggregate-logs.sh

# Weekly comprehensive maintenance on Sundays at 2 AM
0 2 * * 0 cd /home/ubuntu/ManagementApp/aws-deployment && bash comprehensive-maintenance.sh

# Weekly log rotation on Sundays at 5 AM
0 5 * * 0 cd /home/ubuntu/ManagementApp/aws-deployment && bash rotate-logs.sh
EOF

# Apply new crontab
crontab /tmp/comprehensive_cron
rm /tmp/comprehensive_cron

echo ""
echo "🌐 Step 5: Optional S3 Backup Configuration"
echo "==========================================="
echo "📝 To enable S3 backup, set these environment variables:"
echo "   export BACKUP_S3_BUCKET=your-bucket-name"
echo "   export AWS_REGION=us-east-1"
echo "   export NOTIFICATION_EMAIL=your-email@domain.com"
echo ""
echo "📦 S3 setup commands (run if you want S3 backup):"
cat > s3-setup-commands.txt << 'EOF'
# Create S3 bucket for backups
aws s3 mb s3://your-managementapp-backups --region us-east-1

# Set bucket lifecycle policy (optional - for cost optimization)
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-managementapp-backups \
  --lifecycle-configuration file://s3-lifecycle.json

# Set environment variables
echo 'export BACKUP_S3_BUCKET=your-managementapp-backups' >> ~/.bashrc
echo 'export AWS_REGION=us-east-1' >> ~/.bashrc
echo 'export NOTIFICATION_EMAIL=your-email@domain.com' >> ~/.bashrc
source ~/.bashrc
EOF

echo "📄 S3 setup commands saved to: s3-setup-commands.txt"

echo ""
echo "🎉 Backup & Logging Setup Completed!"
echo "===================================="

# Get current status
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

echo ""
echo "📊 System Status:"
echo "================="
echo "🌐 Application: http://$EC2_PUBLIC_IP"
echo "🗄️ Database: SQLite with WAL mode"
echo "💾 Backups: Local + Enhanced (S3 optional)"
echo "📊 Logging: Comprehensive multi-level"
echo "⏰ Automation: Full cron schedule"

echo ""
echo "📁 Directory Structure:"
echo "======================"
echo "ManagementApp/"
echo "├── data/"
echo "│   ├── database/          # SQLite database"
echo "│   ├── backups/           # Local backups"
echo "│   └── logs/"
echo "│       ├── application/   # App logs"
echo "│       ├── database/      # DB query logs"
echo "│       ├── performance/   # Performance metrics"
echo "│       ├── security/      # Security events"
echo "│       └── system/        # System health"
echo "└── aws-deployment/        # Management scripts"

echo ""
echo "🛠️ Available Commands:"
echo "====================="
echo "💾 Backup & Restore:"
echo "   bash enhanced-backup.sh              # Enhanced backup with verification"
echo "   bash backup-sqlite.sh                # Quick backup"
echo "   bash restore-sqlite.sh [file]        # Restore from backup"
echo ""
echo "📊 Monitoring & Logs:"
echo "   bash monitor-sqlite.sh               # Real-time database monitoring"
echo "   bash aggregate-logs.sh               # Generate daily summary"
echo "   cat data/logs/daily-summary-*.log    # View daily reports"
echo "   tail -f data/logs/application/*.log  # Live application logs"
echo ""
echo "🔧 Maintenance:"
echo "   bash comprehensive-maintenance.sh    # Full maintenance routine"
echo "   bash maintain-sqlite.sh              # Database maintenance only"
echo "   bash health-check-sqlite.sh          # Health check"

echo ""
echo "⏰ Automated Schedule:"
echo "====================="
echo "   🟢 Health checks: Every 5 minutes"
echo "   📈 Performance logging: Every 10 minutes"
echo "   🔒 Security logging: Every 30 minutes"
echo "   🔄 Daily restart: 3:00 AM"
echo "   📊 Daily summary: 11:59 PM"
echo "   🛠️ Weekly maintenance: Sunday 2:00 AM"
echo "   🔄 Log rotation: Sunday 5:00 AM"

echo ""
echo "💰 Cost Impact:"
echo "==============="
echo "   📦 Local storage: Included in EC2"
echo "   ☁️ S3 backup (optional): ~$1-3/month"
echo "   📊 Log storage: ~1-5GB (cleaned automatically)"
echo "   ⚡ Performance impact: Minimal (<5% CPU)"

echo ""
echo "🚨 Important Notes:"
echo "=================="
echo "   • Test restore procedures monthly"
echo "   • Monitor log disk usage weekly"
echo "   • Check daily summaries for issues"
echo "   • Update email notifications"
echo "   • Consider S3 backup for production"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "   1. 🚀 Deploy application: bash deploy.sh"
echo "   2. 📧 Configure email notifications"
echo "   3. ☁️ Setup S3 backup (optional): cat s3-setup-commands.txt"
echo "   4. 📊 Monitor daily summaries"
echo "   5. 🧪 Test backup/restore procedures"

echo ""
echo "✅ Your SQLite production environment is now enterprise-ready!"
echo "   with comprehensive backup and logging capabilities! 🎊"
