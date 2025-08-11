#!/bin/bash
# Enhanced Backup Script with S3 sync and verification
# Run as: bash enhanced-backup.sh

set -e

BACKUP_DIR="/home/ubuntu/ManagementApp/data/backups"
DB_FILE="/home/ubuntu/ManagementApp/data/database/management.db"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/home/ubuntu/ManagementApp/data/logs/backup.log"

# S3 settings (optional - configure if needed)
S3_BUCKET="${BACKUP_S3_BUCKET:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo "💾 Enhanced SQLite Backup Starting..." | tee -a $LOG_FILE
echo "Timestamp: $(date)" | tee -a $LOG_FILE

# Create directories
mkdir -p $BACKUP_DIR
mkdir -p $(dirname $LOG_FILE)

# Check if database exists
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Database file not found: $DB_FILE" | tee -a $LOG_FILE
    exit 1
fi

# Get database size before backup
DB_SIZE_BEFORE=$(du -h $DB_FILE | cut -f1)
echo "📊 Database size: $DB_SIZE_BEFORE" | tee -a $LOG_FILE

# Create local backup
echo "🔄 Creating local backup..." | tee -a $LOG_FILE
BACKUP_FILE="$BACKUP_DIR/management_${DATE}.db"

# Use SQLite backup command (online backup)
if sqlite3 $DB_FILE ".backup $BACKUP_FILE"; then
    echo "✅ Local backup created: management_${DATE}.db" | tee -a $LOG_FILE
else
    echo "❌ Local backup failed!" | tee -a $LOG_FILE
    exit 1
fi

# Verify backup integrity
echo "🔍 Verifying backup integrity..." | tee -a $LOG_FILE
INTEGRITY=$(sqlite3 $BACKUP_FILE "PRAGMA integrity_check;" 2>/dev/null)
if [ "$INTEGRITY" = "ok" ]; then
    echo "✅ Backup integrity verified" | tee -a $LOG_FILE
else
    echo "❌ Backup integrity check failed: $INTEGRITY" | tee -a $LOG_FILE
    rm -f $BACKUP_FILE
    exit 1
fi

# Compress backup
echo "📦 Compressing backup..." | tee -a $LOG_FILE
gzip $BACKUP_FILE
COMPRESSED_FILE="${BACKUP_FILE}.gz"

if [ -f "$COMPRESSED_FILE" ]; then
    COMPRESSED_SIZE=$(du -h $COMPRESSED_FILE | cut -f1)
    echo "✅ Backup compressed: $COMPRESSED_SIZE" | tee -a $LOG_FILE
else
    echo "❌ Compression failed!" | tee -a $LOG_FILE
    exit 1
fi

# Create backup metadata
echo "📝 Creating backup metadata..." | tee -a $LOG_FILE
cat > "${COMPRESSED_FILE}.meta" << EOF
{
  "backup_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "database_size_original": "$DB_SIZE_BEFORE",
  "backup_size_compressed": "$COMPRESSED_SIZE",
  "database_path": "$DB_FILE",
  "backup_method": "sqlite_backup_command",
  "compression": "gzip",
  "integrity_check": "$INTEGRITY",
  "server_ip": "$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'unknown')",
  "git_commit": "$(cd /home/ubuntu/ManagementApp && git rev-parse HEAD 2>/dev/null || echo 'unknown')"
}
EOF

# S3 Sync (if configured)
if [ -n "$S3_BUCKET" ]; then
    echo "☁️ Syncing to S3..." | tee -a $LOG_FILE
    
    # Check if AWS CLI is available
    if command -v aws &> /dev/null; then
        # Upload backup file
        if aws s3 cp "$COMPRESSED_FILE" "s3://$S3_BUCKET/database-backups/" --region $AWS_REGION; then
            echo "✅ Backup uploaded to S3" | tee -a $LOG_FILE
            
            # Upload metadata
            aws s3 cp "${COMPRESSED_FILE}.meta" "s3://$S3_BUCKET/database-backups/" --region $AWS_REGION
            echo "✅ Metadata uploaded to S3" | tee -a $LOG_FILE
        else
            echo "⚠️ S3 upload failed (continuing with local backup)" | tee -a $LOG_FILE
        fi
    else
        echo "⚠️ AWS CLI not found, skipping S3 sync" | tee -a $LOG_FILE
    fi
else
    echo "ℹ️ S3 backup not configured (set BACKUP_S3_BUCKET to enable)" | tee -a $LOG_FILE
fi

# Clean up old local backups (keep last 14 days)
echo "🧹 Cleaning up old local backups..." | tee -a $LOG_FILE
DELETED_COUNT=$(find $BACKUP_DIR -name "management_*.db.gz" -mtime +14 -delete -print | wc -l)
echo "🗑️ Deleted $DELETED_COUNT old backup files" | tee -a $LOG_FILE

# Clean up old metadata files
find $BACKUP_DIR -name "management_*.meta" -mtime +14 -delete 2>/dev/null || true

# Generate backup report
echo "📋 Generating backup report..." | tee -a $LOG_FILE
BACKUP_COUNT=$(ls -1 $BACKUP_DIR/management_*.db.gz 2>/dev/null | wc -l)
TOTAL_BACKUP_SIZE=$(du -sh $BACKUP_DIR 2>/dev/null | cut -f1)

cat > $BACKUP_DIR/backup_report_${DATE}.txt << EOF
SQLite Backup Report
===================
Date: $(date)
Database: $DB_FILE
Original Size: $DB_SIZE_BEFORE
Backup Size: $COMPRESSED_SIZE
Backup File: management_${DATE}.db.gz
Integrity Check: $INTEGRITY
S3 Sync: $([ -n "$S3_BUCKET" ] && echo "Enabled" || echo "Disabled")

Statistics:
- Total local backups: $BACKUP_COUNT
- Total backup storage: $TOTAL_BACKUP_SIZE
- Retention policy: 14 days

Next Steps:
- Monitor backup size trends
- Test restore procedures monthly
- Consider S3 sync for off-site backup
EOF

# Send notification (if configured)
if [ -n "$NOTIFICATION_EMAIL" ]; then
    echo "📧 Sending notification..." | tee -a $LOG_FILE
    
    # Simple email notification (requires sendmail or similar)
    if command -v mail &> /dev/null; then
        echo "SQLite backup completed successfully on $(date)" | \
        mail -s "Backup Success - ManagementApp" $NOTIFICATION_EMAIL
    fi
fi

# Final summary
echo "" | tee -a $LOG_FILE
echo "✅ Enhanced backup completed successfully!" | tee -a $LOG_FILE
echo "📁 Local backup: $COMPRESSED_FILE" | tee -a $LOG_FILE
echo "📊 Original size: $DB_SIZE_BEFORE → Compressed: $COMPRESSED_SIZE" | tee -a $LOG_FILE
echo "📈 Total backups: $BACKUP_COUNT files ($TOTAL_BACKUP_SIZE)" | tee -a $LOG_FILE

if [ -n "$S3_BUCKET" ]; then
    echo "☁️ S3 backup: s3://$S3_BUCKET/database-backups/management_${DATE}.db.gz" | tee -a $LOG_FILE
fi

echo "🎉 Backup process completed!" | tee -a $LOG_FILE
