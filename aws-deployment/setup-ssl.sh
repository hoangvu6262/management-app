#!/bin/bash
# SSL Setup Script using Let's Encrypt
# Run as: sudo bash setup-ssl.sh your-domain.com

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Error: Please provide a domain name"
    echo "Usage: sudo bash setup-ssl.sh your-domain.com"
    exit 1
fi

echo "🔒 Setting up SSL certificate for $DOMAIN..."

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Stop containers to free up port 80
echo "⏸️  Temporarily stopping containers..."
cd /home/ubuntu/ManagementApp/aws-deployment
docker-compose -f docker-compose.prod.yml stop nginx

# Get SSL certificate
echo "🎫 Obtaining SSL certificate..."
certbot certonly --standalone \
    --preferred-challenges http \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Create SSL directory in project
mkdir -p /home/ubuntu/ManagementApp/aws-deployment/ssl

# Copy certificates to project directory
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /home/ubuntu/ManagementApp/aws-deployment/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /home/ubuntu/ManagementApp/aws-deployment/ssl/

# Update docker-compose to use SSL nginx config
cp docker-compose.prod.yml docker-compose.prod.yml.backup

# Update environment variables for HTTPS
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
cat > /home/ubuntu/ManagementApp/client-app/.env.production << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF

cat > .env << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
EC2_PUBLIC_IP=$EC2_PUBLIC_IP
DOMAIN=$DOMAIN
EOF

# Update nginx config for SSL and replace server_name
sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx.prod.conf

# Start containers with SSL
echo "🚀 Starting containers with SSL..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
sleep 30

# Test SSL
echo "🧪 Testing SSL certificate..."
if curl -f https://$DOMAIN/health > /dev/null 2>&1; then
    echo "✅ SSL setup completed successfully!"
    echo "🔒 Your app is now available at: https://$DOMAIN"
else
    echo "⚠️  SSL setup completed but health check failed"
    echo "📋 Check container logs: docker-compose -f docker-compose.prod.yml logs"
fi

# Setup automatic renewal
echo "🔄 Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd /home/ubuntu/ManagementApp/aws-deployment && docker-compose -f docker-compose.prod.yml restart nginx'") | crontab -

echo ""
echo "📋 SSL Setup Summary:"
echo "===================="
echo "Domain: $DOMAIN"
echo "Certificate: /etc/letsencrypt/live/$DOMAIN/"
echo "Auto-renewal: Enabled (daily check at 12:00)"
echo "HTTPS URL: https://$DOMAIN"
echo ""
echo "💡 Note: Make sure your domain DNS points to your EC2 IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
