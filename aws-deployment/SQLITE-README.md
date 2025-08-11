# 🗄️ SQLite Production Setup

## 🎯 Tổng quan

Setup này tối ưu hóa SQLite cho production trên AWS EC2 với:
- ✅ **WAL mode** cho concurrent reads
- ✅ **Optimized cache settings**
- ✅ **Automated backup & maintenance**
- ✅ **Performance monitoring**
- ✅ **Production-ready configuration**

## 🚀 Quick Setup

### Option 1: All-in-one Setup
```bash
cd ManagementApp/aws-deployment
bash setup-with-sqlite.sh
```

### Option 2: Step-by-step
```bash
# 1. Setup SQLite
bash setup-sqlite.sh

# 2. Deploy application
bash deploy.sh

# 3. Setup automation
bash setup-cron.sh
```

## 🛠️ SQLite Management Commands

### Daily Operations
```bash
# Monitor database status
bash monitor-sqlite.sh

# Check database health
bash health-check-sqlite.sh

# Manual backup
bash backup-sqlite.sh
```

### Maintenance
```bash
# Weekly maintenance (run automatically via cron)
bash maintain-sqlite.sh

# Restore from backup
bash restore-sqlite.sh management_20241201_140000.db.gz
```

## 📊 Performance Specifications

### SQLite Limits & Capabilities
| Metric | SQLite Performance |
|--------|-------------------|
| **Concurrent Readers** | ~100 users |
| **Concurrent Writers** | 1 (single writer) |
| **Database Size** | Up to 281TB (practical: <5GB) |
| **Record Count** | Millions (practical: <1M) |
| **Query Performance** | Very fast for reads |
| **Transaction Speed** | ~50,000 writes/sec |

### When to Migrate
❌ **Migrate when you hit these limits:**
- More than 50 concurrent users
- Database size > 5GB
- Need multiple writers
- Complex analytics queries
- Geographic distribution needed

## 🔧 Configuration Details

### SQLite Settings Applied
```sql
PRAGMA journal_mode = WAL;           -- Better concurrency
PRAGMA synchronous = NORMAL;         -- Balanced safety/speed
PRAGMA cache_size = 10000;           -- 40MB cache
PRAGMA temp_store = MEMORY;          -- Fast temp operations
PRAGMA mmap_size = 268435456;        -- 256MB memory mapping
```

### Connection String
```
Data Source=/app/data/database/management.db;
Cache=Shared;
Pooling=true;
Journal Mode=WAL;
Synchronous=NORMAL;
Temp Store=MEMORY;
Mmap Size=268435456;
```

## 📁 File Structure

```
ManagementApp/
├── data/
│   ├── database/
│   │   ├── management.db          # Main database
│   │   ├── management.db-wal      # WAL file
│   │   └── management.db-shm      # Shared memory
│   ├── backups/
│   │   └── management_*.db.gz     # Compressed backups
│   └── logs/
└── aws-deployment/
    ├── setup-sqlite.sh            # Initial setup
    ├── backup-sqlite.sh           # Backup script
    ├── restore-sqlite.sh          # Restore script
    ├── maintain-sqlite.sh         # Maintenance
    ├── monitor-sqlite.sh          # Monitoring
    └── health-check-sqlite.sh     # Health checks
```

## 🔄 Automated Maintenance

### Cron Jobs (setup automatically)
```bash
# Health check every 5 minutes
*/5 * * * * /home/ubuntu/cron-scripts/health-check.sh

# Daily restart at 3 AM
0 3 * * * /home/ubuntu/cron-scripts/daily-restart.sh

# Weekly backup on Sundays at 2 AM
0 2 * * 0 cd /home/ubuntu/ManagementApp/aws-deployment && bash backup-sqlite.sh

# Weekly maintenance on Sundays at 4 AM
0 4 * * 0 cd /home/ubuntu/ManagementApp/aws-deployment && bash maintain-sqlite.sh
```

## 💾 Backup Strategy

### Automatic Backups
- **Frequency**: Weekly (Sundays 2 AM)
- **Retention**: 14 days
- **Method**: SQLite `.backup` command (online backup)
- **Compression**: gzip
- **Location**: `/home/ubuntu/ManagementApp/data/backups/`

