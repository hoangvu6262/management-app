# 🔍 Font-Family & Token Refresh Debug Guide

## ✅ **Font-Family Status: WORKING**

### **Current Configuration:**
- ✅ **Inter font** properly imported in `layout.tsx`
- ✅ **Font fallback chain** configured in `globals.scss`
- ✅ **CSS variables** available

**If font looks wrong:**
1. Clear browser cache (Ctrl/Cmd + Shift + R)
2. Check Network tab for font loading errors
3. Inspect element to see computed font-family

---

## 🔧 **Token Refresh Debug - Enhanced Version**

### **New Debug Tools Added:**

#### **1. Enhanced Console Logging**
Open DevTools Console, you should see:
```bash
🔧 [TokenRefresh] Hook effect triggered {isAuthenticated: true}
🔧 [TokenRefresh] User authenticated, starting token management
🔧 [TokenRefresh] Token Status Check {hasAccessToken: true, timeUntilExpiry: "285 seconds", ...}
🔧 [TokenRefresh] Starting token refresh interval...
🔧 [TokenRefresh] Interval started - checking every 30 seconds
```

#### **2. Visual Debug Panel**
- 🔧 **Bottom-left corner**: "Token Debug" button
- **Click to expand**: Shows real-time token status
- **Force Refresh**: Manual token refresh button
- **Log Token Info**: Prints detailed info to console

#### **3. Window Debug Object**
Open Console and type:
```javascript
// Check current token status
window.tokenRefreshDebug.getCurrentTokenInfo()

// Force a token refresh
window.tokenRefreshDebug.forceRefresh()

// Check debug info
window.tokenRefreshDebug.debugInfo
```

### **🚀 How to Test Token Refresh:**

#### **Method 1: Wait for Natural Expiry**
1. Login to app
2. Open debug panel (bottom-left)
3. Watch "Expires In" countdown
4. When it hits ~30 seconds, should auto-refresh
5. Check console for refresh logs

#### **Method 2: Force Refresh (Recommended)**
1. Login to app
2. Open debug panel
3. Click "🔄 Force Refresh" button
4. Check console for logs
5. Token should update in debug panel

#### **Method 3: Console Testing**
```javascript
// Check if hook is working
window.tokenRefreshDebug.debugInfo

// Force refresh manually
window.tokenRefreshDebug.forceRefresh()

// Check token details
window.tokenRefreshDebug.getCurrentTokenInfo()
```

### **📊 What to Look For:**

#### **✅ Working Correctly:**
```bash
🔧 [TokenRefresh] Hook effect triggered
🔧 [TokenRefresh] Token Status Check
🔧 [TokenRefresh] Starting token refresh interval...
🔧 [TokenRefresh] 🔄 Token expired/expiring, starting refresh...
🔧 [TokenRefresh] ✅ Token refreshed successfully
```

#### **❌ Not Working:**
```bash
# No logs at all = Hook not running
# Only initial logs but no interval = Interval not starting
# Refresh logs but errors = API/server issues
```

### **🔧 Common Issues & Solutions:**

#### **Issue 1: No Console Logs**
**Problem**: Hook not running
**Solution**: 
```bash
# Check if AuthProvider is wrapping the app
# Check if useTokenRefresh is called in AuthProvider
# Check Redux store connection
```

#### **Issue 2: Logs But No Refresh**
**Problem**: Interval not working or token not expiring
**Solution**:
```javascript
// Force refresh manually
window.tokenRefreshDebug.forceRefresh()

// Check current token time
window.tokenRefreshDebug.getCurrentTokenInfo()
```

#### **Issue 3: Refresh Fails**
**Problem**: API endpoint issues
**Solution**: 
```bash
# Check Network tab for /auth/refresh-token calls
# Check server is running (localhost:5000)
# Check refresh token is valid in cookies
```

#### **Issue 4: Tokens Missing**
**Problem**: Cookies not set properly
**Solution**:
```bash
# DevTools → Application → Cookies
# Should see: accessToken, refreshToken, user
# If missing, login again
```

### **🎯 Quick Verification Steps:**

