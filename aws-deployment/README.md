# 🐳 AWS Deployment - Docker Hub Workflow

Streamlined deployment using pre-built Docker images from Docker Hub.

## 📋 Essential Files

### 🚀 Core Deployment
- `build-and-push.sh` - Build and push images to Docker Hub (run locally)
- `deploy-from-hub.sh` - Fast deployment on EC2 (pull & run)
- `docker-compose.hub.yml` - Docker Compose for pre-built images
- `nginx.prod.conf` - Production Nginx configuration

### 🔧 Maintenance & Monitoring  
- `auto-recovery.sh` - Automatic recovery for t2.micro
- `monitor-micro.sh` - System monitoring for t2.micro
- `backup.sh` - Database and config backup
- `restore.sh` - Restore from backup
- `setup-ssl.sh` - SSL certificate setup (optional)

## 🚀 Quick Start

### 1. **Setup Docker Hub**
```bash
# 1. Create account at hub.docker.com
# 2. Update username in build-and-push.sh
# 3. Build and push first images
bash build-and-push.sh
```

### 2. **Deploy on EC2**
```bash
# SSH to EC2
ssh -i key.pem ubuntu@ec2-ip

# Clone project
git clone https://github.com/username/management-app.git
cd management-app/aws-deployment

# Set your Docker Hub username
export DOCKER_HUB_USERNAME="your-username"

# Deploy
bash deploy-from-hub.sh
```

## ⚡ Performance Benefits

| Method | Time | RAM | Success Rate |
|--------|------|-----|--------------|
| **Build on EC2** | 15-20 min | 2-3GB | 60% |
| **Pull from Hub** | 2-3 min | 500MB | 99% |

## 🔄 Update Workflow

```bash
# 1. Update code locally
git push origin main

# 2. Build & push new images
bash build-and-push.sh

# 3. Deploy on EC2
bash deploy-from-hub.sh
```

## 📊 Monitoring

```bash
# System monitoring
bash monitor-micro.sh

# Auto recovery (setup cron)
*/10 * * * * /home/ubuntu/management-app/aws-deployment/auto-recovery.sh
```

## 🆘 Troubleshooting

```bash
# Check logs
docker-compose -f docker-compose.hub.yml logs

# Restart services  
docker-compose -f docker-compose.hub.yml restart

# Full redeploy
bash deploy-from-hub.sh

# Emergency recovery
bash auto-recovery.sh
```

## 🔧 Configuration

### Environment Variables
- `DOCKER_HUB_USERNAME` - Your Docker Hub username
- `IMAGE_TAG` - Image version (default: latest)

### Memory Limits (t2.micro optimized)
- **server-app**: 300MB limit
- **client-app**: 400MB limit  
- **nginx**: 50MB limit

---

**Ready to deploy? Update the Docker Hub username and run:**
```bash
bash make-scripts-executable.sh
bash build-and-push.sh
```
