#!/bin/bash
# Backup Script
# Run as: bash backup.sh

set -e

echo "💾 Starting backup process..."

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/home/ubuntu/management-app"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "📁 Backup directory: $BACKUP_DIR"
echo "📅 Timestamp: $DATE"

# Stop containers temporarily for consistent backup
echo "⏸️  Stopping containers for backup..."
cd $PROJECT_DIR/aws-deployment
docker-compose -f docker-compose.prod.yml stop

# Backup database
echo "🗄️  Backing up database..."
if [ -f "$PROJECT_DIR/data/management.db" ]; then
    cp $PROJECT_DIR/data/management.db $BACKUP_DIR/management_$DATE.db
    echo "✅ Database backup created: management_$DATE.db"
else
    echo "⚠️  Database file not found, skipping database backup"
fi

# Backup application configuration
echo "⚙️ Backing up configuration files..."
tar -czf $BACKUP_DIR/config_$DATE.tar.gz \
    -C $PROJECT_DIR \
    client-app/.env.production \
    server-app/appsettings.json \
    aws-deployment/ \
    docker-compose.yml \
    nginx.conf 2>/dev/null || echo "⚠️  Some config files may not exist"

# Backup entire application (excluding large directories)
echo "📦 Backing up application files..."
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='bin' \
    --exclude='obj' \
    --exclude='.next' \
    --exclude='data' \
    -C /home/ubuntu \
    management-app

echo "✅ Application backup created: app_$DATE.tar.gz"

# Create a backup metadata file
cat > $BACKUP_DIR/backup_$DATE.info << EOF
Backup Information
==================
Date: $(date)
Server IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
Git Commit: $(cd $PROJECT_DIR && git rev-parse HEAD 2>/dev/null || echo "N/A")
Git Branch: $(cd $PROJECT_DIR && git branch --show-current 2>/dev/null || echo "N/A")

Files included:
- management_$DATE.db (database)
- config_$DATE.tar.gz (configuration files)
- app_$DATE.tar.gz (application source code)

Restore instructions:
1. Stop containers: docker-compose -f docker-compose.prod.yml down
2. Restore database: cp management_$DATE.db /home/ubuntu/management-app/data/management.db
3. Restore config: tar -xzf config_$DATE.tar.gz -C /home/ubuntu/management-app/
4. Restore app: tar -xzf app_$DATE.tar.gz -C /home/ubuntu/
5. Deploy: bash deploy.sh
EOF

# Restart containers
echo "▶️  Restarting containers..."
docker-compose -f docker-compose.prod.yml start

# Wait for services to be ready
echo "⏳ Waiting for services to restart..."
sleep 30

# Verify containers are running
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Containers restarted successfully"
else
    echo "⚠️  Warning: Some containers may not have started properly"
    docker-compose -f docker-compose.prod.yml ps
fi

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find $BACKUP_DIR -name "*.db" -mtime +7 -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.info" -mtime +7 -delete 2>/dev/null || true

# Show backup summary
echo ""
echo "📊 Backup Summary:"
echo "=================="
ls -lah $BACKUP_DIR/*$DATE* 2>/dev/null || echo "No backup files found"

echo ""
echo "💾 Total backup storage used:"
du -sh $BACKUP_DIR

echo ""
echo "📋 Available backups:"
ls -lt $BACKUP_DIR/ | head -10

echo ""
echo "✅ Backup completed successfully!"
echo "💡 To restore from backup:"
echo "   1. Run: bash restore.sh [backup_date]"
echo "   2. Example: bash restore.sh $DATE"
