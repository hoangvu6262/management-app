#!/bin/bash
# Local build and push script (Multi-platform)
# File: build-and-push.sh

set -e

# Configuration
DOCKER_HUB_USERNAME="hoangvubg"  # Docker Hub username của bạn
APP_NAME="managementapp"
VERSION=${1:-latest}

echo "🐳 Building and pushing Docker images (Multi-platform)..."
echo "Username: $DOCKER_HUB_USERNAME"
echo "Version: $VERSION"

# Setup buildx if not exists
echo "🔧 Setting up Docker Buildx..."
docker buildx create --name multiplatform --use --bootstrap 2>/dev/null || true
docker buildx use multiplatform

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
docker login

# Build and push client-app (multi-platform)
echo "🏗️ Building client-app (multi-platform)..."
cd ../client-app
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Dockerfile.prod \
  -t ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:${VERSION} \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost/api \
  --build-arg NEXT_PUBLIC_APP_NAME="Management App" \
  --build-arg NEXT_PUBLIC_APP_VERSION="1.0.0" \
  --push .

# Build and push server-app (multi-platform)
echo "🏗️ Building server-app (multi-platform)..."
cd ../server-app
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Dockerfile.prod \
  -t ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:${VERSION} \
  --push .

# Tag as latest if version is not latest
if [ "$VERSION" != "latest" ]; then
    echo "🏷️ Tagging as latest..."
    
    # Build and push latest tags
    cd ../client-app
    docker buildx build \
      --platform linux/amd64,linux/arm64 \
      -f Dockerfile.prod \
      -t ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:latest \
      --build-arg NEXT_PUBLIC_API_URL=http://localhost/api \
      --build-arg NEXT_PUBLIC_APP_NAME="Management App" \
      --build-arg NEXT_PUBLIC_APP_VERSION="1.0.0" \
      --push .
    
    cd ../server-app
    docker buildx build \
      --platform linux/amd64,linux/arm64 \
      -f Dockerfile.prod \
      -t ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:latest \
      --push .
fi

echo "✅ Build and push completed!"
echo "Images pushed:"
echo "  - ${DOCKER_HUB_USERNAME}/${APP_NAME}-client:${VERSION}"
echo "  - ${DOCKER_HUB_USERNAME}/${APP_NAME}-server:${VERSION}"

echo "🧹 Cleaning up local build cache..."
docker buildx prune -f

cd ../aws-deployment
