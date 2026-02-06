# Entity Framework Core

- specify version is installed .net 10 (9.0.10)
- dotnet ef cli tools download: https://learn.microsoft.com/en-us/ef/core/cli/dotnet
- remember to delete `Migrations` folder and `db` file to run a new migration
- migration seed fixed timestamps

## Why EF Core?

- Serves the same role Mongoose did for MongoDB in Express
- EF Core also supports MongoDB

## Adding Infrastructure to the Project

- Add `Infrastructure/ApplicationDbContext.cs` to project

## Installing EF Core

- Since this repo is using .NET 9, we can add the version to each package
  - `dotnet add package Microsoft.EntityFrameworkCore --version 9.0.10`
  - `dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 9.0.10`
  - `dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.10`

## Creating the DbContext

- Our class will inherit from `DbContext` from EFCore
  Database Context Setup: The ApplicationContext class inherits from DbContext, which is Entity Framework’s primary class for interacting with databases. The constructor accepts configuration options that specify how to connect to the database.

Entity Sets: It exposes two DbSet<T> properties:

Users – represents the Users table in the database
Posts – represents the Posts table in the database

```c#
using Microsoft.EntityFrameworkCore;
using BlogApi.Models;

namespace BlogApi.Infrastructure;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
}
```

## Navigation Properties and Relationships

- EF Core likes constructor-less classes, so that's why we followed that convention
- EF Core makes setting relationships very easy. For a 1-to-Many relationship (like users->posts), we all we need to add to our `User` model is the collection of posts. This is known as a navigation property.
  - This is a convention that allows for easy mapping - remember in SQL tables the relationship is only tracked on the many side

```c#
public ICollection<Post> Posts { get; set; } = new List<Post>();
```

- Then on our `BlogModel` we need both `UserId` to act as the foreign key, and then `User?` for reference navigation
  - It's also possible to denote many-to-many in this way, without the need for to make a class for the Join table, but that's outside the scope of today's lecture

```c#
  public User? User { get; set; }
```

- The explicit configuration is only shown for demonstration purposes, it's not recommended unless truly needed, since it's easy to make a mistake

```c#
using Microsoft.EntityFrameworkCore;
using BlogApi.Models;

namespace BlogApi.Infrastructure;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Optional: apply configurations from this assembly if you add IEntityTypeConfiguration<T> types
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationContext).Assembly);

        // Example explicit configuration (only needed if conventions are not enough):
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

## Configuring EF COre in Program.cs

- We need to register a service for our DB Context

```c#
using Scalar.AspNetCore;
using BlogApi.Endpoints;
using BlogApi.Services;
using BlogApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSingleton<IUserService, InMemoryUserService>();
builder.Services.AddSingleton<IPostService, InMemoryPostService>();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapUserEndpoints();
app.MapPostEndpoints();

app.Run();
```

- Add our connection string to `appsettings.json`
- With SQLite this is where we name our db file

```json
{
	"Logging": {
		"LogLevel": {
			"Default": "Information",
			"Microsoft.AspNetCore": "Warning"
		}
	},
	"ConnectionStrings": {
		"DefaultConnection": "Data Source=blog.db"
	},
	"AllowedHosts": "*"
}
```

## Running the Initial Migration

- This is the step you needed to globally install the EF Core CLI tools for
- Make sure to remember to delete your `Migrations` directory and `db` file any time you want to run a new migration

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

- Do not edit these files, but we can take a peak to see how it works
- Add `blob.db` to `.gitignore`

## How do we interact with the database?

- Because we've abstracted our logic into services that implement our service interfaces, to switch our our `InMemoryServices` we simply need to create new services that will instead interact with the DB

### `UserService.cs`

- Instead of a `Dictionary` for our `_store` we use our `db` connection, and pass it to the constructor

```c#
using BlogApi.Models;
using BlogApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class UserService : IUserService
{
  private readonly ApplicationDbContext _db;

 public UserService(ApplicationDbContext db)
  {
    _db = db;
  }
}
```

- Then we implement all of the same methods, but by querying our DB instead of manipulating a dictionary
- Like Mongoose, EF Core has a lot of useful methods to help us out
  - Copy one method at a time

```c#
public async Task<User?> GetAsync(Guid id)
  {
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
```

### `PostService.cs`

- Same principle for our `PostService`
  - and we can still use LINQ

```c#
using BlogApi.Models;
using BlogApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Services;

public class PostService : IPostService
{
  private readonly ApplicationDbContext _db;

  public PostService(ApplicationDbContext db)
  {
    _db = db;
  }

  public async Task<Post?> GetAsync(Guid id)
  {
    return await _db.Posts.FindAsync(id);
  }

  public async Task<IReadOnlyList<Post>> ListAsync()
  {
    return await _db.Posts.ToListAsync();
  }

  public async Task<IReadOnlyList<Post>> ListByUserAsync(Guid userId)
  {
    return await _db.Posts.Where(p => p.UserId == userId).ToListAsync();
  }

  public async Task<Post> CreateAsync(Guid userId, string title, string content)
  {
    // Validate that the user exists
    var user = await _db.Users.FindAsync(userId);
    if (user == null)
      throw new ArgumentException("User not found", nameof(userId));

    var post = new Post
    {
      Id = Guid.NewGuid(),
      UserId = userId,
      Title = title,
      Content = content,
      PublishedAt = DateTimeOffset.UtcNow
    };

    _db.Posts.Add(post);
    await _db.SaveChangesAsync();
    return post;
  }

  public async Task<Post?> UpdateAsync(Guid id, string? title, string? content)
  {
    var post = await _db.Posts.FindAsync(id);
    if (post == null)
      return null;

    if (title != null)
      post.Title = title;

    if (content != null)
      post.Content = content;

    await _db.SaveChangesAsync();
    return post;
  }

  public async Task<bool> DeleteAsync(Guid id)
  {
    var post = await _db.Posts.FindAsync(id);
    if (post == null)
      return false;

    _db.Posts.Remove(post);
    await _db.SaveChangesAsync();
    return true;
  }

}
```

- Then swap out our services in `Program.cs`
  - We won't go into the differences between `AddScoped` and `AddSingleton` now, but I'll share an article for if you're curious

```c#
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPostService, PostService>();
// builder.Services.AddSingleton<IUserService, InMemoryUserService>();
// builder.Services.AddSingleton<IPostService, InMemoryPostService>();
```

### Repository Interfaces

- Repositories would add another layer of abstraction to our queries (similar to how our `Services` already offer ` layer of abstraction). This pattern becomes useful for larger APIs, but would be overkill for our use cases.

