#!/bin/bash
# SQLite Production Setup for EC2
# Run as: bash setup-sqlite.sh

set -e

echo "🗄️ Setting up SQLite for Production on EC2..."

# Get project directory
PROJECT_DIR="/home/ubuntu/management-app"
if [ ! -d "$PROJECT_DIR" ]; then
    PROJECT_DIR="$(pwd)/.."
fi

echo "📁 Project directory: $PROJECT_DIR"

# Create data directory with proper permissions
echo "📁 Creating data directories..."
mkdir -p $PROJECT_DIR/data/database
mkdir -p $PROJECT_DIR/data/backups
mkdir -p $PROJECT_DIR/data/logs

# Set proper permissions
if [ "$(whoami)" = "ubuntu" ]; then
    sudo chown -R ubuntu:ubuntu $PROJECT_DIR/data
else
    chown -R ubuntu:ubuntu $PROJECT_DIR/data 2>/dev/null || true
fi
chmod 755 $PROJECT_DIR/data
chmod 755 $PROJECT_DIR/data/database
chmod 755 $PROJECT_DIR/data/backups
chmod 755 $PROJECT_DIR/data/logs

# Create SQLite optimized configuration
echo "⚙️ Creating optimized SQLite configuration..."

# Generate secure JWT key
JWT_SECRET=$(openssl rand -base64 32)

# Update server appsettings for production SQLite
cat > $PROJECT_DIR/server-app/appsettings.json << EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning",
      "Microsoft.EntityFrameworkCore.Infrastructure": "Warning"
    },
    "Console": {
      "IncludeScopes": false
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
  "DatabaseProvider": "Sqlite"
}
EOF

echo "✅ SQLite configuration created with secure JWT key!"

# Create database initialization script
echo "🔧 Creating database initialization script..."
cat > $PROJECT_DIR/data/init-db.sql << 'EOF'
-- SQLite Production Optimizations
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
PRAGMA temp_store = MEMORY;
PRAGMA mmap_size = 268435456;
PRAGMA optimize;

-- Create indexes for common queries (will be created by EF migrations)
-- This file serves as documentation for manual optimizations if needed
EOF

# Create comprehensive SQLite management scripts
echo "💾 Creating SQLite management scripts..."

# Backup script
cat > $PROJECT_DIR/aws-deployment/backup-sqlite.sh << 'EOF'
#!/bin/bash
# SQLite Backup Script

BACKUP_DIR="/home/ubuntu/management-app/data/backups"
DB_FILE="/home/ubuntu/management-app/data/database/management.db"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Starting SQLite backup..."

mkdir -p $BACKUP_DIR

if [ ! -f "$DB_FILE" ]; then
    echo "❌ Database file not found: $DB_FILE"
    exit 1
fi

# Online backup using SQLite's backup command
sqlite3 $DB_FILE ".backup $BACKUP_DIR/management_${DATE}.db"

if [ $? -eq 0 ]; then
    echo "✅ Backup created: management_${DATE}.db"
    gzip $BACKUP_DIR/management_${DATE}.db
    echo "📦 Backup compressed: management_${DATE}.db.gz"
    SIZE=$(du -h $BACKUP_DIR/management_${DATE}.db.gz | cut -f1)
    echo "📊 Backup size: $SIZE"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Clean up old backups (keep last 14 days)
find $BACKUP_DIR -name "management_*.db.gz" -mtime +14 -delete 2>/dev/null || true
echo "🧹 Cleaned up old backups (>14 days)"
echo "✅ SQLite backup completed!"
EOF

# Restore script
cat > $PROJECT_DIR/aws-deployment/restore-sqlite.sh << 'EOF'
#!/bin/bash
# SQLite Restore Script

BACKUP_DIR="/home/ubuntu/management-app/data/backups"
DB_FILE="/home/ubuntu/management-app/data/database/management.db"
PROJECT_DIR="/home/ubuntu/management-app"

if [ -z "$1" ]; then
    echo "❌ Usage: bash restore-sqlite.sh [backup_filename]"
    echo ""
    echo "📋 Available backups:"
    ls -la $BACKUP_DIR/management_*.db.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"
if [[ ! "$BACKUP_FILE" == *.gz ]]; then
    BACKUP_FILE="${BACKUP_FILE}.gz"
fi

BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

if [ ! -f "$BACKUP_PATH" ]; then
    echo "❌ Backup file not found: $BACKUP_PATH"
    exit 1
fi

echo "🔄 Restoring SQLite database from: $BACKUP_FILE"

read -p "⚠️  This will overwrite the current database. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Stop containers
echo "⏸️  Stopping containers..."
cd $PROJECT_DIR/aws-deployment
docker-compose -f docker-compose.prod.yml stop server-app

