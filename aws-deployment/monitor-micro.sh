#!/bin/bash
# t2.micro monitoring script (updated for Docker Hub workflow)
# File: monitor-micro.sh

echo "🔍 t2.micro System Monitoring"
echo "=============================="

# Check EC2 CPU Credits
echo "💳 CPU Credits (if available via CloudWatch):"
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUCreditBalance \
  --dimensions Name=InstanceId,Value=$(curl -s http://169.254.169.254/latest/meta-data/instance-id) \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Average 2>/dev/null || echo "CloudWatch CLI not configured"

echo ""
echo "💾 Memory Usage:"
free -h
echo ""

echo "💿 Disk Usage:" 
df -h /
echo ""

echo "🔥 CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4"%"}'
echo ""

echo "🐳 Docker Stats:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
echo ""

echo "📊 Container Status:"
docker-compose -f /home/ubuntu/management-app/aws-deployment/docker-compose.hub.yml ps
echo ""

echo "🌡️ System Load:"
uptime
echo ""

echo "📈 Memory Details:"
cat /proc/meminfo | grep -E "(MemTotal|MemFree|MemAvailable|SwapTotal|SwapFree)"
echo ""

echo "⚠️  Alerts:"
# Memory alert
MEMORY_USAGE=$(free | awk 'FNR==2{printf "%.0f", ($3/($3+$4))*100}')
if [ $MEMORY_USAGE -gt 80 ]; then
    echo "🚨 HIGH MEMORY USAGE: ${MEMORY_USAGE}%"
fi

# Disk alert  
DISK_USAGE=$(df / | awk 'FNR==2{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "🚨 HIGH DISK USAGE: ${DISK_USAGE}%"
fi

# Check if any containers are down
DOWN_CONTAINERS=$(docker-compose -f /home/ubuntu/management-app/aws-deployment/docker-compose.hub.yml ps -q --filter "status=exited")
if [ ! -z "$DOWN_CONTAINERS" ]; then
    echo "🚨 CONTAINERS DOWN: $DOWN_CONTAINERS"
fi

echo ""
echo "🔧 Quick Actions:"
echo "- Restart containers: cd /home/ubuntu/management-app/aws-deployment && docker-compose -f docker-compose.hub.yml restart"
echo "- Clean up Docker: docker system prune -f"
echo "- Check logs: docker-compose -f docker-compose.hub.yml logs -f"
echo "- Free memory: echo 3 | sudo tee /proc/sys/vm/drop_caches"
echo "- Redeploy: bash deploy-from-hub.sh"
