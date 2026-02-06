# Observability

- For personal projects, observability is convenient, but for enterprise applications it's crucial. This will serve as an introduction into what goes into making sure a production-level app is scalable and maintainable.

## Structured Logging with Serilog

- Beyond `Console.WriteLine()`, .NET has an interface (`ILogger`) for more robust logging, but it still has it's limitations. Serilog implements the `ILogger` interface, but gives us more formatting options (see chart in LMS)

### Configure

- By using the `.Host.UseSerilog()` method, we are replacing the default `ILogger` in our app with Serilog
- Our first arg is the app context, the second are the Logger configuration setting. In the callback, we set a few of those configuration settings

```c#
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .WriteTo.Console(outputTemplate:
            "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}")
        .WriteTo.File("logs/blog-api-.txt",
            rollingInterval: RollingInterval.Day,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}")
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", "BlogApi");
});
```

- We then need to use middleware to gather all of the information along the request/response cycle

```c#
app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    options.GetLevel = (httpContext, elapsed, ex) => ex != null ? LogEventLevel.Error : LogEventLevel.Information;
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value ?? "unknown");
        diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers.UserAgent.FirstOrDefault() ?? "unknown");
    };
});
```

- Serilog will now takeover for our Logging settings

```json
"Serilog": {
		"MinimumLevel": {
			"Default": "Information",
			"Override": {
				"Microsoft": "Warning",
				"Microsoft.Hosting.Lifetime": "Information",
				"System": "Warning"
			}
		}
	},
```

- Since we have registered our logger, we can now access it in our services just like our `ApplicationDbContext` for more granular logging

```c#
using BlogApi.Models;
using BlogApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<UserService> _logger;

    public UserService(ApplicationDbContext db, ILogger<UserService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<User?> GetAsync(Guid id)
    {
        _logger.LogInformation("Retrieving user with ID: {UserId}", id);
        return await _db.Users.FindAsync(id);
    }

    // Other UserService methods unaltered
}
```

- Show logs directory and test
- See LMS chart for comparison

## Health Checks

- Our second implementation is for health checks. There are some built-in health checks, but we'll make a custom health check to peak under the hood a bit about what's going on. Health checks give us a quick way to monitor that our dependencies are working (similar in concept to an `is this website down` site)

- We'll make a new class that implements the `IHealthCheck` interface

```c#
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace BlogApi.Infrastructure;

public class CustomHealthCheck : IHealthCheck
{

}
```

- We'll need our app context and logger

```c#
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace BlogApi.Infrastructure;

public class CustomHealthCheck : IHealthCheck
{
private readonly ApplicationDbContext _context;
    private readonly ILogger<CustomHealthCheck> _logger;

    public CustomHealthCheck(ApplicationDbContext context, ILogger<CustomHealthCheck> logger)
    {
        _context = context;
        _logger = logger;
    }
}
```

- And make our `CheckHealthAsync()` method - we'll wrap everything in a try/catch block

```c#
  public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        try
        {

        }
        catch (Exception ex)
        {

        }

    }
```

- In our basic check, we're just seeing if we have any users in the DB, which also means we can properly access our DB. We could add as many checks as we felt necessary

```c#
try
        {
            _logger.LogDebug("Performing custom health check");

            // Check database connectivity by counting users
            var userCount = await _context.Users.CountAsync(cancellationToken);

            // Check if we have any data (this might indicate proper setup)
            var hasData = userCount > 0;

            // You can add more business logic checks here
            // For example: check if external APIs are reachable, check disk space, etc.

            var result = HealthCheckResult.Healthy($"Database accessible with {userCount} users. Has data: {hasData}");

            _logger.LogDebug("Custom health check passed: {Result}", result.Description);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Custom health check failed");
            return HealthCheckResult.Unhealthy("Custom health check failed", ex);
        }
```

### Wire up in `Program.cs`

- Add our `using` directive

```c#
using Microsoft.Extensions.Diagnostics.HealthChecks;
```

- Add the standard check and our custom check

```c#
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>() // Check database connectivity
    .AddCheck("self", () => HealthCheckResult.Healthy("API is running"))
    .AddCheck<CustomHealthCheck>("custom-check"); // Custom business logic check
// Register custom health check
builder.Services.AddScoped<CustomHealthCheck>();
```

### Add HealthEndpoints

- We'll make a `health`, `health/ready`, adn `health/live` endpoints
  - Further refinements include making proper Dtos, and protecting the endpoints

