#!/bin/bash
# Setup Cron Jobs for Automated Maintenance
# Run as: bash setup-cron.sh

echo "⏰ Setting up automated maintenance cron jobs..."

# Create cron directory for scripts
mkdir -p /home/ubuntu/cron-scripts

# Create health check script
cat > /home/ubuntu/cron-scripts/health-check.sh << 'EOF'
#!/bin/bash
# Health check script for cron

LOG_FILE="/home/ubuntu/logs/health-check.log"
mkdir -p /home/ubuntu/logs

echo "[$(date)] Starting health check..." >> $LOG_FILE

# Check if containers are running
cd /home/ubuntu/ManagementApp/aws-deployment
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "[$(date)] ERROR: Containers are not running, attempting restart..." >> $LOG_FILE
    docker-compose -f docker-compose.prod.yml up -d
    sleep 30
fi

# Check application health
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "[$(date)] ERROR: Health check failed, restarting containers..." >> $LOG_FILE
    docker-compose -f docker-compose.prod.yml restart
    sleep 30
    
    # Check again
    if ! curl -f http://localhost/health > /dev/null 2>&1; then
        echo "[$(date)] CRITICAL: Health check still failing after restart!" >> $LOG_FILE
        # Could send notification here
    else
        echo "[$(date)] SUCCESS: Health check recovered after restart" >> $LOG_FILE
    fi
else
    echo "[$(date)] SUCCESS: Health check passed" >> $LOG_FILE
fi

# Clean up old logs (keep last 100 lines)
tail -100 $LOG_FILE > $LOG_FILE.tmp && mv $LOG_FILE.tmp $LOG_FILE
EOF

# Create system cleanup script
cat > /home/ubuntu/cron-scripts/cleanup.sh << 'EOF'
#!/bin/bash
# System cleanup script

LOG_FILE="/home/ubuntu/logs/cleanup.log"
mkdir -p /home/ubuntu/logs

echo "[$(date)] Starting system cleanup..." >> $LOG_FILE

# Clean Docker system
echo "[$(date)] Cleaning Docker system..." >> $LOG_FILE
docker system prune -f >> $LOG_FILE 2>&1

# Clean up old logs
echo "[$(date)] Cleaning up old logs..." >> $LOG_FILE
find /home/ubuntu/logs -name "*.log" -mtime +30 -delete
find /var/log -name "*.log.*" -mtime +7 -delete 2>/dev/null || true

# Clean up temporary files
echo "[$(date)] Cleaning temporary files..." >> $LOG_FILE
find /tmp -type f -atime +7 -delete 2>/dev/null || true

# Report disk usage
echo "[$(date)] Current disk usage:" >> $LOG_FILE
df -h >> $LOG_FILE

echo "[$(date)] Cleanup completed" >> $LOG_FILE
EOF

# Create container restart script
cat > /home/ubuntu/cron-scripts/daily-restart.sh << 'EOF'
#!/bin/bash
# Daily container restart for memory cleanup

LOG_FILE="/home/ubuntu/logs/restart.log"
mkdir -p /home/ubuntu/logs

echo "[$(date)] Starting daily restart..." >> $LOG_FILE

cd /home/ubuntu/ManagementApp/aws-deployment

# Graceful restart
echo "[$(date)] Restarting containers..." >> $LOG_FILE
docker-compose -f docker-compose.prod.yml restart >> $LOG_FILE 2>&1

# Wait for services
sleep 60

# Health check
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "[$(date)] SUCCESS: Daily restart completed, health check passed" >> $LOG_FILE
else
    echo "[$(date)] ERROR: Daily restart completed but health check failed" >> $LOG_FILE
fi
EOF

# Make scripts executable
chmod +x /home/ubuntu/cron-scripts/*.sh

# Get current crontab
crontab -l > /tmp/current_cron 2>/dev/null || touch /tmp/current_cron

# Add new cron jobs (if not already present)
echo "📋 Adding cron jobs..."

# Health check every 5 minutes
if ! grep -q "health-check.sh" /tmp/current_cron; then
    echo "*/5 * * * * /home/ubuntu/cron-scripts/health-check.sh" >> /tmp/current_cron
    echo "✅ Added: Health check every 5 minutes"
fi

# Daily restart at 3 AM
if ! grep -q "daily-restart.sh" /tmp/current_cron; then
    echo "0 3 * * * /home/ubuntu/cron-scripts/daily-restart.sh" >> /tmp/current_cron
    echo "✅ Added: Daily restart at 3:00 AM"
fi

# Weekly backup on Sundays at 2 AM
if ! grep -q "backup.sh" /tmp/current_cron; then
    echo "0 2 * * 0 cd /home/ubuntu/ManagementApp/aws-deployment && bash backup.sh" >> /tmp/current_cron
    echo "✅ Added: Weekly backup on Sundays at 2:00 AM"
fi

# Weekly cleanup on Sundays at 4 AM
if ! grep -q "cleanup.sh" /tmp/current_cron; then
    echo "0 4 * * 0 /home/ubuntu/cron-scripts/cleanup.sh" >> /tmp/current_cron
    echo "✅ Added: Weekly cleanup on Sundays at 4:00 AM"
fi

# Apply new crontab
crontab /tmp/current_cron

# Clean up
rm /tmp/current_cron

echo ""
echo "📋 Current cron jobs:"
crontab -l

echo ""
echo "📁 Log files will be stored in:"
echo "  - Health checks: /home/ubuntu/logs/health-check.log"
echo "  - Daily restarts: /home/ubuntu/logs/restart.log"
echo "  - System cleanup: /home/ubuntu/logs/cleanup.log"

echo ""
echo "✅ Cron jobs setup completed!"
echo "💡 To view logs: tail -f /home/ubuntu/logs/[log-file].log"
echo "💡 To edit cron jobs: crontab -e"
