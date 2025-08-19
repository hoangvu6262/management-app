# 🚀 Profile Feature Quick Start Guide

## Tóm tắt tính năng

Profile Management cung cấp đầy đủ chức năng quản lý hồ sơ cá nhân và bảo mật:

- ✅ **Quản lý thông tin cá nhân**: Chỉnh sửa tên, email
- ✅ **Đổi mật khẩu**: Với validation mạnh  
- ✅ **Two-Factor Authentication (2FA)**: QR code + backup codes
- ✅ **Quản lý người dùng (Admin)**: Thay đổi role, khóa/mở tài khoản
- ✅ **Cấu hình hệ thống (Admin)**: Bảo mật, bảo trì, thông báo

## 🎯 Chạy nhanh

### Option 1: Chạy script tự động
```bash
chmod +x test-profile-complete.sh
./test-profile-complete.sh
```

### Option 2: Chạy thủ công

#### Backend
```bash
cd server-app
dotnet restore
dotnet run
```

#### Frontend (Terminal mới)
```bash
cd client-app
npm install
npm run dev
```

## 🔐 Đăng nhập

- **URL**: http://localhost:3000/auth/login
- **Admin**: admin@managementapp.com / admin123
- **Profile**: http://localhost:3000/profile

## 📱 Tính năng chính

### User Features
1. **Profile tab**: Chỉnh sửa thông tin cá nhân
2. **Security tab**: Đổi mật khẩu
3. **2FA tab**: Thiết lập xác thực 2 yếu tố

### Admin Features  
4. **Users tab**: Quản lý tất cả người dùng
5. **System tab**: Cấu hình hệ thống

## 🛠️ Troubleshooting

### Backend lỗi
```bash
cd server-app
dotnet clean
dotnet restore
dotnet build
```

### Frontend lỗi
```bash
cd client-app
rm -rf node_modules package-lock.json
npm install
```

### Database migration
```bash
cd server-app
sqlite3 management.db < add_profile_security_features.sql
```

## 📊 API Testing

### Lấy profile
```bash
curl -X GET "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Setup 2FA
```bash
curl -X POST "http://localhost:5000/api/profile/setup-2fa" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎨 UI Components

- `ProfileEditForm`: Form chỉnh sửa thông tin
- `ChangePasswordForm`: Form đổi mật khẩu  
- `TwoFactorSettings`: Quản lý 2FA
- `AdminUserManagement`: Quản lý user (Admin)
- `SystemConfiguration`: Cấu hình hệ thống (Admin)

## 🔧 Tech Stack

### Backend
- ASP.NET Core 8
- Entity Framework Core
- SQLite/PostgreSQL
- JWT Authentication
- BCrypt password hashing

### Frontend  
- Next.js 14 + TypeScript
- Tailwind CSS
- Radix UI components
- Sonner notifications
- SWR data fetching

## 📦 Dependencies Added

### Backend
```xml
<!-- Already included, removed complex QR/OTP packages -->
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
```

### Frontend
```json
{
  "@radix-ui/react-tabs": "^1.0.4",
  "sonner": "^1.3.1"
}
```

## 🎯 Next Steps

1. **Email verification**: Implement email sending service
2. **Proper TOTP**: Replace demo validation with real TOTP library
3. **Advanced logging**: Add audit logs for admin actions
4. **Enhanced security**: Rate limiting, device management
5. **Mobile app**: React Native version

## 📞 Support

- Check PROFILE_README.md for detailed documentation
- Backend logs: Check terminal running `dotnet run`
- Frontend logs: Check browser console (F12)
- Database: Use DB Browser for SQLite to inspect data

---

🎉 **Profile feature is ready to use!** Start with the admin account and explore all features.