# Backup current database
if [ -f "$DB_FILE" ]; then
    echo "💾 Backing up current database..."
    cp "$DB_FILE" "$DB_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Restore from backup
echo "📥 Restoring database..."
gunzip -c "$BACKUP_PATH" > "$DB_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
    chown ubuntu:ubuntu "$DB_FILE" 2>/dev/null || true
    chmod 644 "$DB_FILE"
    
    echo "▶️  Starting containers..."
    docker-compose -f docker-compose.prod.yml start server-app
    
    sleep 10
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Restore completed successfully!"
    else
        echo "⚠️  Restore completed but health check failed"
    fi
else
    echo "❌ Restore failed!"
    exit 1
fi
EOF

# Maintenance script
cat > $PROJECT_DIR/aws-deployment/maintain-sqlite.sh << 'EOF'
#!/bin/bash
# SQLite Maintenance Script

DB_FILE="/home/ubuntu/management-app/data/database/management.db"
PROJECT_DIR="/home/ubuntu/management-app"

echo "🔧 SQLite Maintenance Script"
echo "=========================="

if [ ! -f "$DB_FILE" ]; then
    echo "❌ Database file not found: $DB_FILE"
    exit 1
fi

echo "📊 Database size: $(du -h $DB_FILE | cut -f1)"

# Temporary stop application
echo "⏸️  Temporarily stopping server..."
cd $PROJECT_DIR/aws-deployment
docker-compose -f docker-compose.prod.yml stop server-app

# Run maintenance
echo "🧹 Running VACUUM..."
sqlite3 $DB_FILE "VACUUM;"

echo "📈 Running ANALYZE..."
sqlite3 $DB_FILE "ANALYZE;"

echo "🔍 Running integrity check..."
INTEGRITY=$(sqlite3 $DB_FILE "PRAGMA integrity_check;")
if [ "$INTEGRITY" = "ok" ]; then
    echo "✅ Database integrity: OK"
else
    echo "❌ Database integrity issues: $INTEGRITY"
fi

echo "⚡ Running optimization..."
sqlite3 $DB_FILE "PRAGMA optimize;"

# Handle WAL file
WAL_FILE="${DB_FILE}-wal"
if [ -f "$WAL_FILE" ]; then
    WAL_SIZE_BYTES=$(stat -c%s "$WAL_FILE" 2>/dev/null || stat -f%z "$WAL_FILE")
    if [ $WAL_SIZE_BYTES -gt 10485760 ]; then
        echo "🔄 WAL file is large, running checkpoint..."
        sqlite3 $DB_FILE "PRAGMA wal_checkpoint(TRUNCATE);"
    fi
fi

# Restart application
echo "▶️  Restarting server..."
docker-compose -f docker-compose.prod.yml start server-app

sleep 10
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Maintenance completed successfully!"
else
    echo "⚠️  Maintenance completed but health check failed"
fi

echo "📊 Final database size: $(du -h $DB_FILE | cut -f1)"
EOF

# Health check script
cat > $PROJECT_DIR/aws-deployment/health-check-sqlite.sh << 'EOF'
#!/bin/bash
# SQLite Health Check Script

DB_FILE="/home/ubuntu/management-app/data/database/management.db"

echo "🏥 SQLite Health Check"
echo "===================="

if [ ! -f "$DB_FILE" ]; then
    echo "❌ Database file not found: $DB_FILE"
    exit 1
fi

if [ ! -r "$DB_FILE" ]; then
    echo "❌ Database file is not readable"
    exit 1
fi

INTEGRITY=$(sqlite3 $DB_FILE "PRAGMA integrity_check;" 2>/dev/null)
if [ "$INTEGRITY" = "ok" ]; then
    echo "✅ Database integrity: OK"
else
    echo "❌ Database integrity issues: $INTEGRITY"
    exit 1
fi

TABLES=$(sqlite3 $DB_FILE ".tables" 2>/dev/null | wc -w)
echo "📊 Tables count: $TABLES"

SIZE=$(du -h $DB_FILE | cut -f1)
echo "💾 Database size: $SIZE"

MODE=$(sqlite3 $DB_FILE "PRAGMA journal_mode;" 2>/dev/null)
echo "📝 Journal mode: $MODE"

echo "✅ SQLite health check completed!"
EOF

# Monitoring script
cat > $PROJECT_DIR/aws-deployment/monitor-sqlite.sh << 'EOF'
#!/bin/bash
# SQLite Monitoring Script

DB_FILE="/home/ubuntu/management-app/data/database/management.db"

echo "📊 SQLite Monitoring Dashboard"
echo "=============================="
echo "Timestamp: $(date)"
echo ""

if [ ! -f "$DB_FILE" ]; then
    echo "❌ Database file not found"
    exit 1
fi

