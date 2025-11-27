
using Scalar.AspNetCore;
using BlogApi.Endpoints;
using BlogApi.Services;
using BlogApi.Infrastructure;
using BlogApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPostService, PostService>();
// builder.Services.AddSingleton<IUserService, InMemoryUserService>();
// builder.Services.AddSingleton<IPostService, InMemoryPostService>();
builder.Services.AddScoped<DbSeeder>();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
        await seeder.SeedAsync();
    }
}

app.MapUserEndpoints();
app.MapPostEndpoints();

app.Run();
