# ManagementApp

Ứng dụng quản lý được xây dựng với Next.js (Frontend) và ASP.NET Core (Backend), deploy trên AWS EC2 với Docker.

## 🚀 Quick Start

### Development (Local)
```bash
# Test toàn bộ ứng dụng với Docker
chmod +x test-local.sh
./test-local.sh

# Truy cập: http://localhost
```

### Deployment (Production)
```bash
# 1. Push code lên GitHub
git add .
git commit -m "Your changes"
git push origin main

# 2. Deploy manually
# Vào GitHub → Actions → "🚀 Deploy to EC2" → Run workflow
# Gõ "deploy" để confirm
```

## 📁 Cấu trúc dự án

```
ManagementApp/
├── client-app/          # Next.js frontend
├── server-app/          # ASP.NET Core backend  
├── docker-compose.yml   # Docker orchestration
├── nginx.conf          # Reverse proxy config
└── .github/workflows/  # GitHub Actions
```

## 🔧 Environment Setup

- **Development**: Copy template files và config local
- **Production**: Tự động setup khi deploy lên EC2

Xem chi tiết: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

## 🚀 Deployment

**Manual Deploy** - Bạn có full control:
- ✅ Không deploy tự động khi push code
- ✅ Deploy chỉ khi bạn muốn
- ✅ Có options rebuild hoặc quick deploy

Xem chi tiết: [MANUAL_DEPLOY_GUIDE.md](MANUAL_DEPLOY_GUIDE.md)

## 📚 Documentation

- [📋 AWS EC2 Deployment Guide](aws-ec2-deployment-guide) - Setup complete từ đầu
- [⚙️ Environment Setup](ENVIRONMENT_SETUP.md) - Quản lý biến môi trường
- [🚀 Manual Deploy Guide](MANUAL_DEPLOY_GUIDE.md) - Cách deploy thủ công
- [🔄 Deployment Options](DEPLOYMENT_OPTIONS.md) - Các phương thức deploy khác

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: ASP.NET Core 8, Entity Framework, SQLite
- **Deployment**: Docker, Docker Compose, Nginx, AWS EC2
- **CI/CD**: GitHub Actions

## 🎯 Features

- ✅ Responsive web application
- ✅ RESTful API backend
- ✅ Database integration
- ✅ Docker containerization
- ✅ Nginx reverse proxy
- ✅ Manual deployment control
- ✅ Environment management
- ✅ AWS EC2 hosting

## 🚨 Important Notes

- Ứng dụng **KHÔNG** auto-deploy khi push code
- Phải **manually trigger** deployment từ GitHub Actions
- Test local trước khi deploy: `./test-local.sh`
- Monitor AWS free tier usage

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes và test local
4. Push to GitHub (không deploy)
5. Manually deploy khi sẵn sàng

---

**Happy coding! 🎉**
