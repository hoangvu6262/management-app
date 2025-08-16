#!/bin/bash
# Delete files one by one

cd /Users/caovu/Work/ManagementApp/aws-deployment

echo "🧹 Deleting unnecessary files..."

# Remove files
rm -f complete-deploy.sh
rm -f complete-sqlite-production.sh  
rm -f deploy-optimized.sh
rm -f deploy.sh
rm -f docker-compose.micro.yml
rm -f docker-compose.prod.yml
rm -f enhanced-backup.sh
rm -f make-executable.sh
rm -f monitor.sh
rm -f quick-setup-sqlite.sh
rm -f setup-backup-logging.sh
rm -f setup-cron.sh
rm -f setup-ec2.sh
rm -f setup-logging.sh
rm -f setup-project.sh
rm -f setup-sqlite.sh
rm -f setup-with-sqlite.sh
rm -f SQLITE-README.md

echo "✅ Cleanup completed!"
echo ""
echo "📋 Remaining files:"
ls -la
