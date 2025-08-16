#!/bin/bash
# Restore Script (updated for Docker Hub workflow)
# Run as: bash restore.sh [backup_date]

BACKUP_DATE=$1
BACKUP_DIR="/home/ubuntu/backups"
PROJECT_DIR="/home/ubuntu/management-app"

if [ -z "$BACKUP_DATE" ]; then
    echo "❌ Error: Please provide a backup date"
    echo "Usage: bash restore.sh [backup_date]"
    echo ""
    echo "Available backups:"
    ls -la $BACKUP_DIR/ | grep -E "\.(db|tar\.gz|info)$" | head -10
    exit 1
fi

echo "🔄 Starting restore process for backup date: $BACKUP_DATE"

# Check if backup files exist
DB_BACKUP="$BACKUP_DIR/management_$BACKUP_DATE.db"
CONFIG_BACKUP="$BACKUP_DIR/config_$BACKUP_DATE.tar.gz"
APP_BACKUP="$BACKUP_DIR/app_$BACKUP_DATE.tar.gz"
INFO_FILE="$BACKUP_DIR/backup_$BACKUP_DATE.info"

echo "📁 Checking backup files..."
if [ ! -f "$DB_BACKUP" ]; then
    echo "⚠️  Database backup not found: $DB_BACKUP"
fi

if [ ! -f "$CONFIG_BACKUP" ]; then
    echo "⚠️  Config backup not found: $CONFIG_BACKUP"
fi

if [ ! -f "$APP_BACKUP" ]; then
    echo "⚠️  Application backup not found: $APP_BACKUP"
fi

if [ -f "$INFO_FILE" ]; then
    echo "📋 Backup info:"
    cat "$INFO_FILE"
    echo ""
fi

# Confirmation
read -p "🤔 Are you sure you want to restore from $BACKUP_DATE? This will overwrite current data (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Stop containers
echo "⏸️  Stopping containers..."
cd $PROJECT_DIR/aws-deployment
docker-compose -f docker-compose.hub.yml down

# Create backup of current state
CURRENT_DATE=$(date +%Y%m%d_%H%M%S)
echo "💾 Creating backup of current state..."
mkdir -p /home/ubuntu/backups/pre-restore
cp -r $PROJECT_DIR /home/ubuntu/backups/pre-restore/ManagementApp_$CURRENT_DATE

# Restore database
if [ -f "$DB_BACKUP" ]; then
    echo "🗄️  Restoring database..."
    mkdir -p $PROJECT_DIR/data
    cp "$DB_BACKUP" $PROJECT_DIR/data/management.db
    echo "✅ Database restored"
else
    echo "⚠️  Skipping database restore (file not found)"
fi

# Restore configuration
if [ -f "$CONFIG_BACKUP" ]; then
    echo "⚙️ Restoring configuration..."
    tar -xzf "$CONFIG_BACKUP" -C $PROJECT_DIR/
    echo "✅ Configuration restored"
else
    echo "⚠️  Skipping configuration restore (file not found)"
fi

# Restore application (optional)
read -p "🤔 Do you want to restore application files? This will overwrite code changes (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "$APP_BACKUP" ]; then
        echo "📦 Restoring application files..."
        rm -rf $PROJECT_DIR
        tar -xzf "$APP_BACKUP" -C /home/ubuntu/
        echo "✅ Application files restored"
    else
        echo "⚠️  Application backup not found"
    fi
fi

# Fix permissions
echo "🔧 Fixing permissions..."
sudo chown -R ubuntu:ubuntu $PROJECT_DIR
sudo chmod +x $PROJECT_DIR/aws-deployment/*.sh

# Update environment variables with current IP
echo "🌐 Updating environment variables..."
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
cd $PROJECT_DIR

if [ -f "client-app/.env.production" ]; then
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api|g" client-app/.env.production
fi

if [ -f "aws-deployment/.env" ]; then
    sed -i "s|EC2_PUBLIC_IP=.*|EC2_PUBLIC_IP=$EC2_PUBLIC_IP|g" aws-deployment/.env
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api|g" aws-deployment/.env
fi

# Start containers
echo "▶️  Starting containers..."
cd aws-deployment
docker-compose -f docker-compose.hub.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 60

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Restore completed successfully!"
    echo "🌍 Your app is available at: http://$EC2_PUBLIC_IP"
else
    echo "⚠️  Restore completed but health check failed"
    echo "📋 Check container logs: docker-compose -f docker-compose.hub.yml logs"
fi

echo ""
echo "📊 Container status:"
docker-compose -f docker-compose.hub.yml ps

echo ""
echo "✅ Restore process completed!"
echo "💡 If you encounter issues, check the logs or restore from a different backup"
