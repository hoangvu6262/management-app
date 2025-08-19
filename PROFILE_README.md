# Profile Management Feature

## Tổng quan

Tính năng Profile Management cung cấp đầy đủ chức năng quản lý hồ sơ cá nhân và bảo mật cho ứng dụng Management App, bao gồm:

### 🔐 Quản lý hồ sơ cá nhân
- Xem và chỉnh sửa thông tin cá nhân (tên, email)
- Đổi mật khẩu với validation mạnh
- Hiển thị thông tin tài khoản (vai trò, ngày tạo, lần đăng nhập cuối)

### 🛡️ Bảo mật nâng cao
- **Xác thực hai yếu tố (2FA)**: Tích hợp Google Authenticator/Authy
- **Mã dự phòng**: Tạo và quản lý backup codes
- **QR Code**: Thiết lập 2FA dễ dàng
- **Tắt/Bật 2FA**: Với xác thực mật khẩu

### 👥 Quản lý người dùng (Admin)
- Xem danh sách tất cả người dùng
- Thay đổi vai trò người dùng (User/Moderator/Admin)
- Khóa/Mở khóa tài khoản người dùng
- Tìm kiếm và lọc người dùng
- Thống kê người dùng

### ⚙️ Cấu hình hệ thống (Admin)
- **Cài đặt bảo mật**:
  - Yêu cầu xác thực email
  - Cho phép/Tắt 2FA
  - Giới hạn số lần đăng nhập sai
  - Thời gian hết hạn phiên
- **Chế độ bảo trì**: Chặn người dùng thường
- **Thông báo hệ thống**: Hiển thị thông báo toàn bộ

## Backend API

### Profile Endpoints

#### GET `/api/profile`
Lấy thông tin hồ sơ người dùng hiện tại
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string",
    "isActive": true,
    "twoFactorEnabled": false,
    "emailVerified": true,
    "lastLoginAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT `/api/profile`
Cập nhật thông tin hồ sơ
```json
{
  "fullName": "Họ và tên mới",
  "email": "email@example.com"
}
```

#### POST `/api/profile/change-password`
Đổi mật khẩu
```json
{
  "currentPassword": "mật khẩu hiện tại",
  "newPassword": "mật khẩu mới",
  "confirmNewPassword": "xác nhận mật khẩu mới"
}
```

### Two-Factor Authentication

#### POST `/api/profile/setup-2fa`
Thiết lập 2FA (tạo QR code và backup codes)

#### POST `/api/profile/verify-2fa`
Xác thực và kích hoạt 2FA
```json
{
  "code": "123456"
}
```

#### POST `/api/profile/disable-2fa`
Tắt 2FA
```json
{
  "currentPassword": "mật khẩu hiện tại"
}
```

#### POST `/api/profile/regenerate-backup-codes`
Tạo lại mã dự phòng

### Admin Endpoints

#### GET `/api/profile/admin/users`
Lấy danh sách tất cả người dùng (Admin only)

#### PUT `/api/profile/admin/users/{userId}/role`
Thay đổi vai trò người dùng (Admin only)
```json
{
  "role": "Admin|Moderator|User"
}
```

#### PUT `/api/profile/admin/users/{userId}/toggle-status`
Khóa/Mở khóa tài khoản người dùng (Admin only)

#### GET `/api/profile/admin/system-config`
Lấy cấu hình hệ thống (Admin only)

#### PUT `/api/profile/admin/system-config`
Cập nhật cấu hình hệ thống (Admin only)

## Frontend Components

### Pages
- `/profile` - Trang chính quản lý profile

### Components
- `ProfileEditForm` - Form chỉnh sửa thông tin cá nhân
- `ChangePasswordForm` - Form đổi mật khẩu
- `TwoFactorSettings` - Quản lý 2FA
- `AdminUserManagement` - Quản lý người dùng (Admin)
- `SystemConfiguration` - Cấu hình hệ thống (Admin)

### Services
- `profileService` - Service gọi API profile

## Database Schema

### User Table (Cập nhật)
```sql
-- Thêm các cột bảo mật
ALTER TABLE Users ADD COLUMN TwoFactorEnabled INTEGER DEFAULT 0;
ALTER TABLE Users ADD COLUMN TwoFactorSecretKey TEXT;
ALTER TABLE Users ADD COLUMN BackupCodes TEXT;
ALTER TABLE Users ADD COLUMN EmailVerified INTEGER DEFAULT 0;
ALTER TABLE Users ADD COLUMN EmailVerificationToken TEXT;
ALTER TABLE Users ADD COLUMN LastLoginAt TEXT;
ALTER TABLE Users ADD COLUMN FailedLoginAttempts INTEGER DEFAULT 0;
ALTER TABLE Users ADD COLUMN LockoutEnd TEXT;
```

