#!/bin/bash
# Project Setup Script
# Run as: bash setup-project.sh

set -e

echo "🏗️ Setting up ManagementApp project..."

# Navigate to home directory
cd /home/ubuntu

# Clone repository (replace with your actual repository URL)
echo "📥 Cloning repository..."
if [ ! -d "ManagementApp" ]; then
    # Replace this URL with your actual repository
    git clone git@github.com:hoangvu6262/management-app.git
    echo "⚠️  Please update the git clone URL in this script with your actual repository"
else
    echo "📁 Repository already exists, pulling latest changes..."
    cd ManagementApp
    git pull origin main
    cd ..
fi

cd ManagementApp

# Create data directory for database
echo "📊 Creating data directory..."
mkdir -p data
sudo chown -R ubuntu:ubuntu data

# Get EC2 public IP
echo "🌐 Getting EC2 public IP..."
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "Your EC2 Public IP: $EC2_PUBLIC_IP"

# Setup environment variables for client
echo "⚙️ Setting up environment variables..."
if [ ! -f "client-app/.env.production" ]; then
    cp client-app/.env.production.template client-app/.env.production
fi

# Update client environment with EC2 IP
cat > client-app/.env.production << EOF
NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

# Setup environment variables for server
if [ ! -f "server-app/appsettings.Production.json" ]; then
    cp server-app/appsettings.Production.template.json server-app/appsettings.Production.json
fi

# Create production environment file for Docker Compose
cat > aws-deployment/.env << EOF
NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
EC2_PUBLIC_IP=$EC2_PUBLIC_IP
EOF

# Update nginx config with correct paths
sed -i "s/your-ec2-ip/$EC2_PUBLIC_IP/g" aws-deployment/nginx.prod.conf
sed -i "s/your-domain.com/$EC2_PUBLIC_IP/g" aws-deployment/nginx.prod.conf

echo "✅ Project setup completed!"
echo "🚀 You can now run: bash deploy.sh"
echo "🌍 Your app will be available at: http://$EC2_PUBLIC_IP"
