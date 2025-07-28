# 🔧 Fix Build Errors - Installation Guide

## ❌ **Current Error**
```
Module not found: Can't resolve 'js-cookie'
```

## ✅ **Solution Steps**

### 1. Install Missing Dependencies
Chạy lệnh sau trong thư mục `client-app`:

```bash
cd client-app
npm install
```

Hoặc nếu vẫn còn lỗi, cài đặt explicitly:

```bash
npm install js-cookie @types/js-cookie @radix-ui/react-dropdown-menu
```

### 2. Clear Cache và Restart
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### 3. Verify Installation
Kiểm tra package đã được cài đặt:

```bash
npm list js-cookie
npm list @radix-ui/react-dropdown-menu
```

### 4. Alternative: Use yarn instead of npm
Nếu vẫn có vấn đề với npm:

```bash
# Remove npm files
rm -rf node_modules package-lock.json

# Install yarn globally if not installed
npm install -g yarn

# Install with yarn
yarn install

# Start dev server
yarn dev
```

## 📋 **Dependencies Added**

Đã thêm vào package.json:

```json
{
  "dependencies": {
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "js-cookie": "^3.0.5"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6"
  }
}
```

## 🚨 **Common Issues & Solutions**

### Issue 1: Node Version
Đảm bảo sử dụng Node.js version 18+:
```bash
node --version  # Should be 18+
```

### Issue 2: npm Cache
Clear npm cache:
```bash
npm cache clean --force
```

### Issue 3: Permission Issues (macOS/Linux)
```bash
sudo npm install
```

### Issue 4: Windows Path Issues
Sử dụng cmd hoặc PowerShell với admin privileges.

## ✅ **After Installation**

Sau khi cài đặt thành công, bạn sẽ có thể:

1. **Start development server:**
```bash
cd client-app
npm run dev
```

2. **Access application:**
- Frontend: http://localhost:3000
- Login với: admin@managementapp.com / admin123

3. **Verify features:**
- ✅ Login/logout functionality
- ✅ Route protection
- ✅ Football matches management
- ✅ Calendar events management
- ✅ SWR data fetching
- ✅ Redux state management

## 🔄 **Quick Commands Summary**

```bash
# Navigate to client-app
cd client-app

# Clean installation
rm -rf node_modules package-lock.json .next
npm install

# Start development
npm run dev
```

## 📞 **If Still Having Issues**

1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`  
3. Try yarn instead of npm
4. Check for proxy/firewall issues
5. Try deleting node_modules and reinstalling

The application should work after following these steps!
