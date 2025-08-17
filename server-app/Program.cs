using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ManagementApp.Data;
using ManagementApp.Services;
using ManagementApp.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Management App API",
        Version = "v1",
        Description = "Management Application API"
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Development: SQLite
        options.UseSqlite("Data Source=management.db");
        Console.WriteLine("🔧 Using SQLite for development");
    }
    else
    {
        // Production: Try PostgreSQL first, fallback to SQLite
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");

        if (!string.IsNullOrEmpty(connectionString))
        {
            try
            {
                Console.WriteLine($"🔗 Raw DATABASE_URL length: {connectionString.Length}");

                if (connectionString.StartsWith("postgresql://"))
                {
                    // Parse PostgreSQL URL safely
                    var uri = new Uri(connectionString);
                    var userInfo = uri.UserInfo?.Split(':') ?? new string[0];

                    var username = userInfo.Length > 0 ? userInfo[0] : "";
                    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
                    var host = uri.Host ?? "localhost";
                    var port = uri.Port > 0 ? uri.Port : 5432;
                    var database = !string.IsNullOrEmpty(uri.AbsolutePath) ? uri.AbsolutePath.Trim('/') : "neondb";

                    // Build connection string with validation
                    if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                    {
                        var npgsqlConnectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;Pooling=true;Maximum Pool Size=20;";

                        options.UseNpgsql(npgsqlConnectionString);
                        Console.WriteLine($"✅ PostgreSQL configured: {host}:{port}/{database} (user: {username})");
                    }
                    else
                    {
                        throw new ArgumentException("Missing username or password in connection string");
                    }
                }
                else
                {
                    throw new ArgumentException("DATABASE_URL is not a PostgreSQL connection string");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ PostgreSQL setup failed: {ex.Message}");
                Console.WriteLine("🔄 Falling back to SQLite");

                options.UseSqlite("Data Source=production.db");
            }
        }
        else
        {
            Console.WriteLine("⚠️ No DATABASE_URL found, using SQLite");
            options.UseSqlite("Data Source=production.db");
        }
    }
});

// JWT Configuration
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSection["AccessTokenSecret"]
                ?? throw new InvalidOperationException("JwtSettings:AccessTokenSecret is missing");
var issuer = jwtSection["Issuer"] ?? "ManagementApp";
var audience = jwtSection["Audience"] ?? "ManagementApp-Users";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// CORS Configuration with flexible origins
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrEmpty(origin)) return false;
            
            // Allow localhost for development
            if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:"))
                return true;
            
            // Allow any vercel.app subdomain
            if (origin.EndsWith(".vercel.app"))
                return true;
            
            // Allow specific production domains
            var allowedDomains = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?.Split(',') ?? new string[0];
            return allowedDomains.Contains(origin);
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Register Application Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFootballMatchService, FootballMatchService>();
builder.Services.AddScoped<ICalendarEventService, CalendarEventService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Management App API V1");
    c.RoutePrefix = "swagger";
});

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Health check
app.MapGet("/health", () => "Healthy")
   .WithName("HealthCheck")
   .WithTags("Health")
   .AllowAnonymous();

// Database info endpoint
app.MapGet("/db-info", () =>
{
    var dbUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown";

    return new
    {
        environment = environment,
        hasDbUrl = !string.IsNullOrEmpty(dbUrl),
        dbType = dbUrl?.StartsWith("postgresql://") == true ? "PostgreSQL" : "SQLite",
        dbUrlLength = dbUrl?.Length ?? 0,
        timestamp = DateTime.UtcNow
    };
})
.WithName("DatabaseInfo")
.WithTags("Database")
.AllowAnonymous();

app.MapGet("/", () => new
{
    message = "Management App API",
    status = "running",
    environment = app.Environment.EnvironmentName,
    timestamp = DateTime.UtcNow,
    swagger = "/swagger"
})
.WithName("GetInfo")
.WithTags("Info")
.AllowAnonymous();

app.MapControllers();

// Database setup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        Console.WriteLine("🔌 Testing database connection...");

        if (await context.Database.CanConnectAsync())
        {
            Console.WriteLine("✅ Database connection successful");

            await context.Database.EnsureCreatedAsync();
            Console.WriteLine("✅ Database schema ensured");

            // Seed default admin user
            if (!context.Users.Any())
            {
                var adminUser = new ManagementApp.Models.User
                {
                    Username = "admin",
                    Email = "admin@managementapp.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    FullName = "System Administrator",
                    Role = ManagementApp.Constants.UserRoles.Admin,
                    IsActive = true
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
                Console.WriteLine("✅ Default admin user created");
            }
        }
        else
        {
            Console.WriteLine("❌ Cannot connect to database");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database error: {ex.Message}");
    }
}

app.Run();
