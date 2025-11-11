using DotNetEnv;
using FleetManager.Data;
using FleetManager.Repository;
using FleetManager.Repository.Interfaces;
using FleetManager.Security;
using FleetManager.Service;
using FleetManager.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

Env.Load();
string host = Environment.GetEnvironmentVariable("POSTGRES_HOST")!;
string port = Environment.GetEnvironmentVariable("POSTGRES_PORT")!;
string db = Environment.GetEnvironmentVariable("POSTGRES_DB")!;
string user = Environment.GetEnvironmentVariable("POSTGRES_USER")!;
string password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")!;

string refreshSecret = Environment.GetEnvironmentVariable("REFRESH_TOKEN_SECRET");

if (string.IsNullOrWhiteSpace(refreshSecret))
{
    throw new InvalidOperationException("REFRESH_TOKEN_SECRET is not set in the environment.");
}


var connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


// Data Access
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

// Security & Hashing
builder.Services.AddScoped<ITokenHashStrategy, HmacSha512HashStrategy>();
builder.Services.AddSingleton(new TokenHasher(refreshSecret, new HmacSha512HashStrategy()));
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();

// Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();



builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler("/error");
app.UseHttpsRedirection();
app.MapControllers();


app.Run();

