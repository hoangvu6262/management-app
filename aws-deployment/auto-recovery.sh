#!/bin/bash
# Auto recovery script for t2.micro (updated for Docker Hub workflow)
# File: auto-recovery.sh

LOG_FILE="/home/ubuntu/logs/auto-recovery.log"
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "🔄 Starting auto-recovery check..."

# Check if containers are running
cd /home/ubuntu/management-app/aws-deployment

RUNNING_CONTAINERS=$(docker-compose -f docker-compose.hub.yml ps -q --filter "status=running" | wc -l)
EXPECTED_CONTAINERS=3

log "Running containers: $RUNNING_CONTAINERS/$EXPECTED_CONTAINERS"

if [ $RUNNING_CONTAINERS -lt $EXPECTED_CONTAINERS ]; then
    log "⚠️ Some containers are down. Starting recovery..."
    
    # Stop all containers
    log "Stopping all containers..."
    docker-compose -f docker-compose.hub.yml down
    
    # Clean up
    log "Cleaning up Docker resources..."
    docker system prune -f
    
    # Check memory
    AVAILABLE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    log "Available memory: ${AVAILABLE_MEM}MB"
    
    if [ $AVAILABLE_MEM -lt 200 ]; then
        log "🧹 Low memory detected. Clearing cache..."
        echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null
        
        # Add temporary swap if needed
        if [ ! -f /tmp/recovery-swap ]; then
            log "Adding temporary swap..."
            sudo dd if=/dev/zero of=/tmp/recovery-swap bs=1M count=512 2>/dev/null
            sudo chmod 600 /tmp/recovery-swap
            sudo mkswap /tmp/recovery-swap > /dev/null 2>&1
            sudo swapon /tmp/recovery-swap
        fi
    fi
    
    # Start containers one by one
    log "Starting server-app..."
    docker-compose -f docker-compose.hub.yml up -d server-app
    sleep 30
    
    log "Starting client-app..."
    docker-compose -f docker-compose.hub.yml up -d client-app
    sleep 30
    
    log "Starting nginx..."
    docker-compose -f docker-compose.hub.yml up -d nginx
    sleep 15
    
    # Health check
    for i in {1..5}; do
        if curl -f http://localhost/health > /dev/null 2>&1; then
            log "✅ Recovery successful! All services are running."
            break
        else
            log "⏳ Waiting for services... ($i/5)"
            sleep 15
        fi
    done
    
    # Remove temporary swap
    if [ -f /tmp/recovery-swap ]; then
        sudo swapoff /tmp/recovery-swap 2>/dev/null
        sudo rm /tmp/recovery-swap
        log "Removed temporary swap"
    fi
    
else
    log "✅ All containers are running normally"
fi

# Check health endpoint
if curl -f http://localhost/health > /dev/null 2>&1; then
    log "✅ Health check passed"
else
    log "❌ Health check failed"
    
    # Try to restart nginx only
    log "Restarting nginx..."
    docker-compose -f docker-compose.hub.yml restart nginx
fi

log "🏁 Auto-recovery check completed"
