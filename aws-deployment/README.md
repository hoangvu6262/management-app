# AWS Deployment Scripts cho ManagementApp

Thư mục này chứa tất cả các script và cấu hình cần thiết để deploy ManagementApp lên AWS EC2 Free Tier.

## 📋 Danh sách Files

### 🚀 Deployment Scripts
- `complete-deploy.sh` - Script deploy hoàn chỉnh (chạy tất cả)
- `setup-ec2.sh` - Cài đặt system dependencies trên EC2
- `setup-project.sh` - Thiết lập project và environment
- `deploy.sh` - Deploy application
- `setup-ssl.sh` - Thiết lập SSL certificate với Let's Encrypt

### 🔧 Maintenance Scripts  
- `monitor.sh` - Giám sát hệ thống và containers
- `backup.sh` - Backup database và application
- `restore.sh` - Restore từ backup
- `setup-cron.sh` - Thiết lập automated maintenance

### ⚙️ Configuration Files
- `docker-compose.prod.yml` - Production Docker Compose
- `nginx.prod.conf` - Production Nginx configuration
- `.env` - Environment variables (tự động tạo)

## 🚀 Hướng dẫn Deploy

### Bước 1: Tạo EC2 Instance
1. Đăng nhập AWS Console
2. Launch EC2 Instance:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.micro (Free tier)
   - **Storage**: 30 GB gp2/gp3
   - **Security Group**: Mở ports 22, 80, 443, 3000, 5000
3. Download key pair (.pem file)

### Bước 2: Kết nối và Deploy
```bash
# Kết nối SSH
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone repository
git clone https://github.com/yourusername/ManagementApp.git
cd ManagementApp/aws-deployment

# Chạy complete deployment (as root first time)
sudo bash complete-deploy.sh

# Sau khi reboot, chạy lại as ubuntu user
bash complete-deploy.sh
```

### Bước 3: Thiết lập Domain (Optional)
```bash
# Nếu có domain name
sudo bash setup-ssl.sh your-domain.com
```

## 📊 Commands Thường dùng

### Deployment
```bash
# Deploy/redeploy
bash deploy.sh

# Monitor hệ thống
bash monitor.sh

# Backup
bash backup.sh

# Restore từ backup
bash restore.sh 20241201_140000
```

### Docker Management
```bash
# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# Stop containers
docker-compose -f docker-compose.prod.yml down

# Rebuild và start
docker-compose -f docker-compose.prod.yml up -d --build

# Xem container status
docker-compose -f docker-compose.prod.yml ps

# Container stats
docker stats
```

### System Maintenance
```bash
# Cleanup Docker
docker system prune -f

# Check disk space
df -h

# Check memory
free -h

# Check processes
htop

# View cron jobs
crontab -l

# Check logs
tail -f /home/ubuntu/logs/health-check.log
```

## 🔧 Cấu hình Tự động

Script `setup-cron.sh` tự động thiết lập:

- **Health Check**: Mỗi 5 phút
- **Daily Restart**: 3:00 AM hàng ngày  
- **Weekly Backup**: 2:00 AM Chủ nhật
- **System Cleanup**: 4:00 AM Chủ nhật

## 📁 Cấu trúc Thư mục

```
aws-deployment/
├── complete-deploy.sh      # Script deploy hoàn chỉnh
├── setup-ec2.sh           # Setup EC2 instance
├── setup-project.sh       # Setup project
├── deploy.sh              # Deploy application
├── setup-ssl.sh           # Setup SSL
├── monitor.sh             # System monitoring
├── backup.sh              # Backup script
├── restore.sh             # Restore script
├── setup-cron.sh          # Setup automation
├── docker-compose.prod.yml # Production compose
├── nginx.prod.conf        # Nginx config
└── README.md              # This file
```

## 🛡️ Security Best Practices

### AWS Security Group
```json
{
  "SecurityGroupRules": [
    {"Protocol": "tcp", "Port": 22, "Source": "YOUR_IP/32"},
    {"Protocol": "tcp", "Port": 80, "Source": "0.0.0.0/0"},
    {"Protocol": "tcp", "Port": 443, "Source": "0.0.0.0/0"}
  ]
}
```

