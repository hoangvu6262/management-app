#!/bin/bash
# Monitoring Script
# Run as: bash monitor.sh

echo "📊 ManagementApp System Monitoring"
echo "=================================="
echo "Timestamp: $(date)"
echo ""

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "🌐 Public IP: $EC2_PUBLIC_IP"
echo ""

# System resources
echo "💻 System Resources:"
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "  " 100 - $1"% used"}'

echo "Memory Usage:"
free -h | awk 'NR==2{printf "  %s/%s (%.2f%%)\n", $3,$2,$3*100/$2 }'

echo "Disk Usage:"
df -h | awk '$NF=="/"{printf "  %s/%s (%s)\n", $3,$2,$5}'

echo "Swap Usage:"
free -h | awk 'NR==3{printf "  %s/%s\n", $3,$2 }'
echo ""

# Docker containers
echo "🐳 Docker Containers:"
cd /home/ubuntu/ManagementApp/aws-deployment
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    docker-compose -f docker-compose.prod.yml ps
else
    echo "  ⚠️  No containers running"
fi
echo ""

# Container resource usage
echo "📈 Container Resource Usage:"
if docker ps -q | wc -l | grep -q "0"; then
    echo "  No containers running"
else
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
fi
echo ""

# Application health checks
echo "🏥 Application Health Checks:"
echo -n "  Nginx Health: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost/health | grep -q "200"; then
    echo "✅ Healthy"
else
    echo "❌ Unhealthy"
fi

echo -n "  API Health: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health 2>/dev/null | grep -q "200"; then
    echo "✅ Healthy"
else
    echo "❌ Unhealthy (or endpoint not available)"
fi

echo -n "  Frontend: "
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    echo "✅ Responding"
else
    echo "❌ Not responding"
fi
echo ""

# Network connections
echo "🌐 Network Connections:"
echo "  Active connections to port 80:"
netstat -an | grep :80 | grep ESTABLISHED | wc -l | awk '{print "    " $1 " connections"}'

echo "  Active connections to port 3000:"
netstat -an | grep :3000 | grep ESTABLISHED | wc -l | awk '{print "    " $1 " connections"}'

echo "  Active connections to port 5000:"
netstat -an | grep :5000 | grep ESTABLISHED | wc -l | awk '{print "    " $1 " connections"}'
echo ""

# Recent logs (last 20 lines from each service)
echo "📋 Recent Logs (last 10 lines each):"
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "  🌐 Nginx logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=5 nginx | tail -5
    echo ""
    
    echo "  ⚛️  Client app logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=5 client-app | tail -5
    echo ""
    
    echo "  🏗️ Server app logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=5 server-app | tail -5
    echo ""
else
    echo "  No containers running to show logs"
fi

# Disk space warning
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  WARNING: Disk usage is at ${DISK_USAGE}%!"
    echo "   Consider cleaning up with: docker system prune -f"
fi

# Memory usage warning
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2 }')
if [ $MEM_USAGE -gt 85 ]; then
    echo "⚠️  WARNING: Memory usage is at ${MEM_USAGE}%!"
    echo "   Consider restarting containers if performance is slow"
fi

echo ""
echo "🔗 Quick Links:"
echo "  Frontend: http://$EC2_PUBLIC_IP"
echo "  API Docs: http://$EC2_PUBLIC_IP/api/swagger (if enabled)"
echo "  Health: http://$EC2_PUBLIC_IP/health"
echo ""
echo "🛠️  Management Commands:"
echo "  Restart all: docker-compose -f docker-compose.prod.yml restart"
echo "  View live logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Redeploy: bash deploy.sh"
