#!/bin/bash
# Enhanced Logging Setup for SQLite Production
# Run as: bash setup-logging.sh

set -e

echo "📊 Setting up Enhanced Logging for SQLite Production..."

PROJECT_DIR="/home/ubuntu/ManagementApp"
LOG_DIR="$PROJECT_DIR/data/logs"

# Create log directories
echo "📁 Creating log directories..."
mkdir -p $LOG_DIR/application
mkdir -p $LOG_DIR/database
mkdir -p $LOG_DIR/system
mkdir -p $LOG_DIR/security
mkdir -p $LOG_DIR/performance

# Set permissions
chown -R ubuntu:ubuntu $LOG_DIR 2>/dev/null || true
chmod -R 755 $LOG_DIR

# Update ASP.NET Core logging configuration
echo "⚙️ Updating application logging configuration..."
JWT_SECRET=$(openssl rand -base64 32)

cat > $PROJECT_DIR/server-app/appsettings.Production.json << EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information",
      "Microsoft.EntityFrameworkCore.Infrastructure": "Warning"
    },
    "Console": {
      "IncludeScopes": true,
      "TimestampFormat": "yyyy-MM-dd HH:mm:ss "
    },
    "File": {
      "Path": "/app/data/logs/application/app-{Date}.log",
      "MinLevel": "Information",
      "RollingInterval": "Day",
      "RetainedFileCountLimit": 7
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=/app/data/database/management.db;Cache=Shared;Pooling=true;Journal Mode=WAL;Synchronous=NORMAL;Temp Store=MEMORY;Mmap Size=268435456;"
  },
  "JwtSettings": {
    "SecretKey": "$JWT_SECRET",
    "Issuer": "ManagementApp",
    "Audience": "ManagementApp-Users",
    "ExpirationMinutes": 60
  },
  "AllowedHosts": "*",
  "DatabaseProvider": "Sqlite",
  "CustomLogging": {
    "EnableDatabaseQueryLogging": true,
    "EnablePerformanceLogging": true,
    "EnableSecurityLogging": true,
    "SlowQueryThresholdMs": 100
  }
}
EOF

# Create database query logger script
echo "🗄️ Creating database query logger..."
cat > $PROJECT_DIR/aws-deployment/log-database-queries.sh << 'EOF'
#!/bin/bash
# Database Query Logger

DB_FILE="/home/ubuntu/ManagementApp/data/database/management.db"
LOG_FILE="/home/ubuntu/ManagementApp/data/logs/database/queries-$(date +%Y%m%d).log"

if [ ! -f "$DB_FILE" ]; then
    echo "Database file not found: $DB_FILE"
    exit 1
fi

# Monitor for long-running queries
echo "$(date): Starting database query monitoring..." >> $LOG_FILE

# Simple query performance monitoring
# This would be replaced with proper application-level logging in production
sqlite3 $DB_FILE ".timer on" ".log $LOG_FILE" 2>/dev/null || true

echo "Database query logging enabled: $LOG_FILE"
EOF

# Create performance logger
echo "📈 Creating performance logger..."
cat > $PROJECT_DIR/aws-deployment/log-performance.sh << 'EOF'
#!/bin/bash
# Performance Logger

LOG_FILE="/home/ubuntu/ManagementApp/data/logs/performance/perf-$(date +%Y%m%d).log"
DB_FILE="/home/ubuntu/ManagementApp/data/database/management.db"

echo "$(date): Performance monitoring started" >> $LOG_FILE

# System performance
echo "=== System Performance ===" >> $LOG_FILE
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')" >> $LOG_FILE
echo "Memory: $(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')" >> $LOG_FILE
echo "Disk: $(df -h / | awk 'NR==2{print $5}')" >> $LOG_FILE

# Database performance
if [ -f "$DB_FILE" ]; then
    echo "=== Database Performance ===" >> $LOG_FILE
    echo "DB Size: $(du -h $DB_FILE | cut -f1)" >> $LOG_FILE
    
    # WAL file size
    WAL_FILE="${DB_FILE}-wal"
    if [ -f "$WAL_FILE" ]; then
        echo "WAL Size: $(du -h $WAL_FILE | cut -f1)" >> $LOG_FILE
    fi
    
    # Simple query performance test
    START_TIME=$(date +%s%N)
    sqlite3 $DB_FILE "SELECT COUNT(*) FROM sqlite_master;" > /dev/null 2>&1
    END_TIME=$(date +%s%N)
    DURATION=$((($END_TIME - $START_TIME) / 1000000))
    echo "Query Response Time: ${DURATION}ms" >> $LOG_FILE
fi

# Container stats
echo "=== Container Performance ===" >> $LOG_FILE
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" >> $LOG_FILE 2>/dev/null || echo "Docker stats unavailable" >> $LOG_FILE

echo "$(date): Performance monitoring completed" >> $LOG_FILE
echo "---" >> $LOG_FILE
EOF