#### **Step 1: Login & Check Debug Panel**
1. Login to app
2. Look for "🔧 Token Debug ✅" button in bottom-left
3. Click to expand panel
4. Should show: Authenticated ✅, Has Access Token ✅, Has Refresh Token ✅

#### **Step 2: Check Console**
1. Open DevTools Console
2. Should see token refresh logs
3. Type: `window.tokenRefreshDebug.getCurrentTokenInfo()`
4. Should see table with token details

#### **Step 3: Test Force Refresh**
1. Click "🔄 Force Refresh" in debug panel
2. Watch console for refresh logs
3. Debug panel should update with new expiry time
4. No error notifications should appear

#### **Step 4: Test Natural Expiry**
1. Wait for token to have <60 seconds left
2. Should auto-refresh when hits ~30 seconds
3. Debug panel updates automatically
4. User stays on current page

### **📱 Testing Scenarios:**

#### **Scenario 1: Page Navigation**
```bash
1. Login → Navigate to /football-matches
2. Wait for token refresh (or force refresh)
3. Navigate to /calendar
4. Should stay on /calendar (not redirect to /)
```

#### **Scenario 2: Form Filling**
```bash
1. Start filling football match form
2. Wait 6+ minutes (token expires 2+ times)
3. Submit form
4. Should work without losing data
```

#### **Scenario 3: Multiple Tabs**
```bash
1. Open app in 2 tabs
2. Force refresh in one tab
3. Both tabs should get updated tokens
4. No redirects in either tab
```

### **🔍 Advanced Debug Commands:**

```javascript
// Get detailed token information
window.tokenRefreshDebug.getCurrentTokenInfo()

// Check hook status
console.log(window.tokenRefreshDebug.debugInfo)

// Force refresh and watch logs
window.tokenRefreshDebug.forceRefresh()

// Check if tokens are in cookies
document.cookie.split(';').filter(c => c.includes('Token'))

// Manually check token expiry
const token = document.cookie.split(';').find(c => c.includes('accessToken'))?.split('=')[1]
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  console.log('Token expires at:', new Date(payload.exp * 1000))
  console.log('Current time:', new Date())
  console.log('Time until expiry:', payload.exp - Math.floor(Date.now() / 1000), 'seconds')
}
```

### **🚀 Expected Results:**

#### **After Login:**
- ✅ Debug panel shows all green checkmarks
- ✅ Console shows initialization logs
- ✅ 30-second interval starts

#### **Before Token Expiry:**
- ✅ Debug panel shows countdown (30+ seconds)
- ✅ Console shows periodic checks
- ✅ No refresh triggered yet

#### **During Auto Refresh:**
- ✅ Console shows "Token expired/expiring, starting refresh..."
- ✅ Console shows "Token refreshed successfully"
- ✅ Debug panel updates with new expiry time
- ✅ User stays on current page
- ✅ No notifications shown

#### **After Refresh:**
- ✅ New 5-minute countdown starts
- ✅ All functionality continues working
- ✅ API calls succeed without 401 errors

### **🎯 Success Criteria:**

1. **Hook Initialization**: ✅ Console logs on login
2. **Interval Running**: ✅ Periodic checks every 30s
3. **Token Detection**: ✅ Correctly identifies expiring tokens
4. **Refresh Process**: ✅ Successfully refreshes tokens
5. **Silent Operation**: ✅ No user interruption
6. **Page Preservation**: ✅ No unexpected redirects
7. **Error Handling**: ✅ Clean logout on refresh failure

**If all criteria pass, token refresh is working perfectly! 🎉**

### **🔧 Manual Testing Protocol:**

1. **Start fresh**: Clear all cookies, login again
2. **Check debug panel**: Verify all green checkmarks
3. **Force refresh**: Use debug button, watch console
4. **Wait for natural**: Let token naturally expire
5. **Test navigation**: Change pages during/after refresh
6. **Test forms**: Fill forms across token expiry
7. **Test multiple tabs**: Verify cross-tab functionality

**Debug tools will help you identify exactly where the issue is! 🔍**