### Manual Backup
```bash
# Create backup now
bash backup-sqlite.sh

# List available backups
ls -la /home/ubuntu/ManagementApp/data/backups/

# Restore from specific backup
bash restore-sqlite.sh management_20241201_140000.db.gz
```

## 🏥 Monitoring & Health Checks

### Real-time Monitoring
```bash
# Database dashboard
bash monitor-sqlite.sh

# Continuous monitoring
watch -n 30 'bash monitor-sqlite.sh'
```

### Health Check Indicators
- ✅ **Database integrity**: PRAGMA integrity_check
- ✅ **File permissions**: Read/write access
- ✅ **WAL file size**: Should be <10MB
- ✅ **Response time**: Query performance
- ✅ **Disk space**: Available storage

## 🚨 Troubleshooting

### Common Issues

#### Database Lock Errors
```bash
# Check for long-running connections
lsof /home/ubuntu/ManagementApp/data/database/management.db

# Restart application
cd /home/ubuntu/ManagementApp/aws-deployment
docker-compose -f docker-compose.prod.yml restart server-app
```

#### Large WAL File
```bash
# Check WAL file size
ls -lah /home/ubuntu/ManagementApp/data/database/management.db-wal

# Force checkpoint if >10MB
bash maintain-sqlite.sh
```

#### Performance Issues
```bash
# Run maintenance
bash maintain-sqlite.sh

# Check disk space
df -h

# Monitor queries
bash monitor-sqlite.sh
```

#### Corruption Check
```bash
# Check database integrity
bash health-check-sqlite.sh

# Manual integrity check
sqlite3 /home/ubuntu/ManagementApp/data/database/management.db "PRAGMA integrity_check;"
```

## 🔧 Advanced Configuration

### Custom Optimizations
```bash
# Edit SQLite settings in appsettings.Production.json
nano /home/ubuntu/ManagementApp/server-app/appsettings.Production.json

# Update connection string for specific needs
# Example: Increase cache size for more memory
"DefaultConnection": "Data Source=/app/data/database/management.db;Cache=Shared;Pooling=true;Journal Mode=WAL;Synchronous=NORMAL;Temp Store=MEMORY;Mmap Size=536870912;Cache Size=20000;"
```

### Performance Tuning
```sql
-- Manual optimizations (run in sqlite3 CLI)
PRAGMA cache_size = 20000;         -- 80MB cache
PRAGMA mmap_size = 536870912;      -- 512MB memory mapping
PRAGMA optimize;                   -- Optimize indexes
```

## 🔮 Migration Path

### To PostgreSQL RDS
When ready to scale:

1. **Setup RDS PostgreSQL**
2. **Export SQLite data**
3. **Convert schema**
4. **Import to PostgreSQL**
5. **Update connection strings**
6. **Deploy with new database**

*Migration scripts will be provided when needed.*

## 💰 Cost Analysis

### Current Setup (SQLite)
- **Database**: $0 (included with EC2)
- **Storage**: $0 (within 30GB free tier)
- **Backup**: $0 (local storage)
- **Total**: $0/month

### Migration Costs
- **PostgreSQL RDS db.t3.micro**: ~$15-25/month
- **Storage**: ~$2-5/month (20-50GB)
- **Backup**: ~$1-2/month
- **Total**: ~$18-32/month

## 📞 Support

### Common Commands Reference
```bash
# Setup
bash setup-sqlite.sh

# Operations
bash deploy.sh
bash monitor-sqlite.sh
bash backup-sqlite.sh
bash maintain-sqlite.sh

# Troubleshooting
bash health-check-sqlite.sh
docker-compose -f docker-compose.prod.yml logs server-app
```

### Getting Help
- Check logs: `bash monitor-sqlite.sh`
- Health status: `bash health-check-sqlite.sh`
- Database integrity: `sqlite3 management.db "PRAGMA integrity_check;"`

---

**✅ Your SQLite setup is production-ready for small to medium applications!**

Need to scale? Contact for PostgreSQL migration assistance! 🚀