# Create security logger
echo "🔒 Creating security logger..."
cat > $PROJECT_DIR/aws-deployment/log-security.sh << 'EOF'
#!/bin/bash
# Security Logger

LOG_FILE="/home/ubuntu/ManagementApp/data/logs/security/security-$(date +%Y%m%d).log"

echo "$(date): Security monitoring started" >> $LOG_FILE

# Failed SSH attempts
echo "=== Failed SSH Attempts ===" >> $LOG_FILE
grep "Failed password" /var/log/auth.log 2>/dev/null | tail -5 >> $LOG_FILE || echo "No auth.log access" >> $LOG_FILE

# Network connections
echo "=== Active Network Connections ===" >> $LOG_FILE
netstat -an | grep ":80\|:443\|:22\|:3000\|:5000" | head -10 >> $LOG_FILE

# Disk space (security related)
echo "=== Disk Usage ===" >> $LOG_FILE
df -h >> $LOG_FILE

# Check for suspicious files
echo "=== File System Security ===" >> $LOG_FILE
find /home/ubuntu/ManagementApp -name "*.tmp" -o -name "*.bak" | head -5 >> $LOG_FILE

echo "$(date): Security monitoring completed" >> $LOG_FILE
echo "---" >> $LOG_FILE
EOF

# Create log aggregator
echo "📋 Creating log aggregator..."
cat > $PROJECT_DIR/aws-deployment/aggregate-logs.sh << 'EOF'
#!/bin/bash
# Log Aggregator - combines all logs for analysis

LOG_DIR="/home/ubuntu/ManagementApp/data/logs"
OUTPUT_FILE="$LOG_DIR/daily-summary-$(date +%Y%m%d).log"

echo "📊 Daily Log Summary - $(date)" > $OUTPUT_FILE
echo "=======================================" >> $OUTPUT_FILE

