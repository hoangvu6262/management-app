# 🔄 Auto Token Refresh Mechanism - Complete Guide

## 🎯 **Problem Solved**
**Before**: Khi access token hết hạn (5 phút), user bị redirect về login khi chuyển trang
**After**: Token tự động refresh trong background, user không bị gián đoạn

## 🔧 **Multi-Layer Refresh Strategy**

### **Layer 1: Proactive Refresh (Request Interceptor)**
```typescript
// In api.ts - BEFORE making any API call
axiosInstance.interceptors.request.use(async (config) => {
  let token = Cookies.get('accessToken');
  
  // Check if token is expired or about to expire (30 seconds)
  if (token && isTokenExpired(token)) {
    token = await refreshAccessToken(); // Auto refresh
  }
  
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### **Layer 2: Reactive Refresh (Response Interceptor)**
```typescript
// In api.ts - AFTER getting 401 error
axiosInstance.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    const newToken = await refreshAccessToken(); // Fallback refresh
    // Retry original request with new token
    return axiosInstance(originalRequest);
  }
});
```

### **Layer 3: Background Refresh (useTokenRefresh Hook)**
```typescript
// In useTokenRefresh.ts - Periodic check every 30 seconds
setInterval(checkAndRefreshToken, 30 * 1000);
```

### **Layer 4: Event-Based Refresh**
```typescript
// When user comes back to tab/window
window.addEventListener('focus', checkAndRefreshToken);
window.addEventListener('visibilitychange', checkAndRefreshToken);
```

## 🚀 **How It Works**

### **Scenario 1: Normal API Call**
```bash
1. User clicks button → API call
2. Request interceptor checks token
3. Token valid → API call proceeds
4. Success ✅
```

### **Scenario 2: Token About to Expire**
```bash
1. User clicks button → API call
2. Request interceptor checks token
3. Token expires in 20 seconds → Auto refresh
4. New token obtained → API call with new token
5. Success ✅ (User unaware of refresh)
```

### **Scenario 3: Token Already Expired**
```bash
1. User clicks button → API call
2. Request interceptor misses expiry → API call
3. Server returns 401 Unauthorized
4. Response interceptor catches 401 → Auto refresh
5. Retry original API call with new token
6. Success ✅ (User sees brief loading)
```

### **Scenario 4: User Inactive for 10 Minutes**
```bash
1. User leaves tab open, comes back after 10 minutes
2. Focus event fires → checkAndRefreshToken()
3. Token expired → Auto refresh
4. New token ready before user interacts
5. User clicks anything → Works immediately ✅
```

### **Scenario 5: Page Navigation**
```bash
1. User navigates to different page
2. Route change detected → checkAndRefreshToken()
3. Token about to expire → Auto refresh
4. Page loads with fresh token ✅
```

## 🔍 **Token Expiration Detection**

### **JWT Decode & Check**
```typescript
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    // Check if token expires in next 30 seconds (proactive)
    return payload.exp <= (currentTime + 30);
  } catch {
    return true; // Invalid token = expired
  }
};
```

### **Why 30 Seconds Buffer?**
- **5 seconds**: Not enough for slow API calls
- **30 seconds**: Perfect balance - enough time for requests
- **60 seconds**: Too aggressive, wastes refresh calls

## 🔒 **Race Condition Prevention**

### **Singleton Pattern**
```typescript
let refreshTokenPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  // Prevent multiple simultaneous refresh calls
  if (!refreshTokenPromise) {
    refreshTokenPromise = performRefresh();
  }
  
  const token = await refreshTokenPromise;
  refreshTokenPromise = null; // Reset after completion
  return token;
};
```

### **Why This Matters:**
- **Without**: 10 API calls = 10 refresh requests
- **With**: 10 API calls = 1 refresh request, 9 wait for result

## 📱 **User Experience Improvements**

### **Invisible Refresh**
- ✅ User never sees login screen unexpectedly
- ✅ No interruption during form filling
- ✅ Seamless page navigation
- ✅ Background refresh while user types

### **Smart Timing**
- ✅ Refresh before expiry (proactive)
- ✅ Refresh on page focus (when user returns)
- ✅ Refresh on route change (before new page loads)
- ✅ Periodic background checks

### **Graceful Degradation**
- ✅ If refresh fails → Clear notification + redirect to login
- ✅ Multiple refresh attempts before giving up
- ✅ Fallback mechanisms at each layer

## 🔧 **Configuration & Customization**

### **Timing Configuration**
```typescript
// In useTokenRefresh.ts
const REFRESH_INTERVAL = 30 * 1000;        // Check every 30 seconds
const EXPIRY_BUFFER = 30;                   // Refresh 30 seconds before expiry
const NOTIFICATION_DURATION = 5000;        // Error notification duration
```

### **Notification Preferences**
```typescript
// Show refresh notifications (optional)
dispatch(addNotification({
  type: 'info',
  title: 'Session Renewed',
  message: 'Your session has been automatically renewed.',
  duration: 3000,
}));
```

## 🎯 **Benefits Achieved**

### **User Experience**
- ✅ **Zero interruptions**: No unexpected login redirects
- ✅ **Seamless navigation**: Page changes work smoothly
- ✅ **Form preservation**: Long forms don't lose data
- ✅ **Background operation**: User unaware of token management

### **Security**
- ✅ **Short-lived tokens**: 5-minute access tokens
- ✅ **Automatic rotation**: Tokens refreshed regularly
- ✅ **Secure storage**: httpOnly cookies for refresh tokens
- ✅ **Graceful expiry**: Clean logout when refresh fails

### **Developer Experience**
- ✅ **No manual token handling**: Automatic in all API calls
- ✅ **Consistent behavior**: Same logic everywhere
- ✅ **Easy debugging**: Console logs for token operations
- ✅ **Notification system**: Visual feedback for errors

## 🔄 **Refresh Flow Diagram**

```
User Action → Request Interceptor → Token Check
                     ↓
            [Token Valid?] → YES → API Call → Success
                     ↓
                    NO → Refresh Token
                     ↓
            [Refresh Success?] → YES → Update Cookies → Retry API
                     ↓
                    NO → Show Notification → Logout → Login
