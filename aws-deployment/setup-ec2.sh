#!/bin/bash
# AWS EC2 System Setup Script
# Run as: sudo bash setup-ec2.sh

set -e

echo "🚀 Setting up AWS EC2 instance for ManagementApp..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential tools
echo "🔧 Installing essential tools..."
apt install -y curl wget git unzip software-properties-common htop net-tools ufw

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu
systemctl enable docker
systemctl start docker

# Install Docker Compose
echo "🐙 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js (backup for development)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install .NET 8 SDK (backup)
echo "⚡ Installing .NET 8 SDK..."
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
apt-get update
apt-get install -y dotnet-sdk-8.0

# Install Nginx
echo "🌐 Installing Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx

# Setup firewall
echo "🛡️ Setting up firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 80
ufw allow 443
ufw allow 3000
ufw allow 5000
ufw --force enable

# Setup swap (important for 1GB RAM)
echo "💾 Setting up swap file..."
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Optimize Docker for low memory
echo "🔧 Optimizing Docker for low memory..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

systemctl restart docker

# Create app directory
echo "📁 Creating application directory..."
mkdir -p /home/ubuntu/apps
chown ubuntu:ubuntu /home/ubuntu/apps

# Install certbot for SSL (optional)
echo "🔒 Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx

echo "✅ EC2 setup completed successfully!"
echo "🔄 Please reboot the instance and then run the project setup script."
echo "💡 Commands to run after reboot:"
echo "   sudo reboot"
echo "   # After reboot:"
echo "   bash setup-project.sh"
