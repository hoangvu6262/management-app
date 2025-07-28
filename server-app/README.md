# Management App Server API

This is a .NET 8 Web API server for the Management Application that provides authentication and CRUD operations for football matches and calendar events.

## Features

- **Authentication System**: JWT-based authentication with access tokens (5-minute expiry) and refresh tokens
- **Football Match Management**: Complete CRUD operations with filtering, pagination, and soft delete
- **Calendar Event Management**: Complete CRUD operations with filtering and pagination
- **Global Error Handling**: Centralized error handling middleware
- **API Documentation**: Swagger/OpenAPI documentation
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/change-password` - Change password (requires auth)
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/revoke-token` - Revoke specific refresh token (requires auth)
- `POST /api/auth/revoke-all-tokens` - Revoke all user's refresh tokens (requires auth)

### Football Matches
All endpoints require authentication (`Authorization: Bearer <token>`)

- `POST /api/footballmatch` - Create new football match
- `GET /api/footballmatch` - Get all matches with filtering and pagination
- `GET /api/footballmatch/{id}` - Get specific match by ID
- `PUT /api/footballmatch/{id}` - Update existing match
- `DELETE /api/footballmatch/{id}` - Soft delete match

**Filtering Parameters:**
- `fromDate` - Filter from date
- `toDate` - Filter to date  
- `stadium` - Filter by stadium name
- `status` - Filter by status (COMPLETED, PENDING, CANCELLED)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (date, stadium, status, createdat)
- `sortOrder` - Sort direction (asc, desc - default: desc for newest first)

### Calendar Events
All endpoints require authentication (`Authorization: Bearer <token>`)

- `POST /api/calendarevent` - Create new calendar event
- `GET /api/calendarevent` - Get all events with filtering and pagination
- `GET /api/calendarevent/{id}` - Get specific event by ID
- `PUT /api/calendarevent/{id}` - Update existing event
- `DELETE /api/calendarevent/{id}` - Soft delete event

**Filtering Parameters:**
- `fromDate` - Filter from date
- `toDate` - Filter to date
- `type` - Filter by event type (meeting, task, reminder, other)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (date, title, type, createdat)
- `sortOrder` - Sort direction (asc, desc - default: asc)

## Configuration

All configuration is stored in `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=management.db"
  },
  "JwtSettings": {
    "AccessTokenSecret": "your-super-secret-jwt-key-for-access-tokens-that-is-at-least-256-bits-long",
    "RefreshTokenSecret": "your-super-secret-refresh-token-key-that-is-different-from-access-token-key-256-bits",
    "AccessTokenExpirationMinutes": 5,
    "RefreshTokenExpirationDays": 7,
    "Issuer": "ManagementApp",
    "Audience": "ManagementAppUsers"
  },
  "CorsSettings": {
    "AllowedOrigins": ["http://localhost:3000", "https://localhost:3000"]
  }
}
```

## Getting Started

1. **Prerequisites**
   - .NET 8 SDK
   - Visual Studio 2022 or VS Code

2. **Installation**
   ```bash
   cd server-app
   dotnet restore
   dotnet build
   ```

3. **Run the Application**
   ```bash
   dotnet run
   ```

4. **Access API Documentation**
   - Navigate to `https://localhost:5001` (or `http://localhost:5000`)
   - Swagger UI will be available at the root URL

## Default Admin Account

A default admin account is created automatically:
- **Email**: admin@managementapp.com
- **Password**: admin123
- **Role**: Admin

## Project Structure

```
server-app/
├── Controllers/           # API Controllers
├── Models/               # Entity models
├── DTOs/                 # Data Transfer Objects
│   ├── Auth/            # Authentication DTOs
│   ├── FootballMatch/   # Football match DTOs
│   └── CalendarEvent/   # Calendar event DTOs
├── Services/            # Business logic services
├── Data/                # Database context
├── Constants/           # Application constants
├── Utils/               # Utility classes
├── Middlewares/         # Custom middlewares
└── Program.cs           # Application entry point
```

## Database

- **Development**: Uses In-Memory database for easy setup
- **Production**: Configured for SQL Server (update connection string in appsettings.json)

## Security Features

- **JWT Authentication**: Separate secrets for access and refresh tokens
- **Password Hashing**: Uses BCrypt for secure password storage
- **Token Expiration**: Short-lived access tokens (5 minutes) for security
- **Refresh Token Rotation**: New refresh token issued on each refresh
- **Token Revocation**: Ability to revoke individual or all tokens

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "errors": null,
  "timestamp": "2025-01-26T10:30:00Z"
}
```

## Football Match Data Model

- **id**: Unique identifier (GUID)
- **date**: Match date
- **time**: Time period (AM/PM)
- **stadium**: Stadium name
- **matchNumber**: Match sequence number
- **type**: Match type/category
- **totalRevenue**: Total revenue amount
- **totalCost**: Total cost amount
- **recordingMoneyForPhotographer**: Photographer recording fee
- **moneyForCameraman**: Cameraman fee
- **discount**: Discount amount
- **status**: Match status (COMPLETED, PENDING, CANCELLED)
- **note**: Additional notes
- **deleteStatus**: Soft delete flag
- **createdBy/updatedBy**: User tracking
- **createdAt/updatedAt**: Timestamp tracking

## Calendar Event Data Model

- **id**: Unique identifier (GUID)
- **title**: Event title
- **description**: Event description
- **date**: Event date
- **time**: Event time
- **type**: Event type (meeting, task, reminder, other)
- **color**: Display color
- **deleteStatus**: Soft delete flag
- **createdBy/updatedBy**: User tracking
- **createdAt/updatedAt**: Timestamp tracking

## Error Handling

The API includes global error handling middleware that returns consistent error responses:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Authentication required or invalid
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

## Development Notes

- All API endpoints use English for consistency
- Soft delete is implemented for both football matches and calendar events
- Pagination is implemented for list endpoints
- User tracking (created by/updated by) is automatically handled
- CORS is configured to allow frontend integration
- Swagger UI provides interactive API documentation and testing