```c#
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace BlogApi.Endpoints;

public static class HealthEndpoints
{
    public static void MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/health").WithTags("Health");

        group.MapGet("/", async (HealthCheckService healthCheckService) =>
        {
            var report = await healthCheckService.CheckHealthAsync();

            var response = new
            {
                status = report.Status.ToString(),
                totalDuration = report.TotalDuration.TotalMilliseconds,
                results = report.Entries.Select(entry => new
                {
                    name = entry.Key,
                    status = entry.Value.Status.ToString(),
                    duration = entry.Value.Duration.TotalMilliseconds,
                    description = entry.Value.Description,
                    data = entry.Value.Data,
                    exception = entry.Value.Exception?.Message
                })
            };

            return report.Status == HealthStatus.Healthy
                ? Results.Ok(response)
                : Results.Problem("Health check failed", statusCode: 503);
        })
        .WithDescription("Returns the health status of the application and all its dependencies");

        group.MapGet("/ready", async (HealthCheckService healthCheckService) =>
        {
            var report = await healthCheckService.CheckHealthAsync(check => check.Tags.Contains("ready"));

            var response = new
            {
                status = report.Status.ToString(),
                totalDuration = report.TotalDuration.TotalMilliseconds,
                results = report.Entries.Select(entry => new
                {
                    name = entry.Key,
                    status = entry.Value.Status.ToString(),
                    duration = entry.Value.Duration.TotalMilliseconds,
                    description = entry.Value.Description
                })
            };

            return report.Status == HealthStatus.Healthy
                ? Results.Ok(response)
                : Results.Problem("Readiness check failed", statusCode: 503);
        })
        .WithDescription("Returns whether the application is ready to receive traffic");

        group.MapGet("/live", () =>
        {
            var response = new
            {
                status = "Healthy",
                message = "Application is running",
                timestamp = DateTimeOffset.UtcNow
            };

            return Results.Ok(response);
        })
        .WithDescription("Returns whether the application is alive and responding");
    }
}
```

- Map them in `Program.cs`

```c#
app.MapHealthEndpoints();
```

- Test the endpoints (will likely need a new migration)

## Basic Metrics

- Our third and final addition is to track metrics. This helps us keep track of useful information about our app (in our case, tracking new users, posts, and login attempts)
- For this, we'll use built-in support and make a new service
- Start with the interface

```c#
// Services/Interfaces/IMetricsService.cs
namespace BlogApi.Services;

public interface IMetricsService
{
    void RecordUserCreated();
    void RecordPostCreated();
    void RecordLoginAttempt(bool successful);
}
```

- And make the service
  - The `Meter` and `Counter` classes come from .NET and alow us to keep track

```c#
using System.Diagnostics.Metrics;

namespace BlogApi.Services;

public class MetricsService : IMetricsService
{
    private readonly Meter _meter;
    private readonly Counter<int> _userCreatedCounter;
    private readonly Counter<int> _postCreatedCounter;
    private readonly Counter<int> _loginAttemptCounter;

    public MetricsService()
    {
        _meter = new Meter("BlogApi", "1.0.0");

        _userCreatedCounter = _meter.CreateCounter<int>(
            "blog_api_users_created_total",
            "Count",
            "Total number of users created");

        _postCreatedCounter = _meter.CreateCounter<int>(
            "blog_api_posts_created_total",
            "Count",
            "Total number of posts created");

        _loginAttemptCounter = _meter.CreateCounter<int>(
            "blog_api_login_attempts_total",
            "Count",
            "Total number of login attempts");
    }

    public void RecordUserCreated() => _userCreatedCounter.Add(1);

    public void RecordPostCreated() => _postCreatedCounter.Add(1);

    public void RecordLoginAttempt(bool successful) =>
        _loginAttemptCounter.Add(1, new KeyValuePair<string, object?>("successful", successful));
}
```

- Add as singleton so it has context across all endpoints

```c#
// Program.cs - Add after other service registrations
builder.Services.AddSingleton<IMetricsService, MetricsService>();
```

- Add it to our `UserService` (and `PostService` and `AuthService` for full tracking)

```c#
using BlogApi.Models;
using BlogApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<UserService> _logger;

    private readonly IMetricsService _metrics;

    public UserService(ApplicationDbContext db, ILogger<UserService> logger, IMetricsService metrics)
    {
        _db = db;
        _logger = logger;
        _metrics = metrics;
    }

    public async Task<User?> GetAsync(Guid id)
    {
        _logger.LogInformation("Retrieving user with ID: {UserId}", id);
        return await _db.Users.FindAsync(id);
    }

    public async Task<IReadOnlyList<User>> ListAsync()
    {
        return await _db.Users.ToListAsync();
    }

    public async Task<User> CreateAsync(string name, string email)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = email,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        _metrics.RecordUserCreated();
        return user;
    }

    public async Task<User?> UpdateAsync(Guid id, string? name, string? email)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return null;

        if (name != null)
            user.Name = name;

        if (email != null)
            user.Email = email;

        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return false;

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }
}
```

- For dev, we can install the metrics tool, and consume it. For production, there are tools like Prometheus, but that's outside of today's scope

```bash
# Install the tool (if not already installed)
dotnet tool install --global dotnet-counters
```

```bash
dotnet-counters monitor --name BlogApi --counters BlogApi
```

- Back to LMS for best practices and summary
