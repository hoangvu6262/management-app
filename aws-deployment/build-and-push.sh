#!/bin/bash
# Local build and push script
# File: build-and-push.sh

set -e

# Configuration
DOCKER_HUB_USERNAME="hoangvubg"  # Docker Hub username của bạn
APP_NAME="managementapp"
VERSION=${1:-latest}

echo "🐳 Building and pushing Docker images..."
echo "Username: $DOCKER_HUB_USERNAME"
echo "Version: $VERSION"

# Login to Docker Hub (chỉ cần 1 lần)
echo "🔐 Logging in to Docker Hub..."
docker login

# Build client-app
echo "🏗️ Building client-app..."
cd ../client-app
docker build -f Dockerfile.prod -t ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:${VERSION} \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost/api \
  --build-arg NEXT_PUBLIC_APP_NAME="Management App" \
  --build-arg NEXT_PUBLIC_APP_VERSION="1.0.0" .

# Build server-app
echo "🏗️ Building server-app..."
cd ../server-app
docker build -f Dockerfile.prod -t ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:${VERSION} .

# Push images
echo "📤 Pushing client-app..."
docker push ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:${VERSION}

echo "📤 Pushing server-app..."
docker push ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:${VERSION}

# Tag as latest if version is not latest
if [ "$VERSION" != "latest" ]; then
    echo "🏷️ Tagging as latest..."
    docker tag ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:${VERSION} ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:latest
    docker tag ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:${VERSION} ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:latest
    
    docker push ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:latest
    docker push ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:latest
fi

echo "✅ Build and push completed!"
echo "Images pushed:"
echo "  - ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:${VERSION}"
echo "  - ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:${VERSION}"

# Clean up local images to save space
echo "🧹 Cleaning up local images..."
docker rmi ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:${VERSION} || true
docker rmi ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:${VERSION} || true

cd ../aws-deployment