# Seeding

## Option 1: Model seeding with HasData

- Needs constant values, and is more limited than runtime seeding, so only useful for small data sets
  - Good to know it exists, but we'll default to runtime seeding
- We'll use a fixed `DateTimeOffset`

```c#
 protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    var userAliceId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    var userBobId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    var post1Id = Guid.Parse("11111111-1111-1111-1111-111111111111");
    var post2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");

    modelBuilder.Entity<User>().HasData(
        new User { Id = userAliceId, Name = "Alice", Email = "alice@mail", CreatedAt = new DateTimeOffset(2025, 11, 3, 12, 10, 30, new TimeSpan(1, 0, 0)) },
        new User { Id = userBobId, Name = "Bob", Email = "bob@mail", CreatedAt = new DateTimeOffset(2025, 11, 3, 12, 10, 30, new TimeSpan(1, 0, 0)) }
    );

    modelBuilder.Entity<Post>().HasData(
        new Post { Id = post1Id, UserId = userAliceId, Title = "Hello World", Content = "First post", PublishedAt = new DateTimeOffset(2025, 11, 3, 12, 10, 30, new TimeSpan(1, 0, 0)) },
        new Post { Id = post2Id, UserId = userBobId, Title = "Second", Content = "Another post", PublishedAt = null }
    );
  }
```

- Run the migration
  - Remember to delete `Migrations` and `db` file when running a new migration

```bash
dotnet ef migrations add SeedInitialData
dotnet ef database update
```

## Option 2: Runtime seeding on startup

- What does idempotent mean?
- We check for an empty db, and only run seed if it is empty already
- `Infrastructure/Data/DbSeeder.cs`

```c#
using BlogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Data;

public class DbSeeder
{
    private readonly ApplicationDbContext _db;
    public DbSeeder(ApplicationDbContext db) => _db = db;

    public async Task SeedAsync(CancellationToken ct = default)
    {
        // Ensure database exists and is up to date
        await _db.Database.MigrateAsync(ct);

        if (!await _db.Users.AnyAsync(ct))
        {
            var alice = new User { Id = Guid.NewGuid(), Name = "Alice", Email = "alice@mail", CreatedAt = DateTimeOffset.UtcNow };
            var bob   = new User { Id = Guid.NewGuid(), Name = "Bob",   Email = "bob@mail",   CreatedAt = DateTimeOffset.UtcNow };

            _db.Users.AddRange(alice, bob);
            await _db.SaveChangesAsync(ct);

            _db.Posts.AddRange(
                new Post { Id = Guid.NewGuid(), UserId = alice.Id, Title = "Hello World", Content = "First post",  PublishedAt = DateTimeOffset.UtcNow },
                new Post { Id = Guid.NewGuid(), UserId = bob.Id,   Title = "Notes",       Content = "Second post", PublishedAt = null }
            );
            await _db.SaveChangesAsync(ct);
        }
    }
}
```

- Register it in `Program.cs` and only run it in dev (like our docs)

```c#

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
```

- Seeding is especially useful when working in a group (as most devs are in the real world), so everyone can have the same dataset to start with, and be up and running with working on the API