### SystemConfiguration Table (Mới)
```sql
CREATE TABLE SystemConfigurations (
    Id INTEGER PRIMARY KEY,
    RequireEmailVerification INTEGER DEFAULT 0,
    EnableTwoFactor INTEGER DEFAULT 1,
    MaxLoginAttempts INTEGER DEFAULT 5,
    SessionTimeoutMinutes INTEGER DEFAULT 60,
    MaintenanceMode INTEGER DEFAULT 0,
    SystemMessage TEXT DEFAULT '',
    CreatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Cài đặt

### Backend Dependencies
```xml
<PackageReference Include="QRCoder" Version="1.4.3" />
<PackageReference Include="OtpNet" Version="1.9.1" />
<PackageReference Include="System.Drawing.Common" Version="8.0.0" />
```

### Frontend Dependencies
```json
{
  "@radix-ui/react-tabs": "^1.0.4",
  "sonner": "^1.3.1"
}
```

### Database Migration
Chạy script SQL trong file `add_profile_security_features.sql` để cập nhật database.

## Tính năng bảo mật

### Two-Factor Authentication (2FA)
- Hỗ trợ TOTP (Time-based One-Time Password)
- Tương thích với Google Authenticator, Authy, Microsoft Authenticator
- QR Code tự động sinh
- Backup codes để khôi phục khi mất thiết bị
- Tắt 2FA với xác thực mật khẩu

### Bảo vệ Brute Force
- Giới hạn số lần đăng nhập sai
- Khóa tài khoản tạm thời
- Admin có thể cấu hình số lần thử

### Session Management
- Thời gian hết hạn phiên có thể cấu hình
- Đăng xuất tất cả thiết bị khi đổi mật khẩu
- Refresh token tự động

### Validation
- Mật khẩu mạnh (tối thiểu 6 ký tự, có hoa, thường, số)
- Email validation
- Sanitize input data

## Quyền hạn

### User
- Xem/chỉnh sửa profile cá nhân
- Đổi mật khẩu
- Quản lý 2FA

### Moderator
- Tất cả quyền User
- (Có thể mở rộng thêm)

### Admin
- Tất cả quyền User + Moderator
- Quản lý tất cả người dùng
- Thay đổi vai trò người dùng
- Khóa/Mở khóa tài khoản
- Cấu hình hệ thống
- Chế độ bảo trì

## UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet và desktop friendly
- Touch-friendly buttons

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast support
- Focus indicators

### User Experience
- Toast notifications
- Loading states
- Error handling
- Confirmation dialogs
- Progress indicators

### Dark/Light Mode
- Automatic theme detection
- Manual theme toggle
- Persistent theme selection

## Bảo mật Frontend

### Input Validation
- Client-side validation
- XSS protection
- CSRF protection

### API Security
- JWT tokens
- Automatic token refresh
- Secure cookie storage
- API rate limiting

### Data Protection
- Sensitive data masking
- Secure clipboard operations
- Auto-logout on inactivity

## Testing

### Backend Testing
```bash
# Test Profile API
curl -X GET "http://localhost:5000/api/profile" \
  -H "Authorization: Bearer {token}"

# Test 2FA Setup
curl -X POST "http://localhost:5000/api/profile/setup-2fa" \
  -H "Authorization: Bearer {token}"
```

### Frontend Testing
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment Notes

### Environment Variables
```bash
# Backend
JWT_SECRET=your-secret-key
DATABASE_URL=your-database-url

# Frontend  
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Production Considerations
- Sử dụng HTTPS
- Secure cookie settings
- Database backup
- Log monitoring
- Rate limiting
- Email service setup (cho email verification)

## Future Enhancements

### Planned Features
- [ ] Email verification flow
- [ ] Password reset via email
- [ ] Login history
- [ ] Device management
- [ ] Social login integration
- [ ] Advanced password policies
- [ ] Account recovery questions
- [ ] Export user data
- [ ] Audit logs
- [ ] Multi-language support

### Security Enhancements
- [ ] WebAuthn/FIDO2 support
- [ ] Risk-based authentication
- [ ] IP whitelisting
- [ ] Device fingerprinting
- [ ] Advanced session management
- [ ] Security headers
- [ ] Content Security Policy
