#!/bin/bash
# Deployment Script
# Run as: bash deploy.sh

set -e

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/ubuntu/management-app

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "🌐 EC2 Public IP: $EC2_PUBLIC_IP"

# Update environment variables
echo "⚙️ Updating environment variables..."
cat > aws-deployment/.env << EOF
NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
EC2_PUBLIC_IP=$EC2_PUBLIC_IP
EOF

# Export environment variables for docker-compose
export NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api
export NEXT_PUBLIC_APP_NAME="Management App"
export NEXT_PUBLIC_APP_VERSION="1.0.0"

# Stop existing containers
echo "🛑 Stopping existing containers..."
cd aws-deployment
docker-compose -f docker-compose.prod.yml down || true

# Clean up old images and containers to save space
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start new containers
echo "🏗️ Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 60

# Health check
echo "🏥 Performing health check..."
MAX_ATTEMPTS=10
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Health check attempt $ATTEMPT/$MAX_ATTEMPTS..."
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        break
    else
        if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
            echo "❌ Health check failed after $MAX_ATTEMPTS attempts!"
            echo "📋 Checking container logs..."
            docker-compose -f docker-compose.prod.yml logs --tail=50
            exit 1
        fi
        echo "⏳ Waiting 10 seconds before retry..."
        sleep 10
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

# Check container status
echo "🐳 Container status:"
docker-compose -f docker-compose.prod.yml ps

# Show resource usage
echo "📊 Resource usage:"
docker stats --no-stream

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌍 Your app is available at:"
echo "   Frontend: http://$EC2_PUBLIC_IP"
echo "   API: http://$EC2_PUBLIC_IP/api"
echo "   Health: http://$EC2_PUBLIC_IP/health"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f aws-deployment/docker-compose.prod.yml logs -f"
echo "   Restart: docker-compose -f aws-deployment/docker-compose.prod.yml restart"
echo "   Stop: docker-compose -f aws-deployment/docker-compose.prod.yml down"
echo "   Monitor: bash aws-deployment/monitor.sh"
