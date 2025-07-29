#!/bin/bash

# Setup Environment Variables for EC2 Deployment
# Run this script on your EC2 instance before deploying

echo "Setting up environment variables for ManagementApp deployment..."

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

if [ -z "$EC2_PUBLIC_IP" ]; then
    echo "Could not retrieve EC2 public IP. Please enter manually:"
    read -p "Enter your EC2 public IP: " EC2_PUBLIC_IP
fi

echo "Using EC2 Public IP: $EC2_PUBLIC_IP"

# Create .env file for docker-compose
cat > .env << EOF
# Environment variables for Docker Compose
NEXT_PUBLIC_API_URL=http://$EC2_PUBLIC_IP/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

# Create production appsettings.json for server
cat > server-app/appsettings.Production.json << EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=management.db"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://$EC2_PUBLIC_IP",
      "https://$EC2_PUBLIC_IP",
      "http://localhost"
    ]
  },
  "JwtSettings": {
    "Secret": "$(openssl rand -base64 32)",
    "Issuer": "ManagementApp",
    "Audience": "ManagementApp",
    "ExpiryInMinutes": 60
  }
}
EOF

echo "Environment setup completed!"
echo "Files created:"
echo "- .env (for docker-compose)"
echo "- server-app/appsettings.Production.json"
echo ""
echo "You can now run: docker-compose up -d --build"
