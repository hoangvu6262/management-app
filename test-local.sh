#!/bin/bash
chmod +x test-local.sh

# Quick Local Test Script
# Use this to test your changes locally before deploying to EC2

echo "🧪 Testing ManagementApp locally with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create local environment file
echo "⚙️ Setting up local environment..."
cat > .env << EOF
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_APP_NAME=Management App (Local)
NEXT_PUBLIC_APP_VERSION=1.0.0-local
EOF

# Create local appsettings for server
echo "⚙️ Setting up server configuration..."
cat > server-app/appsettings.json << EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=management.db"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost",
      "http://localhost:3000"
    ]
  },
  "JwtSettings": {
    "Secret": "LocalTestingSecretKeyForDevelopmentOnly123456789",
    "Issuer": "ManagementApp",
    "Audience": "ManagementApp",
    "ExpiryInMinutes": 60
  }
}
EOF

echo "🔨 Building and starting containers..."
docker-compose down
docker-compose build
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ Local testing setup complete!"
echo "🌐 Frontend: http://localhost"
echo "🔌 Backend API: http://localhost/api"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