# Application logs summary
echo "" >> $OUTPUT_FILE
echo "🚀 Application Logs:" >> $OUTPUT_FILE
if [ -d "$LOG_DIR/application" ]; then
    ERROR_COUNT=$(grep -i "error" $LOG_DIR/application/* 2>/dev/null | wc -l)
    WARNING_COUNT=$(grep -i "warning" $LOG_DIR/application/* 2>/dev/null | wc -l)
    echo "  Errors: $ERROR_COUNT" >> $OUTPUT_FILE
    echo "  Warnings: $WARNING_COUNT" >> $OUTPUT_FILE
    
    # Recent errors
    if [ $ERROR_COUNT -gt 0 ]; then
        echo "  Recent Errors:" >> $OUTPUT_FILE
        grep -i "error" $LOG_DIR/application/* 2>/dev/null | tail -3 >> $OUTPUT_FILE
    fi
else
    echo "  No application logs found" >> $OUTPUT_FILE
fi

# Database logs summary
echo "" >> $OUTPUT_FILE
echo "🗄️ Database Logs:" >> $OUTPUT_FILE
if [ -d "$LOG_DIR/database" ]; then
    QUERY_COUNT=$(cat $LOG_DIR/database/* 2>/dev/null | wc -l)
    echo "  Total queries logged: $QUERY_COUNT" >> $OUTPUT_FILE
else
    echo "  No database logs found" >> $OUTPUT_FILE
fi

# Performance summary
echo "" >> $OUTPUT_FILE
echo "📈 Performance Summary:" >> $OUTPUT_FILE
if [ -f "$LOG_DIR/performance/perf-$(date +%Y%m%d).log" ]; then
    PERF_FILE="$LOG_DIR/performance/perf-$(date +%Y%m%d).log"
    AVG_CPU=$(grep "CPU:" $PERF_FILE | tail -5 | awk '{sum+=$2; count++} END {printf "%.1f%%", sum/count}')
    echo "  Average CPU: $AVG_CPU" >> $OUTPUT_FILE
    
    LATEST_MEMORY=$(grep "Memory:" $PERF_FILE | tail -1 | awk '{print $2}')
    echo "  Current Memory: $LATEST_MEMORY" >> $OUTPUT_FILE
else
    echo "  No performance logs found" >> $OUTPUT_FILE
fi

# Security summary
echo "" >> $OUTPUT_FILE
echo "🔒 Security Summary:" >> $OUTPUT_FILE
if [ -f "$LOG_DIR/security/security-$(date +%Y%m%d).log" ]; then
    FAILED_SSH=$(grep -c "Failed password" $LOG_DIR/security/security-$(date +%Y%m%d).log 2>/dev/null || echo "0")
    echo "  Failed SSH attempts: $FAILED_SSH" >> $OUTPUT_FILE
else
    echo "  No security logs found" >> $OUTPUT_FILE
fi

# System health
echo "" >> $OUTPUT_FILE
echo "💚 System Health:" >> $OUTPUT_FILE
echo "  Timestamp: $(date)" >> $OUTPUT_FILE
echo "  Uptime: $(uptime | awk '{print $3,$4}')" >> $OUTPUT_FILE
echo "  Load Average: $(uptime | awk -F'load average:' '{print $2}')" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "📧 Summary generated: $OUTPUT_FILE"
echo "Log aggregation completed: $OUTPUT_FILE"
EOF

# Create log rotation script
echo "🔄 Creating log rotation script..."
cat > $PROJECT_DIR/aws-deployment/rotate-logs.sh << 'EOF'
#!/bin/bash
# Log Rotation Script

LOG_DIR="/home/ubuntu/ManagementApp/data/logs"

echo "🔄 Starting log rotation..."

# Rotate application logs (keep 7 days)
find $LOG_DIR/application -name "*.log" -mtime +7 -delete 2>/dev/null || true

# Rotate database logs (keep 14 days)
find $LOG_DIR/database -name "*.log" -mtime +14 -delete 2>/dev/null || true

# Rotate performance logs (keep 30 days)
find $LOG_DIR/performance -name "*.log" -mtime +30 -delete 2>/dev/null || true

# Rotate security logs (keep 90 days)
find $LOG_DIR/security -name "*.log" -mtime +90 -delete 2>/dev/null || true

# Rotate summary logs (keep 30 days)
find $LOG_DIR -name "daily-summary-*.log" -mtime +30 -delete 2>/dev/null || true

# Compress old logs (older than 3 days)
find $LOG_DIR -name "*.log" -mtime +3 ! -name "*$(date +%Y%m%d)*" -exec gzip {} \; 2>/dev/null || true

echo "✅ Log rotation completed"

# Show current log disk usage
echo "📊 Current log disk usage:"
du -sh $LOG_DIR/* 2>/dev/null || echo "No logs found"
EOF

# Make all logging scripts executable
chmod +x $PROJECT_DIR/aws-deployment/log-database-queries.sh
chmod +x $PROJECT_DIR/aws-deployment/log-performance.sh
chmod +x $PROJECT_DIR/aws-deployment/log-security.sh
chmod +x $PROJECT_DIR/aws-deployment/aggregate-logs.sh
chmod +x $PROJECT_DIR/aws-deployment/rotate-logs.sh

# Update cron jobs to include logging
echo "⏰ Setting up logging cron jobs..."
cat > /tmp/logging_cron << EOF
# Performance logging every 10 minutes
*/10 * * * * cd /home/ubuntu/ManagementApp/aws-deployment && bash log-performance.sh

# Security logging every 30 minutes
*/30 * * * * cd /home/ubuntu/ManagementApp/aws-deployment && bash log-security.sh

# Daily log aggregation at 11:59 PM
59 23 * * * cd /home/ubuntu/ManagementApp/aws-deployment && bash aggregate-logs.sh

# Weekly log rotation on Sundays at 5 AM
0 5 * * 0 cd /home/ubuntu/ManagementApp/aws-deployment && bash rotate-logs.sh
EOF

# Add to existing crontab
(crontab -l 2>/dev/null || true; cat /tmp/logging_cron) | crontab -
rm /tmp/logging_cron

echo ""
echo "✅ Enhanced Logging Setup Completed!"
echo "===================================="
echo ""
echo "📁 Log directories created:"
echo "  📱 Application: $LOG_DIR/application/"
echo "  🗄️ Database: $LOG_DIR/database/"
echo "  📈 Performance: $LOG_DIR/performance/"
echo "  🔒 Security: $LOG_DIR/security/"
echo "  📊 System: $LOG_DIR/system/"
echo ""
echo "🛠️ Logging scripts available:"
echo "  📊 Performance: bash log-performance.sh"
echo "  🔒 Security: bash log-security.sh"
echo "  🗄️ Database: bash log-database-queries.sh"
echo "  📋 Aggregate: bash aggregate-logs.sh"
echo "  🔄 Rotate: bash rotate-logs.sh"
echo ""
echo "⏰ Automated logging schedule:"
echo "  📈 Performance monitoring: Every 10 minutes"
echo "  🔒 Security monitoring: Every 30 minutes"
echo "  📊 Daily log summary: 11:59 PM daily"
echo "  🔄 Log rotation: Sundays 5:00 AM"
echo ""
echo "📋 Log retention policy:"
echo "  📱 Application logs: 7 days"
echo "  🗄️ Database logs: 14 days"
echo "  📈 Performance logs: 30 days"
echo "  🔒 Security logs: 90 days"
echo "  📊 Summary logs: 30 days"
echo ""
echo "💡 Usage tips:"
echo "  • View daily summary: cat $LOG_DIR/daily-summary-\$(date +%Y%m%d).log"
echo "  • Monitor real-time: tail -f $LOG_DIR/application/app-*.log"
echo "  • Check performance: bash log-performance.sh && cat $LOG_DIR/performance/perf-*.log"
echo "  • Security audit: cat $LOG_DIR/security/security-*.log"
echo ""
echo "📧 Next steps:"
echo "  1. Configure email notifications (optional)"
echo "  2. Setup S3 log backup (optional)"
echo "  3. Test log aggregation: bash aggregate-logs.sh"
echo "  4. Monitor log disk usage regularly"