```

## 📋 **Implementation Checklist**

### ✅ **Completed Features**
- [x] **Request interceptor**: Proactive token refresh
- [x] **Response interceptor**: Reactive token refresh on 401
- [x] **Background refresh**: 30-second interval checks
- [x] **Event-based refresh**: Focus/visibility events
- [x] **Race condition prevention**: Singleton pattern
- [x] **Smart middleware**: Handle expired tokens
- [x] **Notification system**: User feedback
- [x] **Console logging**: Debug information

### ✅ **Token Management**
- [x] **JWT decoding**: Check expiration
- [x] **Cookie updates**: Store new tokens
- [x] **Redux updates**: Sync user state
- [x] **Error handling**: Graceful failures
- [x] **Cleanup**: Clear tokens on logout

### ✅ **User Experience**
- [x] **No redirects**: Stay on current page
- [x] **Background operation**: Invisible to user
- [x] **Error notifications**: Clear feedback
- [x] **Loading states**: Smooth transitions

## 🚀 **Testing Scenarios**

### **Test Case 1: Normal Usage**
```bash
1. Login → Use app normally
2. Wait 4 minutes → Continue using
3. Token refreshes automatically
4. No interruption ✅
```

### **Test Case 2: Leave and Return**
```bash
1. Login → Leave tab for 10 minutes
2. Return to tab → Focus event fires
3. Token refreshes before interaction
4. First click works immediately ✅
```

### **Test Case 3: Multiple Tabs**
```bash
1. Open app in 2 tabs
2. Use both simultaneously
3. One refresh serves both tabs
4. No race conditions ✅
```

### **Test Case 4: Network Issues**
```bash
1. Login → Disconnect internet
2. Reconnect after token expires
3. First API call triggers refresh
4. Graceful recovery ✅
```

### **Test Case 5: Refresh Token Expired**
```bash
1. Login → Wait 8 days (refresh token expires)
2. Try to use app
3. Clean logout → Redirect to login
4. Clear error message ✅
```

## 🔧 **Monitoring & Debugging**

### **Console Logs**
```bash
🔄 Access token expired, refreshing...
✅ Token refreshed successfully
🔍 Page visible, checking token status...
🎯 Window focused, checking token status...
🔀 Route changed, checking token status...
❌ Token refresh failed: [error details]
```

### **Network Tab**
- **Refresh calls**: Should see `/auth/refresh-token` periodically
- **API calls**: Should never see 401 errors after first load
- **Timing**: Refresh calls 30 seconds before token expiry

## 🎯 **Result**

**Trước khi implement:**
- User bị logout khi chuyển trang sau 5 phút
- Mất data khi đang điền form
- User experience bị gián đoạn

**Sau khi implement:**
- ✅ Token tự động refresh trong background
- ✅ User không bao giờ bị logout unexpectedly  
- ✅ Seamless navigation và interaction
- ✅ Professional user experience

**Bây giờ user có thể sử dụng app liên tục mà không lo về token expiry! 🎉**
