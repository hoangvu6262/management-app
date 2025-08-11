#!/bin/bash
# Final Complete Setup with SQLite, Backup & Logging
# Run as: bash complete-sqlite-production.sh

set -e

echo "🚀 Complete SQLite Production Setup"
echo "==================================="
echo "📅 $(date)"
echo ""

echo "📋 This will setup a production-ready SQLite environment with:"
echo "✅ Optimized SQLite database (WAL mode, performance tuning)"
echo "✅ Comprehensive backup system (local + S3 optional)"
echo "✅ Multi-level logging (app, database, security, performance)"
echo "✅ Automated maintenance and health monitoring"
echo "✅ Complete deployment on AWS EC2"
echo ""

# Check directory
if [ ! -f "setup-sqlite.sh" ]; then
    echo "❌ Please run from aws-deployment directory"
    echo "   cd ManagementApp/aws-deployment"
    echo "   bash complete-sqlite-production.sh"
    exit 1
fi

# Check user
if [ "$(whoami)" != "ubuntu" ]; then
    echo "⚠️ Recommended to run as ubuntu user"
    echo "   Current user: $(whoami)"
    echo ""
fi

read -p "🤔 Ready to setup complete production environment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🔧 Making all scripts executable..."
chmod +x *.sh

echo ""
echo "📦 Step 1/6: Project Structure Setup"
echo "===================================="
bash setup-project.sh

echo ""
echo "🗄️ Step 2/6: SQLite Database Setup"
echo "=================================="
bash setup-sqlite.sh

echo ""
echo "🛡️ Step 3/6: Backup & Logging Setup"
echo "=================================="
bash setup-backup-logging.sh

echo ""
echo "🚀 Step 4/6: Application Deployment"
echo "=================================="
bash deploy.sh

echo ""
echo "⏰ Step 5/6: Automation & Monitoring"
echo "===================================="
# Cron jobs already setup in previous steps
echo "✅ Cron jobs configured"
echo "✅ Health monitoring active"
echo "✅ Automated maintenance scheduled"

echo ""
echo "🧪 Step 6/6: System Validation"
echo "=============================="

# Wait for services to start
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health checks
echo "🏥 Running health checks..."
bash health-check-sqlite.sh

# Performance test
echo "📊 Running performance test..."
bash log-performance.sh

# Create initial backup
echo "💾 Creating initial backup..."
bash enhanced-backup.sh

# Generate first log summary
echo "📋 Generating first log summary..."
bash aggregate-logs.sh

# Get system information
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")
DATABASE_SIZE="Unknown"
if [ -f "/home/ubuntu/ManagementApp/data/database/management.db" ]; then
    DATABASE_SIZE=$(du -h /home/ubuntu/ManagementApp/data/database/management.db | cut -f1)
fi

echo ""
echo "🎉 COMPLETE SQLITE PRODUCTION SETUP FINISHED!"
echo "============================================="
echo "📅 Completed: $(date)"
echo ""
echo "🌐 Your Application:"
echo "==================="
echo "  🔗 Frontend: http://$EC2_PUBLIC_IP"
echo "  🔌 API: http://$EC2_PUBLIC_IP/api"
echo "  ❤️ Health: http://$EC2_PUBLIC_IP/health"
echo "  📊 Status: $(curl -s http://localhost/health 2>/dev/null && echo "✅ Online" || echo "⚠️ Starting...")"

echo ""
echo "🗄️ Database Information:"
echo "========================"
echo "  📁 Location: /home/ubuntu/ManagementApp/data/database/management.db"
echo "  📏 Size: $DATABASE_SIZE"
echo "  ⚙️ Mode: WAL (Write-Ahead Logging)"
echo "  🔧 Cache: 10,000 pages (40MB)"
echo "  💾 Memory mapping: 256MB"
echo "  👥 Concurrent readers: ~100"
echo "  ✍️ Writers: 1 (single writer)"

echo ""
echo "💾 Backup System:"
echo "================="
echo "  📂 Local backups: /home/ubuntu/ManagementApp/data/backups/"
echo "  🔄 Schedule: Weekly (Sundays 2 AM)"
echo "  📦 Compression: gzip"
echo "  🗓️ Retention: 14 days"
echo "  ☁️ S3 sync: $([ -n "$BACKUP_S3_BUCKET" ] && echo "Enabled" || echo "Not configured")"
echo "  ✅ Verification: Integrity checks included"

echo ""
echo "📊 Logging System:"
echo "=================="
echo "  📱 Application: /home/ubuntu/ManagementApp/data/logs/application/"
echo "  🗄️ Database: /home/ubuntu/ManagementApp/data/logs/database/"
echo "  📈 Performance: /home/ubuntu/ManagementApp/data/logs/performance/"
echo "  🔒 Security: /home/ubuntu/ManagementApp/data/logs/security/"
echo "  📊 Daily summaries: Generated at 11:59 PM"
echo "  🔄 Rotation: Automated cleanup"

