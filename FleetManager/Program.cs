using System.Text.Json.Serialization;
using DotNetEnv;
using FleetManager.Data;
using FleetManager.Middleware;
using FleetManager.Repository;
using FleetManager.Repository.Interfaces;
using FleetManager.Security;
using FleetManager.Service;
using FleetManager.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

Env.Load();
builder.Configuration.AddEnvironmentVariables();

string host = Environment.GetEnvironmentVariable("POSTGRES_HOST")!;
string port = Environment.GetEnvironmentVariable("POSTGRES_PORT")!;
string db = Environment.GetEnvironmentVariable("POSTGRES_DB")!;
string user = Environment.GetEnvironmentVariable("POSTGRES_USER")!;
string password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")!;

string refreshSecret = Environment.GetEnvironmentVariable("REFRESH_TOKEN_SECRET")!;
if (string.IsNullOrWhiteSpace(refreshSecret))
    throw new InvalidOperationException("REFRESH_TOKEN_SECRET is not set in the environment.");

string privateKeyPath = Environment.GetEnvironmentVariable("JWT_PRIVATE_KEY_PATH")!;
string publicKeyPath = Environment.GetEnvironmentVariable("JWT_PUBLIC_KEY_PATH")!;
if (!File.Exists(privateKeyPath) || !File.Exists(publicKeyPath))
    throw new FileNotFoundException("JWT key files are missing. Check JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH in .env.");

var connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password}";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.PostConfigure<JwtSettings>(opts =>
{
    opts.PrivateKeyPath = privateKeyPath;
    opts.PublicKeyPath = publicKeyPath;
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = false;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});






// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IDriverRepository, DriverRepository>();
builder.Services.AddScoped<IMaintenanceLogRepository, MaintenanceLogRepository>();
builder.Services.AddScoped<IMaintenanceReportRepository, MaintenanceReportRepository>();

// Security & Hashing 
builder.Services.AddScoped<ITokenHashStrategy, HmacSha512HashStrategy>();
builder.Services.AddSingleton(new TokenHasher(refreshSecret, new HmacSha512HashStrategy()));
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddHttpContextAccessor();


// Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IAccessTokenService, AccessTokenService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<IMaintenanceLogService, MaintenanceLogService>();
builder.Services.AddScoped<IMaintenanceReportService, MaintenanceReportService>();



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


app.UseRouting();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("FrontendPolicy");
app.UseExceptionHandler("/error");
app.UseMiddleware<JwtAuthenticationMiddleware>();
app.UseAuthorization();
app.MapControllers();
app.Run();