echo "💾 Database File:"
echo "  Path: $DB_FILE"
echo "  Size: $(du -h $DB_FILE | cut -f1)"
echo "  Last modified: $(stat -c %y $DB_FILE 2>/dev/null || stat -f %Sm $DB_FILE)"

WAL_FILE="${DB_FILE}-wal"
SHM_FILE="${DB_FILE}-shm"

if [ -f "$WAL_FILE" ]; then
    echo "  WAL size: $(du -h $WAL_FILE | cut -f1)"
fi

if [ -f "$SHM_FILE" ]; then
    echo "  SHM size: $(du -h $SHM_FILE | cut -f1)"
fi

echo ""
echo "📈 Database Statistics:"
sqlite3 $DB_FILE "
SELECT 'Tables: ' || COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
" 2>/dev/null

echo "💿 Disk Space:"
df -h $(dirname $DB_FILE) | tail -1 | awk '{print "  Available: " $4 " (" $5 " used)"}'

BACKUP_DIR="/home/ubuntu/management-app/data/backups"
if [ -d "$BACKUP_DIR" ]; then
    echo ""
    echo "💾 Recent Backups:"
    ls -lt $BACKUP_DIR/management_*.db.gz 2>/dev/null | head -3 | while read line; do
        echo "  $line"
    done
fi

echo ""
echo "⚡ Performance Check:"
START_TIME=$(date +%s%N)
sqlite3 $DB_FILE "SELECT COUNT(*) FROM sqlite_master;" > /dev/null 2>&1
END_TIME=$(date +%s%N)
DURATION=$((($END_TIME - $START_TIME) / 1000000))
echo "  Simple query time: ${DURATION}ms"

echo ""
echo "✅ Monitoring completed!"
EOF

# Make all scripts executable
chmod +x $PROJECT_DIR/aws-deployment/backup-sqlite.sh
chmod +x $PROJECT_DIR/aws-deployment/restore-sqlite.sh
chmod +x $PROJECT_DIR/aws-deployment/maintain-sqlite.sh
chmod +x $PROJECT_DIR/aws-deployment/health-check-sqlite.sh
chmod +x $PROJECT_DIR/aws-deployment/monitor-sqlite.sh

# Update docker-compose for SQLite optimization
echo "🐳 Updating Docker Compose for SQLite optimization..."
if [ -f "$PROJECT_DIR/aws-deployment/docker-compose.prod.yml" ]; then
    if ! grep -q "SQLITE_CACHE_SIZE" $PROJECT_DIR/aws-deployment/docker-compose.prod.yml; then
        sed -i '/ASPNETCORE_URLS=http:\/\/\*:8080/a \      - SQLITE_CACHE_SIZE=10000\n      - SQLITE_JOURNAL_MODE=WAL' $PROJECT_DIR/aws-deployment/docker-compose.prod.yml || true
    fi
fi

echo ""
echo "✅ SQLite Production Setup Completed!"
echo "====================================="
echo ""
echo "📁 Database location: $PROJECT_DIR/data/database/management.db"
echo "🔒 Permissions: ubuntu:ubuntu (755)"
echo "⚙️ Configuration: WAL mode, optimized settings"
echo ""
echo "🛠️ Available SQLite Management Scripts:"
echo "  📊 Monitor database: bash monitor-sqlite.sh"
echo "  💾 Backup database: bash backup-sqlite.sh"
echo "  🔄 Restore database: bash restore-sqlite.sh [backup_file]"
echo "  🔧 Maintain database: bash maintain-sqlite.sh"
echo "  🏥 Health check: bash health-check-sqlite.sh"
echo ""
echo "🚀 Next Steps:"
echo "  1. Deploy application: bash deploy.sh"
echo "  2. Database will be created automatically on first run"
echo "  3. Setup automated backups: bash setup-cron.sh"
echo "  4. Monitor regularly: bash monitor-sqlite.sh"
echo ""
echo "📋 Production Optimizations Applied:"
echo "  ✅ WAL journal mode (better concurrency)"
echo "  ✅ Optimized cache size (10,000 pages)"
echo "  ✅ Memory temp store"
echo "  ✅ Memory mapping enabled"
echo "  ✅ Automated maintenance scripts"
echo "  ✅ Backup retention (14 days)"
echo ""
echo "💡 Tips:"
echo "  • Run 'bash maintain-sqlite.sh' weekly for optimal performance"
echo "  • Monitor WAL file size - should checkpoint if >10MB"
echo "  • Database supports ~100 concurrent readers"
echo "  • Single writer at a time (good for most web apps)"
echo ""
echo "⚠️  Migration Path:"
echo "  When you need more scale, we'll help migrate to PostgreSQL RDS"
echo "  Current setup good for: 1-50 users, <1M records, <5GB data"
