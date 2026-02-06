using Scalar.AspNetCore;
using TravelApi.Endpoints;
using TravelApi.Models;
using TravelApi.Services;
using TravelApi.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;


// Load environment variables from .env into the process early
Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<User>()
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
// Read JWT configuration from environment variables (loaded from .env)
// Support both namespaced env vars (Jwt__Key) and simple names used in .env (Key)
var envKey = Environment.GetEnvironmentVariable("Key");
if (string.IsNullOrWhiteSpace(envKey))
{
    throw new InvalidOperationException("JWT key is missing. Set 'Key' in your .env file.");
}
var envIssuer = Environment.GetEnvironmentVariable("Issuer");
var envAudience = Environment.GetEnvironmentVariable("Audience");
var envExpiry = Environment.GetEnvironmentVariable("ExpiryMinutes");

// Make sure these are available via IConfiguration for other services (e.g. AuthService)
var jwtConfigItems = new List<KeyValuePair<string, string?>>();
if (!string.IsNullOrWhiteSpace(envKey)) jwtConfigItems.Add(new KeyValuePair<string, string?>("Jwt:Key", envKey));
if (!string.IsNullOrWhiteSpace(envIssuer)) jwtConfigItems.Add(new KeyValuePair<string, string?>("Jwt:Issuer", envIssuer));
if (!string.IsNullOrWhiteSpace(envAudience)) jwtConfigItems.Add(new KeyValuePair<string, string?>("Jwt:Audience", envAudience));
if (!string.IsNullOrWhiteSpace(envExpiry)) jwtConfigItems.Add(new KeyValuePair<string, string?>("Jwt:ExpiryMinutes", envExpiry));
builder.Configuration.AddInMemoryCollection(jwtConfigItems);

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(envKey));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddOpenApi();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapPostEndpoints();

app.Run();