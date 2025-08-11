#!/bin/bash
# Complete AWS Deployment Script
# Run as: bash complete-deploy.sh

set -e

echo "🚀 ManagementApp Complete AWS Deployment"
echo "========================================"

# Check if running as root for system setup
if [[ $EUID -eq 0 ]]; then
    SETUP_SYSTEM=true
    echo "🔧 Running as root - will setup system dependencies"
else
    SETUP_SYSTEM=false
    echo "👤 Running as regular user - skipping system setup"
fi

# System setup (only if running as root)
if [ "$SETUP_SYSTEM" = true ]; then
    echo ""
    echo "📦 Step 1: System Setup"
    echo "======================="
    bash setup-ec2.sh
    
    echo ""
    echo "🔄 Please reboot the instance and run this script again as ubuntu user"
    echo "Command: sudo reboot"
    exit 0
fi

# Check if we're the ubuntu user
if [ "$(whoami)" != "ubuntu" ]; then
    echo "❌ Please run this script as ubuntu user after system reboot"
    exit 1
fi

echo ""
echo "🏗️ Step 2: Project Setup"
echo "========================"
bash setup-project.sh

echo ""
echo "🚀 Step 3: Initial Deployment"
echo "============================="
bash deploy.sh

echo ""
echo "⏰ Step 4: Setup Automation"
echo "==========================="
bash setup-cron.sh

echo ""
echo "💾 Step 5: Initial Backup"
echo "========================="
bash backup.sh

echo ""
echo "🎉 Deployment Completed Successfully!"
echo "===================================="

# Get EC2 public IP
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo ""
echo "📍 Your Application URLs:"
echo "  🌐 Frontend: http://$EC2_PUBLIC_IP"
echo "  🔗 API: http://$EC2_PUBLIC_IP/api"
echo "  ❤️  Health: http://$EC2_PUBLIC_IP/health"

echo ""
echo "🛠️ Management Commands:"
echo "  📊 Monitor: bash monitor.sh"
echo "  🔄 Redeploy: bash deploy.sh"
echo "  💾 Backup: bash backup.sh"
echo "  🔄 Restore: bash restore.sh [date]"
echo "  📋 Logs: docker-compose -f docker-compose.prod.yml logs -f"

echo ""
echo "🔒 Optional: Setup SSL Certificate"
echo "=================================="
echo "If you have a domain name, you can setup SSL:"
echo "  sudo bash setup-ssl.sh your-domain.com"

echo ""
echo "📋 Next Steps:"
echo "============="
echo "1. 🌐 Point your domain DNS to: $EC2_PUBLIC_IP"
echo "2. 🔒 Setup SSL certificate (optional)"
echo "3. 🔧 Customize your application settings"
echo "4. 📊 Monitor your application with: bash monitor.sh"

echo ""
echo "⚠️  Important Notes:"
echo "==================="
echo "• This setup uses AWS Free Tier (t2.micro)"
echo "• Free tier is valid for 12 months"
echo "• After 12 months, cost will be ~$8-10/month"
echo "• Monitor your AWS billing dashboard"
echo "• Keep your EC2 instance updated: sudo apt update && sudo apt upgrade"

echo ""
echo "🎊 Happy coding!"
