# Deployment Options Guide

## 🚀 Các phương thức deploy được cung cấp

### 1. **Auto Deploy (deploy.yml)** - *Hiện tại*
- **Trigger**: Mỗi push lên branch `main` (trừ file .md)
- **Ưu điểm**: Tự động, nhanh chóng
- **Nhược điểm**: Deploy mọi thay đổi, không có control

```bash
# Để sử dụng: chỉ cần push lên main
git push origin main
```

### 2. **Manual Deploy (manual-deploy.yml)** - *Khuyến nghị*
- **Trigger**: Chỉ deploy khi bạn chủ động trigger
- **Ưu điểm**: Kiểm soát hoàn toàn, an toàn
- **Nhược điểm**: Phải thao tác thủ công

```bash
# Để sử dụng:
# 1. Vào GitHub repo → Actions tab
# 2. Chọn "Deploy to EC2" workflow
# 3. Click "Run workflow"
# 4. Chọn environment và gõ "deploy" để confirm
```

### 3. **Tag-based Deploy (tag-deploy.yml)** - *Professional*
- **Trigger**: Khi tạo version tag (v1.0.0, v2.1.3, etc.)
- **Ưu điểm**: Deploy theo version, tracking tốt
- **Nhược điểm**: Cần hiểu về git tags

```bash
# Để sử dụng:
git tag v1.0.0
git push origin v1.0.0
```

### 4. **CI/CD Pipeline (ci-cd.yml)** - *Enterprise*
- **Trigger**: Auto build/test + manual production deploy
- **Ưu điểm**: Đầy đủ pipeline, có test, có approval
- **Nhược điểm**: Phức tạp hơn

### 5. **Smart Deploy (smart-deploy.yml)** - *Intelligent*
- **Trigger**: Chỉ deploy service bị thay đổi
- **Ưu điểm**: Tối ưu, chỉ rebuild cần thiết
- **Nhược điểm**: Logic phức tạp

## 🔧 Cách chuyển đổi deployment method

### Để sử dụng Manual Deploy (Khuyến nghị):

1. **Disable auto deploy:**
```bash
# Rename hoặc delete file hiện tại
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
```

2. **Enable manual deploy:**
```bash
# File manual-deploy.yml đã sẵn sàng sử dụng
```

3. **Sử dụng:**
- Vào GitHub → Actions
- Chọn "Deploy to EC2"
- Click "Run workflow"
- Nhập "deploy" để confirm

### Để sử dụng Tag-based Deploy:

1. **Setup:**
```bash
# Sử dụng tag-deploy.yml
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
```

2. **Deploy:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 🛡️ Security Best Practices

### GitHub Environment Protection Rules:
1. Vào GitHub repo → Settings → Environments
2. Tạo environment "production"
3. Thêm protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches

### Secrets Management:
```bash
# Required GitHub Secrets:
EC2_HOST=your-ec2-public-ip
EC2_USER=ubuntu  
EC2_SSH_KEY=your-private-key-content
```

## 📊 So sánh các phương thức

| Method | Auto | Control | Safety | Complexity |
|--------|------|---------|--------|------------|
| Auto Deploy | ✅ | ❌ | ⚠️ | 🟢 Low |
| Manual Deploy | ❌ | ✅ | ✅ | 🟢 Low |
| Tag Deploy | ✅ | ✅ | ✅ | 🟡 Medium |
| CI/CD Pipeline | ✅ | ✅ | ✅ | 🔴 High |
| Smart Deploy | ✅ | ⚠️ | ✅ | 🟡 Medium |

## 💡 Khuyến nghị

### Cho Development/Learning:
- Sử dụng **Manual Deploy** để kiểm soát tốt hơn

### Cho Production:
- Sử dụng **Tag-based Deploy** hoặc **CI/CD Pipeline**
- Setup environment protection rules
- Có backup strategy

### Để bắt đầu:
1. Disable auto deploy hiện tại
2. Sử dụng manual deploy để học cách hoạt động
3. Sau đó chuyển sang tag-based deploy khi đã quen

## 🔧 Commands hữu ích

```bash
# Xem deployment history
gh api repos/:owner/:repo/deployments

# Check workflow status  
gh run list --workflow=deploy.yml

# Trigger manual deployment
gh workflow run manual-deploy.yml

# Create and push tag
git tag v1.0.0
git push origin v1.0.0
```
