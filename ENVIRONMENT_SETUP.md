# Environment Variables Management

## Cách quản lý biến môi trường trong dự án

### 1. Development (Local)

#### Server App (ASP.NET Core):
- Copy `appsettings.Template.json` thành `appsettings.Development.json`
- Cập nhật các giá trị cần thiết trong `appsettings.Development.json`

#### Client App (Next.js):
- Copy `.env.template` thành `.env.local`
- Cập nhật các giá trị cần thiết trong `.env.local`

### 2. Production (EC2 Deployment)

#### Tự động (Khuyến nghị):
Khi deploy lên EC2, script `setup-production-env.sh` sẽ tự động:
- Lấy Public IP của EC2 instance
- Tạo file `.env` cho docker-compose
- Tạo file `appsettings.Production.json` với cấu hình phù hợp

#### Thủ công:
Nếu muốn cấu hình thủ công, thực hiện các bước sau trên EC2:

1. **Tạo .env file trong root directory:**
```bash
NEXT_PUBLIC_API_URL=http://YOUR_EC2_PUBLIC_IP/api
NEXT_PUBLIC_APP_NAME=Management App
NEXT_PUBLIC_APP_VERSION=1.0.0
```

2. **Tạo appsettings.Production.json trong server-app:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=management.db"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://YOUR_EC2_PUBLIC_IP",
      "https://YOUR_EC2_PUBLIC_IP",
      "http://localhost"
    ]
  },
  "JwtSettings": {
    "Secret": "YOUR_STRONG_SECRET_KEY",
    "Issuer": "ManagementApp", 
    "Audience": "ManagementApp",
    "ExpiryInMinutes": 60
  }
}
```

### 3. Files được .gitignore

#### Server App:
- `appsettings.Development.json`
- `appsettings.Local.json`
- `appsettings.Production.json`
- `*.env`
- `.env.*`

#### Client App:
- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.test`
- `.env*.local`

### 4. Biến môi trường quan trọng

#### Client App (Next.js):
- `NEXT_PUBLIC_API_URL`: URL của API backend
- `NEXT_PUBLIC_APP_NAME`: Tên ứng dụng
- `NEXT_PUBLIC_APP_VERSION`: Phiên bản ứng dụng

#### Server App (ASP.NET Core):
- `ConnectionStrings__DefaultConnection`: Connection string database
- `JwtSettings__Secret`: Secret key cho JWT
- `Cors__AllowedOrigins`: Danh sách domain được phép CORS

### 5. Security Notes

- Không bao giờ commit file environment có chứa secret/password
- Sử dụng secret key mạnh cho production
- Cập nhật CORS origins cho phù hợp với domain production
- Thay đổi log level thành Warning/Error cho production

### 6. Troubleshooting

#### Nếu API không kết nối được:
1. Kiểm tra `NEXT_PUBLIC_API_URL` trong client
2. Kiểm tra CORS settings trong server
3. Kiểm tra Security Group của EC2 có mở port 80

#### Nếu JWT không hoạt động:
1. Kiểm tra `JwtSettings__Secret` có đủ mạnh không
2. Kiểm tra clock sync giữa client và server
3. Kiểm tra token expiry time
