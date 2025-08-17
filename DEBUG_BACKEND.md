## Quick Backend Test

Hãy kiểm tra xem backend có đang chạy đúng không:

### 1. Kiểm tra server đang chạy:
```bash
cd /Users/caovu/Work/ManagementApp/server-app
dotnet run
```

### 2. Test API endpoints (trong terminal khác):
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test analytics endpoint (sẽ trả về 401 nếu chưa auth)
curl http://localhost:5000/api/analytics/dashboard

# Check database info  
curl http://localhost:5000/db-info
```

### 3. Check backend logs:
- Xem console output của `dotnet run`
- Kiểm tra có error nào về database connection không
- Xem có analytics endpoints được register không

### 4. Nếu backend chưa chạy:
```bash
cd /Users/caovu/Work/ManagementApp/server-app
dotnet clean
dotnet build
dotnet run
```

### 5. Test từ browser:
- Mở http://localhost:5000/swagger
- Kiểm tra có các analytics endpoints không
- Test login trước khi test analytics

### 6. Common Issues:
- Port 5000 đã được sử dụng → thay đổi port
- Database connection lỗi → check connection string
- Missing authentication → login trước
- CORS issues → check frontend port

Hãy chạy backend trước và kiểm tra swagger documentation!
