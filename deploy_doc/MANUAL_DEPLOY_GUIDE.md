# 🚀 Manual Deployment Guide

## ✅ Đã chuyển sang Manual Deploy thành công!

Từ giờ, ứng dụng sẽ **KHÔNG** tự động deploy khi push code. Bạn có toàn quyền kiểm soát khi nào deploy.

## 🎯 Cách deploy ứng dụng

### 1. **Deploy từ GitHub Web Interface (Dễ nhất)**

1. Vào GitHub repository của bạn
2. Click tab **"Actions"**
3. Bên trái, click **"🚀 Deploy to EC2"**
4. Click nút **"Run workflow"** (màu xanh)
5. Điền thông tin:
   - **Environment**: Chọn `production`
   - **Confirm**: Gõ chính xác `deploy`
   - **Skip rebuild**: Tích nếu muốn deploy nhanh (không rebuild Docker)
6. Click **"Run workflow"**

### 2. **Deploy từ GitHub CLI (Cho developers)**

```bash
# Cài GitHub CLI nếu chưa có
# macOS: brew install gh
# Windows: choco install gh

# Login
gh auth login

# Deploy với full rebuild
gh workflow run deploy.yml -f environment=production -f confirm_deploy=deploy -f skip_build=false

# Deploy nhanh (không rebuild)
gh workflow run deploy.yml -f environment=production -f confirm_deploy=deploy -f skip_build=true
```

## 🧪 Test trước khi deploy

### Test Local (Khuyến nghị):
```bash
# Test ứng dụng trên máy local trước
chmod +x test-local.sh
./test-local.sh

# Kiểm tra tại http://localhost
# Nếu OK thì mới deploy lên EC2
```

## 📋 Workflow của bạn sẽ như thế này:

1. **Develop** → Code trên local
2. **Test** → Chạy `./test-local.sh` để test
3. **Commit & Push** → Push code lên GitHub (không deploy)
4. **Manual Deploy** → Vào Actions → Run workflow khi sẵn sàng
5. **Verify** → Check ứng dụng trên EC2

## 🎛️ Các options deploy:

### **Full Rebuild (Mặc định)**
- Rebuild toàn bộ Docker images
- Chậm hơn (~3-5 phút) nhưng đảm bảo mọi thứ mới nhất
- Dùng khi có thay đổi dependencies, Dockerfile, etc.

### **Quick Deploy (Skip rebuild)**
- Chỉ restart containers với code mới
- Nhanh hơn (~1-2 phút)
- Dùng khi chỉ thay đổi code, không thay đổi dependencies

## 📊 Monitor deployment:

### **Trong quá trình deploy:**
- Vào Actions → Click vào deployment đang chạy
- Xem real-time logs
- Các bước sẽ có emoji để dễ theo dõi

### **Sau khi deploy:**
```bash
# SSH vào EC2 để check
ssh -i your-key.pem ubuntu@your-ec2-ip

# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Check disk space
df -h
```

## 🚨 Troubleshooting

### **Nếu deploy fail:**
1. Vào Actions → Click vào failed deployment
2. Đọc error message trong logs
3. Fix lỗi, push code, deploy lại

### **Nếu ứng dụng không hoạt động:**
```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Check containers
docker-compose ps

# Restart nếu cần
docker-compose restart

# Check logs
docker-compose logs -f
```

### **Common issues:**
- **Port 80 busy**: `sudo lsof -i :80` → kill process hoặc restart EC2
- **Out of memory**: Add swap space hoặc cleanup: `docker system prune -f`
- **Git pull fails**: Check internet connection trên EC2

## 🔒 Security Notes

- Chỉ deploy khi thực sự cần thiết
- Test local trước khi deploy
- Backup database trước major updates
- Monitor resource usage để không vượt free tier

## 💡 Tips:

1. **Deploy vào giờ ít traffic** (nếu có users)
2. **Test local trước** để tránh deploy code lỗi
3. **Dùng skip_build=true** cho các thay đổi nhỏ
4. **Monitor logs** trong 5-10 phút đầu sau deploy
5. **Có sẵn SSH key** để troubleshoot nếu cần

## 🎉 Enjoy your new deployment workflow!

Bây giờ bạn có full control over deployments. No more accidental deployments! 🛡️