### System Security
- UFW firewall enabled
- Regular security updates
- SSH key authentication
- Rate limiting in Nginx
- Security headers

## 📊 Monitoring và Logs

### Log Locations
- **Health checks**: `/home/ubuntu/logs/health-check.log`
- **Daily restarts**: `/home/ubuntu/logs/restart.log`
- **System cleanup**: `/home/ubuntu/logs/cleanup.log`
- **Application logs**: `docker-compose logs`

### Performance Monitoring
```bash
# Real-time monitoring
watch -n 2 'df -h && echo "" && free -h && echo "" && docker stats --no-stream'

# Memory usage alerts
free | awk 'NR==2{printf "Memory Usage: %.2f%%\n", $3*100/$2 }'

# Disk usage alerts  
df / | awk 'NR==2 {print "Disk Usage: " $5}'
```

## 💰 Chi phí AWS Free Tier

### Miễn phí 12 tháng đầu
- **EC2**: 750 giờ/tháng t2.micro
- **EBS**: 30 GB General Purpose SSD
- **Data Transfer**: 15 GB/tháng ra ngoài
- **Elastic IP**: 1 IP khi attached

### Sau 12 tháng (~$8-10/tháng)
- **EC2 t2.micro**: ~$8.50/tháng
- **EBS 30GB**: ~$2.40/tháng
- **Data Transfer**: $0.09/GB sau 1GB đầu

## 🚨 Troubleshooting

### Container không start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check system resources
free -h
df -h

# Restart Docker service
sudo systemctl restart docker
```

### Out of Memory
```bash
# Check memory usage
free -h
docker stats

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# Clean up Docker
docker system prune -f
```

### Out of Disk Space
```bash
# Check disk usage
df -h
du -sh /var/lib/docker

# Clean up
docker system prune -af
sudo apt autoremove
sudo apt autoclean
```

### SSL Issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
curl -I https://your-domain.com
```

### Health Check Failures
```bash
# Manual health check
curl -v http://localhost/health

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

## 🔄 Update Process

### Code Updates
```bash
# Pull latest code
cd /home/ubuntu/ManagementApp
git pull origin main

# Redeploy
cd aws-deployment
bash deploy.sh
```

### System Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker
curl -fsSL https://get.docker.com | sudo sh

# Restart services
sudo systemctl restart docker
cd /home/ubuntu/ManagementApp/aws-deployment
docker-compose -f docker-compose.prod.yml restart
```

## 📞 Support

### Useful Resources
- [AWS Free Tier](https://aws.amazon.com/free/)
- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [ASP.NET Core Deployment](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/)

### Emergency Commands
```bash
# Emergency stop all containers
docker stop $(docker ps -q)

# Emergency system reboot
sudo reboot

# Check system status after issues
bash monitor.sh
```

## 📝 Checklist Deploy

### Pre-deployment
- [ ] AWS account created
- [ ] EC2 instance launched (t2.micro)
- [ ] Security groups configured
- [ ] SSH key pair downloaded
- [ ] Git repository accessible

### Deployment
- [ ] Connected to EC2 via SSH
- [ ] Cloned repository
- [ ] Run `sudo bash complete-deploy.sh`
- [ ] Rebooted instance
- [ ] Run `bash complete-deploy.sh` as ubuntu
- [ ] Verified application accessible

### Post-deployment
- [ ] Setup domain DNS (if applicable)
- [ ] Setup SSL certificate
- [ ] Test all endpoints
- [ ] Setup monitoring alerts
- [ ] Document custom configurations

## 🎯 Performance Tips

### For t2.micro (1GB RAM)
- Monitor memory usage regularly
- Use swap file (automatically configured)
- Limit Docker log sizes
- Regular container restarts
- Clean up unused images

### Scaling Options
- Upgrade to t3.small for better performance
- Use RDS for database (separate instance)
- Setup CloudFront for static assets
- Use Application Load Balancer
- Consider ECS/EKS for container orchestration

---

**🎉 Chúc bạn deploy thành công!**

Nếu gặp vấn đề, hãy kiểm tra logs và sử dụng script `monitor.sh` để debug.