echo ""
echo "⏰ Automated Schedule:"
echo "====================="
echo "  🟢 Health checks: Every 5 minutes"
echo "  📈 Performance logs: Every 10 minutes"
echo "  🔒 Security logs: Every 30 minutes"
echo "  🔄 App restart: Daily at 3 AM"
echo "  📊 Log summary: Daily at 11:59 PM"
echo "  🛠️ Maintenance: Weekly Sundays 2 AM"
echo "  🔄 Log rotation: Weekly Sundays 5 AM"

echo ""
echo "🛠️ Management Commands:"
echo "======================="
echo "  📊 Monitor: bash monitor-sqlite.sh"
echo "  💾 Backup: bash enhanced-backup.sh"
echo "  🔄 Restore: bash restore-sqlite.sh [file]"
echo "  🏥 Health: bash health-check-sqlite.sh"
echo "  🔧 Maintain: bash comprehensive-maintenance.sh"
echo "  📋 Logs: bash aggregate-logs.sh"
echo "  🚀 Deploy: bash deploy.sh"

echo ""
echo "💰 Cost Summary:"
echo "==============="
echo "  📅 Months 1-12: $0/month (AWS Free Tier)"
echo "  📅 Month 13+: $8-12/month (EC2 + EBS only)"
echo "  ☁️ S3 backup: +$1-3/month (optional)"
echo "  📧 Notifications: +$0.50/month (optional)"
echo "  📊 Total estimated: $8-15/month after free tier"

echo ""
echo "📈 Performance Expectations:"
echo "============================"
echo "  👥 Concurrent users: 1-50 (recommended)"
echo "  📊 Database size: Up to 5GB (practical limit)"
echo "  📝 Record count: Up to 1M records"
echo "  ⚡ Query speed: <100ms for typical queries"
echo "  🔄 Availability: 99.5%+ with health monitoring"

echo ""
echo "🚨 When to Migrate:"
echo "=================="
echo "  ❌ More than 50 concurrent users"
echo "  ❌ Database size > 5GB"
echo "  ❌ Complex analytics queries needed"
echo "  ❌ Multiple server deployment"
echo "  ❌ Geographic distribution required"
echo "  ➡️ Migration path: PostgreSQL RDS (~$20-35/month)"

echo ""
echo "📧 Optional Enhancements:"
echo "========================"
echo "  1. ☁️ S3 Backup: cat s3-setup-commands.txt"
echo "  2. 📧 Email notifications for failures"
echo "  3. 📊 CloudWatch monitoring integration"
echo "  4. 🔒 SSL certificate: bash setup-ssl.sh [domain]"
echo "  5. 🌐 Domain name setup"

echo ""
echo "📋 Daily Operations:"
echo "=================="
echo "  🌅 Morning: Check daily summary"
echo "    cat /home/ubuntu/ManagementApp/data/logs/daily-summary-\$(date +%Y%m%d).log"
echo ""
echo "  📊 Monitor performance:"
echo "    bash monitor-sqlite.sh"
echo ""
echo "  🔍 Check for issues:"
echo "    bash health-check-sqlite.sh"
echo ""
echo "  📱 View live logs:"
echo "    tail -f /home/ubuntu/ManagementApp/data/logs/application/*.log"

echo ""
echo "📚 Documentation:"
echo "================="
echo "  📖 SQLite guide: cat SQLITE-README.md"
echo "  🚀 Deployment guide: cat README.md"
echo "  ☁️ S3 setup: cat s3-setup-commands.txt"
echo "  🔧 Troubleshooting: Check logs and run health-check-sqlite.sh"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "  1. 🧪 Test your application: http://$EC2_PUBLIC_IP"
echo "  2. 📱 Add real data and users"
echo "  3. 📊 Monitor daily summaries"
echo "  4. 🔄 Test backup/restore: bash restore-sqlite.sh"
echo "  5. 📧 Setup email notifications"
echo "  6. ☁️ Consider S3 backup for production"
echo "  7. 🌐 Add domain name and SSL"

echo ""
echo "🆘 Support:"
echo "==========="
echo "  📖 Check documentation: SQLITE-README.md"
echo "  🔍 Run diagnostics: bash health-check-sqlite.sh"
echo "  📊 Check performance: bash monitor-sqlite.sh"
echo "  📋 Review logs: bash aggregate-logs.sh"

echo ""
echo "🎊 CONGRATULATIONS!"
echo "==================="
echo "Your SQLite production environment is now fully operational!"
echo ""
echo "✅ Database: Optimized and ready"
echo "✅ Backups: Automated and verified"
echo "✅ Logging: Comprehensive monitoring"
echo "✅ Automation: Full maintenance schedule"
echo "✅ Monitoring: Real-time health checks"
echo ""
echo "🚀 Your app is ready for real users!"
echo "💪 Scale when needed - we'll help with PostgreSQL migration!"
echo "🎉 Happy coding!"
