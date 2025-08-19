# 🎬 Profile Feature Demo

## Demo Video Script

### 1. 🏠 Dashboard Navigation (30s)
- Mở http://localhost:3000
- Đăng nhập với admin@managementapp.com / admin123
- Click sidebar "Profile" để vào trang profile
- **Show**: Clean responsive UI, role badge "Admin"

### 2. 👤 Personal Information Management (60s)
- **Tab "Thông tin"**: 
  - Show current info (tên, email, role, ngày tạo)
  - Click "Chỉnh sửa" 
  - Thay đổi "Họ và tên" thành "Administrator System"
  - Thay đổi email thành "admin.system@company.com"
  - Click "Lưu thay đổi"
  - **Show**: Toast success, form validation, email verification warning

### 3. 🔐 Password Security (90s)
- **Tab "Bảo mật"**:
  - Show password requirements
  - Nhập current password: "admin123"
  - Nhập new password: "NewPass123!" 
  - Confirm password: "NewPass123!"
  - **Show**: Real-time validation (✅ 6+ chars, ✅ uppercase, ✅ number)
  - Click "Đổi mật khẩu"
  - **Show**: Success message + auto redirect warning

### 4. 📱 Two-Factor Authentication (120s)
- **Tab "2FA"**:
  - **Show**: Current status "Chưa bật"
  - Click "Thiết lập 2FA"
  - **Show**: QR code generated, secret key, backup codes
  - **Demo**: Scan QR with phone app (Google Authenticator)
  - Enter 6-digit code from app
  - Click "Xác thực"
  - **Show**: Success + backup codes download option
  - **Demo**: Regenerate backup codes feature

### 5. 👥 User Management - Admin Features (180s)
- **Tab "Quản lý User"**:
  - **Show**: User statistics cards (Total, Admin, Active, Locked)
  - **Show**: User list with search/filter
  - Create demo user scenario:
    - Search for existing users
    - Show user details (role, status, last login)
    - **Demo**: Change user role User → Moderator
    - **Demo**: Lock/unlock user account
    - **Show**: Cannot modify own account (security)

### 6. ⚙️ System Configuration - Admin Only (150s)  
- **Tab "Hệ thống"**:
  - **Security Settings**:
    - Toggle "Yêu cầu xác thực email" 
    - Toggle "Cho phép 2FA"
    - Adjust "Số lần đăng nhập sai tối đa": 3
    - Change "Thời gian hết hạn phiên": 30 phút
  - **System Settings**:
    - Toggle "Chế độ bảo trì" (show warning)
    - Add "Thông báo hệ thống": "Hệ thống sẽ bảo trì từ 22:00-23:00"
    - **Show**: Live preview of notification
  - Click "Lưu thay đổi"
  - **Show**: Security summary cards update

### 7. 📱 Responsive Design Demo (60s)
- **Desktop**: Show full layout with sidebar
- **Tablet**: Show collapsed sidebar, responsive cards
- **Mobile**: Show mobile navigation, stacked layout
- **Dark Mode**: Toggle theme (if available)

### 8. 🔍 Error Handling & UX (90s)
- **Form Validation**:
  - Try weak password → show requirements
  - Try duplicate email → show error
  - Try wrong current password → show error
- **2FA Validation**:
  - Try wrong code → show error
  - Try to disable without password → show error
- **Network Errors**:
  - Simulate API failure → show graceful error
- **Loading States**: Show spinners and disabled buttons

### 9. 🛡️ Security Features Highlight (120s)
- **Access Control**:
  - Show role-based features (Admin vs User)
  - Show protected admin endpoints
- **Session Management**:
  - Show JWT token handling
  - Demonstrate auto-logout on password change
- **2FA Security**:
  - Show backup codes usage
  - Show QR code security
- **Input Security**:
  - Show XSS protection
  - Show SQL injection protection

### 10. 🎯 Developer Experience (90s)
- **API Documentation**:
  - Open Swagger at /swagger
  - Show Profile endpoints
  - Test API calls with token
- **Database Inspection**:
  - Show SQLite database structure
  - Show new security columns
  - Show SystemConfiguration table
- **Logging & Monitoring**:
  - Show backend console logs
  - Show frontend browser console
  - Show error tracking

## 📊 Performance Metrics to Show

### Frontend
- ⚡ Page load time: < 2s
- 🎨 First Contentful Paint: < 1s  
- 📱 Mobile lighthouse score: 90+
- ♿ Accessibility score: 95+

### Backend  
- 🚀 API response time: < 200ms
- 💾 Database query time: < 50ms
- 🔐 JWT validation: < 10ms
- 📈 Concurrent users: 100+

## 🎪 Demo Scenarios

### Scenario A: New Employee Setup
1. Admin creates new user account
2. User logs in first time
3. User updates profile information
4. User sets up 2FA for security
5. User changes default password

### Scenario B: Security Incident Response
1. Admin receives security alert
2. Admin reviews user access logs
3. Admin temporarily locks affected accounts
4. Admin enables maintenance mode
5. Admin adds system notification
6. Admin regenerates backup codes

### Scenario C: Company Policy Update
1. Admin updates max login attempts
2. Admin enables mandatory email verification
3. Admin adds policy notification
4. Admin reviews user compliance
5. Admin generates security report

## 📋 Demo Checklist

### Pre-Demo Setup
- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:3000  
- [ ] Database migrated with security features
- [ ] Admin account created and verified
- [ ] Test user accounts available
- [ ] Mobile authenticator app ready
- [ ] Screen recording software ready
- [ ] Browser dev tools prepared

### During Demo
- [ ] Show mobile responsiveness
- [ ] Demonstrate error handling
- [ ] Highlight security features
- [ ] Show admin-only features
- [ ] Test 2FA flow completely
- [ ] Show performance metrics
- [ ] Demonstrate accessibility features
- [ ] Show developer experience

### Post-Demo
- [ ] Show codebase structure
- [ ] Explain architecture decisions
- [ ] Show deployment options
- [ ] Discuss scaling considerations
- [ ] Answer technical questions

## 🎬 Recording Tips

### Technical Setup
- 🖥️ 1920x1080 minimum resolution
- 🎙️ Clear audio commentary
- 🖱️ Smooth mouse movements
- ⏱️ Appropriate pacing (not too fast)
- 🎨 Good contrast and visibility

### Content Flow
- 📝 Start with overview and goals
- 🎯 Show each feature systematically  
- 🔍 Zoom in on important details
- ⚠️ Explain potential pitfalls
- ✅ Summarize key achievements
- 🚀 End with next steps

---

🎬 **Ready to showcase the complete Profile Management feature!**
