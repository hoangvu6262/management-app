#!/bin/bash
# Fast deployment script using pre-built Docker Hub images
# File: deploy-from-hub.sh

set -e

# Configuration
DOCKER_HUB_USERNAME=${DOCKER_HUB_USERNAME:-"your-dockerhub-username"}  # Set this environment variable
IMAGE_TAG=${IMAGE_TAG:-"latest"}

echo "🚀 Fast deployment from Docker Hub..."
echo "Username: $DOCKER_HUB_USERNAME"
echo "Image Tag: $IMAGE_TAG"

# Navigate to project directory
cd /home/ubuntu/management-app

# Pull latest changes for configs
echo "📥 Pulling latest configs..."
git pull origin main

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "🌐 EC2 Public IP: $EC2_PUBLIC_IP"

# Update environment variables
echo "⚙️ Updating environment variables..."
cat > aws-deployment/.env << EOF
DOCKER_HUB_USERNAME=$DOCKER_HUB_USERNAME
IMAGE_TAG=$IMAGE_TAG
NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
EC2_PUBLIC_IP=$EC2_PUBLIC_IP
EOF

# Export environment variables for docker-compose
export DOCKER_HUB_USERNAME=$DOCKER_HUB_USERNAME
export IMAGE_TAG=$IMAGE_TAG
export NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api
export NEXT_PUBLIC_APP_NAME="Management App"
export NEXT_PUBLIC_APP_VERSION="1.0.0"

# Stop existing containers
echo "🛑 Stopping existing containers..."
cd aws-deployment
docker-compose -f docker-compose.hub.yml down || true

# Clean up old containers and images
echo "🧹 Cleaning up old resources..."
docker system prune -f

# Pull latest images
echo "📥 Pulling latest images from Docker Hub..."
docker pull ${DOCKER_HUB_USERNAME}/managementapp-server:${IMAGE_TAG}
docker pull ${DOCKER_HUB_USERNAME}/managementapp-client:${IMAGE_TAG}

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.hub.yml up -d

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
            docker-compose -f docker-compose.hub.yml logs --tail=50
            exit 1
        fi
        echo "⏳ Waiting 10 seconds before retry..."
        sleep 10
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

# Check container status
echo "🐳 Container status:"
docker-compose -f docker-compose.hub.yml ps

# Show resource usage
echo "📊 Resource usage:"
docker stats --no-stream

echo ""
echo "🎉 Fast deployment completed successfully!"
echo "🌍 Your app is available at:"
echo "   Frontend: http://$EC2_PUBLIC_IP"
echo "   API: http://$EC2_PUBLIC_IP/api"
echo "   Health: http://$EC2_PUBLIC_IP/health"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.hub.yml logs -f"
echo "   Restart: docker-compose -f docker-compose.hub.yml restart"
echo "   Stop: docker-compose -f docker-compose.hub.yml down"
echo "   Update: bash deploy-from-hub.sh"
